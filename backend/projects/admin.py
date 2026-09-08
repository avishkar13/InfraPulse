from django.contrib import admin

from .models import Environment, Project, Repository, Service, Deployment


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "organization",
        "status",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = (
        "name",
        "slug",
        "organization__name",
    )
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Repository)
class RepositoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "project",
        "provider",
        "created_at",
    )
    list_filter = ("provider",)
    search_fields = (
        "name",
        "project__name",
    )


@admin.register(Environment)
class EnvironmentAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "project",
        "type",
        "is_active",
        "created_at",
    )
    list_filter = (
        "type",
        "is_active",
    )
    search_fields = (
        "name",
        "slug",
        "project__name",
    )
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "environment",
        "status",
        "created_at",
    )
    list_filter = (
        "status",
        "environment__project",
    )
    search_fields = (
        "name",
        "slug",
        "environment__name",
    )
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Deployment)
class DeploymentAdmin(admin.ModelAdmin):
    list_display = (
        "service",
        "deployment_number",
        "commit_sha",
        "status",
        "started_at",
        "finished_at",
        "created_at",
    )
    list_filter = (
        "status",
    )
    search_fields = (
        "service__name",
        "commit_sha",
    )