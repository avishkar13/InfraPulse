from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.utils import timezone

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied, ValidationError

from organizations.models import Organization
from organizations.services import require_permission

from .models import Environment, Project, Repository, Service, Deployment
from .serializers import (
    EnvironmentSerializer,
    ProjectSerializer,
    RepositorySerializer,
    ServiceSerializer,
    DeploymentSerializer,
)


class ProjectListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        organization_id = self.request.query_params.get("organization")

        queryset = Project.objects.filter(
            organization__memberships__user=self.request.user
        ).select_related(
            "organization",
            "repository",
        ).prefetch_related(
            "environments"
        ).annotate(
            services_count=Count("environments__services", distinct=True)
        )

        if organization_id:
            queryset = queryset.filter(organization_id=organization_id)

        return queryset.distinct()

    def perform_create(self, serializer):
        organization_id = self.request.data.get("organization")

        if not organization_id:
            raise ValidationError({"organization": "This field is required."})

        organization = get_object_or_404(Organization, id=organization_id)
        require_permission(self.request.user, organization, "projects:create")

        serializer.save(organization=organization)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProjectSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Project.objects.filter(
            organization__memberships__user=self.request.user
        ).select_related(
            "organization",
            "repository",
        ).prefetch_related(
            "environments"
        ).annotate(
            services_count=Count("environments__services", distinct=True)
        ).distinct()

    def perform_update(self, serializer):
        project = self.get_object()
        require_permission(self.request.user, project.organization, "projects:update")
        serializer.save()

    def perform_destroy(self, instance):
        require_permission(self.request.user, instance.organization, "projects:delete")
        instance.delete()


class RepositoryCreateUpdateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RepositorySerializer

    def perform_create(self, serializer):
        project_id = self.kwargs["project_id"]
        project = get_object_or_404(Project, id=project_id)
        require_permission(self.request.user, project.organization, "projects:update")
        serializer.save(project=project)


class EnvironmentListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EnvironmentSerializer

    def get_queryset(self):
        project_id = self.kwargs["project_id"]
        return Environment.objects.filter(
            project__id=project_id,
            project__organization__memberships__user=self.request.user,
        )

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs["project_id"])
        require_permission(self.request.user, project.organization, "projects:update")
        serializer.save(project=project)


class EnvironmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EnvironmentSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Environment.objects.filter(
            project__organization__memberships__user=self.request.user
        )

    def perform_update(self, serializer):
        environment = self.get_object()
        require_permission(self.request.user, environment.project.organization, "projects:update")
        serializer.save()

    def perform_destroy(self, instance):
        require_permission(self.request.user, instance.project.organization, "projects:update")
        instance.delete()


class ServiceListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ServiceSerializer

    def get_queryset(self):
        project_id = self.kwargs["project_id"]
        return Service.objects.filter(
            environment__project_id=project_id,
            environment__project__organization__memberships__user=self.request.user
        )

    def perform_create(self, serializer):
        project_id = self.kwargs["project_id"]
        project = get_object_or_404(Project, id=project_id, organization__memberships__user=self.request.user)
        
        environment = serializer.validated_data.get('environment')
        if environment.project_id != project.id:
            raise ValidationError({"environment": "Environment does not belong to the specified project."})

        require_permission(self.request.user, project.organization, "projects:update")
        serializer.save()


class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ServiceSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Service.objects.filter(
            environment__project__organization__memberships__user=self.request.user
        )

    def perform_update(self, serializer):
        service = self.get_object()
        require_permission(self.request.user, service.environment.project.organization, "projects:update")
        
        # If changing environment, ensure it belongs to the same project
        new_env = serializer.validated_data.get('environment')
        if new_env and new_env.project_id != service.environment.project_id:
            raise ValidationError({"environment": "Cannot move service to an environment in a different project."})

        serializer.save()

    def perform_destroy(self, instance):
        require_permission(self.request.user, instance.environment.project.organization, "projects:delete")
        instance.delete()


class DeploymentListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DeploymentSerializer

    def get_queryset(self):
        service_id = self.kwargs["service_id"]
        queryset = Deployment.objects.filter(
            service_id=service_id,
            service__environment__project__organization__memberships__user=self.request.user
        )
        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    def perform_create(self, serializer):
        service_id = self.kwargs["service_id"]
        service = get_object_or_404(Service, id=service_id, environment__project__organization__memberships__user=self.request.user)
        
        require_permission(self.request.user, service.environment.project.organization, "deployments:create")
        
        # Model's save() handles auto-increment of deployment_number
        serializer.save(service=service, status=Deployment.Status.PENDING)


class DeploymentDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DeploymentSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Deployment.objects.filter(
            service__environment__project__organization__memberships__user=self.request.user
        )


class DeploymentCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        deployment = get_object_or_404(
            Deployment, 
            id=id, 
            service__environment__project__organization__memberships__user=self.request.user
        )
        
        require_permission(self.request.user, deployment.service.environment.project.organization, "deployments:cancel")

        if deployment.status not in [Deployment.Status.PENDING, Deployment.Status.RUNNING]:
            raise ValidationError("Only pending or running deployments can be cancelled.")

        deployment.status = Deployment.Status.CANCELLED
        if deployment.started_at and not deployment.finished_at:
            deployment.finished_at = timezone.now()
        deployment.save()

        return Response(DeploymentSerializer(deployment).data)


class DeploymentLogsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        deployment = get_object_or_404(
            Deployment, 
            id=id, 
            service__environment__project__organization__memberships__user=self.request.user
        )
        
        require_permission(self.request.user, deployment.service.environment.project.organization, "deployments:view")

        return Response({
            "deployment_id": str(deployment.id),
            "status": deployment.status,
            "logs": deployment.logs
        })