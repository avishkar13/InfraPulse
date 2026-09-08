from django.urls import path

from .views import (
    OrganizationDetailView,
    OrganizationListCreateView,
    OrganizationMembersView,
    OrganizationMemberDetailView,
)

urlpatterns = [
    path(
        "",
        OrganizationListCreateView.as_view(),
        name="organization-list-create",
    ),
    path(
        "<uuid:id>/",
        OrganizationDetailView.as_view(),
        name="organization-detail",
    ),
    path(
        "<uuid:organization_id>/members/",
        OrganizationMembersView.as_view(),
        name="organization-members",
    ),
    path(
        "<uuid:organization_id>/members/<uuid:membership_id>/",
        OrganizationMemberDetailView.as_view(),
        name="organization-member-detail",
    ),
]
