ROLE_PERMISSIONS = {
    "owner": {
        "organization:view",
        "organization:update",
        "organization:delete",
        "members:view",
        "members:invite",
        "members:update",
        "members:remove",
        "projects:view",
        "projects:create",
        "projects:update",
        "projects:delete",
        "deployments:view",
        "deployments:create",
        "deployments:cancel",
        "incidents:view",
        "incidents:manage",
        "settings:manage",
    },

    "admin": {
        "organization:view",
        "organization:update",
        "members:view",
        "members:invite",
        "members:update",
        "members:remove",
        "projects:view",
        "projects:create",
        "projects:update",
        "projects:delete",
        "deployments:view",
        "deployments:create",
        "deployments:cancel",
        "incidents:view",
        "incidents:manage",
        "settings:manage",
    },

    "developer": {
        "organization:view",
        "members:view",
        "projects:view",
        "projects:create",
        "projects:update",
        "deployments:view",
        "deployments:create",
        "deployments:cancel",
        "incidents:view",
    },

    "viewer": {
        "organization:view",
        "members:view",
        "projects:view",
        "deployments:view",
        "incidents:view",
    },
}


def role_has_permission(role, permission):
    return permission in ROLE_PERMISSIONS.get(role, set())