from rest_framework import serializers

from .models import Membership, Organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            "id",
            "name",
            "slug",
            "avatar",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class MembershipSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    organization = serializers.UUIDField(
        source="organization.id",
        read_only=True,
    )

    class Meta:
        model = Membership
        fields = (
            "id",
            "user",
            "organization",
            "role",
            "created_at",
        )
        read_only_fields = (
            "id",
            "created_at",
        )

    def get_user(self, obj):
        return {
            "id": str(obj.user.id),
            "email": obj.user.email,
            "name": obj.user.name,
            "avatar": obj.user.avatar,
        }


class MembershipCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=Membership.Role.choices)

    def validate_email(self, value):
        return value.lower().strip()

    def validate_role(self, value):
        if value == Membership.Role.OWNER:
            raise serializers.ValidationError("Cannot assign owner role directly.")
        return value


class MembershipUpdateSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=Membership.Role.choices)
    transfer_ownership_to = serializers.UUIDField(required=False, allow_null=True)