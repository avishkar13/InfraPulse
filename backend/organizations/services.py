from rest_framework.exceptions import PermissionDenied

from .models import Membership
from .permissions import role_has_permission


def get_membership(user, organization):
    try:
        return Membership.objects.get(
            user=user,
            organization=organization,
        )
    except Membership.DoesNotExist:
        raise PermissionDenied(
            "You are not a member of this organization."
        )


def require_permission(user, organization, permission):
    membership = get_membership(user, organization)

    if not role_has_permission(
        membership.role,
        permission,
    ):
        raise PermissionDenied(
            "You do not have permission to perform this action."
        )

    return membership