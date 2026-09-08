from django.contrib import admin

from .models import Membership, Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "created_at",
    )

    search_fields = (
        "name",
        "slug",
    )


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = (
        "organization",
        "user",
        "role",
        "created_at",
    )

    list_filter = (
        "role",
        "organization",
    )

    search_fields = (
        "organization__name",
        "user__email",
        "user__name",
    )