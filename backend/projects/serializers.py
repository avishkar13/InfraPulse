from rest_framework import serializers

from .models import Environment, Project, Repository, Service, Deployment


class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = (
            "id",
            "provider",
            "name",
            "url",
            "default_branch",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class EnvironmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Environment
        fields = (
            "id",
            "name",
            "slug",
            "type",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class ProjectSerializer(serializers.ModelSerializer):
    repository = RepositorySerializer(
        read_only=True
    )

    environments = EnvironmentSerializer(
        many=True,
        read_only=True
    )

    services_count = serializers.IntegerField(
        read_only=True,
        required=False,
    )

    class Meta:
        model = Project
        fields = (
            "id",
            "organization",
            "name",
            "slug",
            "description",
            "status",
            "repository",
            "environments",
            "services_count",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "organization",
            "repository",
            "environments",
            "created_at",
            "updated_at",
        )


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = (
            "id",
            "environment",
            "name",
            "slug",
            "description",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class DeploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deployment
        fields = (
            "id",
            "service",
            "deployment_number",
            "commit_sha",
            "image",
            "status",
            "started_at",
            "finished_at",
            "logs",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "service",
            "deployment_number",
            "status",
            "started_at",
            "finished_at",
            "created_at",
            "updated_at",
        )