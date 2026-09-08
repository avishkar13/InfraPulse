from django.urls import path

from .views import (
    EnvironmentDetailView,
    EnvironmentListCreateView,
    ProjectDetailView,
    ProjectListCreateView,
    RepositoryCreateUpdateView,
    ServiceListCreateView,
    ServiceDetailView,
    DeploymentListCreateView,
    DeploymentDetailView,
    DeploymentCancelView,
    DeploymentLogsView,
)


urlpatterns = [
    path(
        "",
        ProjectListCreateView.as_view(),
        name="project-list-create",
    ),

    path(
        "<uuid:id>/",
        ProjectDetailView.as_view(),
        name="project-detail",
    ),

    path(
        "<uuid:project_id>/repository/",
        RepositoryCreateUpdateView.as_view(),
        name="project-repository",
    ),

    path(
        "<uuid:project_id>/environments/",
        EnvironmentListCreateView.as_view(),
        name="environment-list-create",
    ),

    path(
        "environments/<uuid:id>/",
        EnvironmentDetailView.as_view(),
        name="environment-detail",
    ),

    path(
        "<uuid:project_id>/services/",
        ServiceListCreateView.as_view(),
        name="service-list-create",
    ),

    path(
        "services/<uuid:id>/",
        ServiceDetailView.as_view(),
        name="service-detail",
    ),

    path(
        "services/<uuid:service_id>/deployments/",
        DeploymentListCreateView.as_view(),
        name="deployment-list-create",
    ),

    path(
        "deployments/<uuid:id>/",
        DeploymentDetailView.as_view(),
        name="deployment-detail",
    ),

    path(
        "deployments/<uuid:id>/cancel/",
        DeploymentCancelView.as_view(),
        name="deployment-cancel",
    ),

    path(
        "deployments/<uuid:id>/logs/",
        DeploymentLogsView.as_view(),
        name="deployment-logs",
    ),
]