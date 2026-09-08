from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.http import Http404
from django.db import transaction

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, PermissionDenied

from .models import Membership, Organization
from .serializers import (
    MembershipSerializer,
    OrganizationSerializer,
    MembershipCreateSerializer,
    MembershipUpdateSerializer,
)
from .services import require_permission

User = get_user_model()


class OrganizationListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrganizationSerializer

    def get_queryset(self):
        return Organization.objects.filter(
            memberships__user=self.request.user
        ).distinct()

    def perform_create(self, serializer):
        organization = serializer.save()

        Membership.objects.create(
            organization=organization,
            user=self.request.user,
            role=Membership.Role.OWNER,
        )


class OrganizationDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrganizationSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Organization.objects.filter(
            memberships__user=self.request.user
        ).distinct()

    def perform_update(self, serializer):
        organization = self.get_object()

        require_permission(
            self.request.user,
            organization,
            "organization:update",
        )

        serializer.save()

    def perform_destroy(self, instance):
        require_permission(
            self.request.user,
            instance,
            "organization:delete",
        )

        instance.delete()


class OrganizationMembersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, organization_id):
        organization = get_object_or_404(
            Organization,
            id=organization_id,
        )

        require_permission(
            request.user,
            organization,
            "members:view",
        )

        memberships = Membership.objects.filter(
            organization=organization
        ).select_related("user")

        return Response(
            MembershipSerializer(
                memberships,
                many=True,
            ).data
        )

    def post(self, request, organization_id):
        organization = get_object_or_404(Organization, id=organization_id)
        require_permission(request.user, organization, "members:invite")

        serializer = MembershipCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        role = serializer.validated_data["role"]

        try:
            user_to_add = User.objects.get(email=email)
        except User.DoesNotExist:
            raise Http404("User not found.")

        if Membership.objects.filter(organization=organization, user=user_to_add).exists():
            raise ValidationError("The user is already a member of this organization.")

        membership = Membership.objects.create(
            organization=organization,
            user=user_to_add,
            role=role
        )

        return Response(MembershipSerializer(membership).data, status=status.HTTP_201_CREATED)


class OrganizationMemberDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, organization_id, membership_id):
        organization = get_object_or_404(Organization, id=organization_id)
        requester_membership = require_permission(request.user, organization, "members:update")

        target_membership = get_object_or_404(Membership, id=membership_id, organization=organization)

        serializer = MembershipUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_role = serializer.validated_data["role"]
        transfer_to = serializer.validated_data.get("transfer_ownership_to")

        # Rules checking
        if requester_membership.role == Membership.Role.ADMIN:
            if target_membership.role == Membership.Role.OWNER:
                raise PermissionDenied("Admins cannot modify an owner.")
            if new_role == Membership.Role.OWNER:
                raise PermissionDenied("Admins cannot promote someone to owner.")
        
        if requester_membership.role != Membership.Role.OWNER and target_membership.role == Membership.Role.OWNER:
            raise PermissionDenied("Only owners can modify an owner.")

        # If owner is demoting themselves
        if target_membership.id == requester_membership.id and target_membership.role == Membership.Role.OWNER and new_role != Membership.Role.OWNER:
            owner_count = Membership.objects.filter(organization=organization, role=Membership.Role.OWNER).count()
            
            if owner_count == 1:
                if not transfer_to:
                    raise ValidationError("You are the last owner. You must transfer ownership to another member.")
                
                transfer_target = get_object_or_404(Membership, id=transfer_to, organization=organization)
                
                with transaction.atomic():
                    transfer_target.role = Membership.Role.OWNER
                    transfer_target.save()
                    
                    target_membership.role = new_role
                    target_membership.save()
                
                return Response(MembershipSerializer(target_membership).data)

        target_membership.role = new_role
        target_membership.save()

        return Response(MembershipSerializer(target_membership).data)

    def delete(self, request, organization_id, membership_id):
        organization = get_object_or_404(Organization, id=organization_id)
        requester_membership = require_permission(request.user, organization, "members:remove")

        target_membership = get_object_or_404(Membership, id=membership_id, organization=organization)

        if requester_membership.role == Membership.Role.ADMIN:
            if target_membership.role == Membership.Role.OWNER:
                raise PermissionDenied("Admins cannot remove an owner.")

        if target_membership.role == Membership.Role.OWNER:
            owner_count = Membership.objects.filter(organization=organization, role=Membership.Role.OWNER).count()
            if owner_count <= 1:
                raise ValidationError("Cannot remove the last owner of the organization.")

        target_membership.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)