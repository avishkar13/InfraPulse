import uuid

from django.db import models

from organizations.models import Organization


class Project(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        ARCHIVED = "archived", "Archived"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="projects",
    )

    name = models.CharField(max_length=150)

    slug = models.SlugField(max_length=150)

    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "slug"],
                name="unique_project_slug_per_organization",
            )
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.organization.name} / {self.name}"


class Repository(models.Model):
    class Provider(models.TextChoices):
        GITHUB = "github", "GitHub"
        GITLAB = "gitlab", "GitLab"
        BITBUCKET = "bitbucket", "Bitbucket"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    project = models.OneToOneField(
        Project,
        on_delete=models.CASCADE,
        related_name="repository",
    )

    provider = models.CharField(
        max_length=20,
        choices=Provider.choices,
        default=Provider.GITHUB,
    )

    name = models.CharField(max_length=255)

    url = models.URLField()

    default_branch = models.CharField(
        max_length=100,
        default="main",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Environment(models.Model):
    class Type(models.TextChoices):
        DEVELOPMENT = "development", "Development"
        STAGING = "staging", "Staging"
        PRODUCTION = "production", "Production"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="environments",
    )

    name = models.CharField(max_length=100)

    slug = models.SlugField(max_length=100)

    type = models.CharField(
        max_length=20,
        choices=Type.choices,
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["project", "slug"],
                name="unique_environment_slug_per_project",
            )
        ]
        ordering = ["type"]

    def __str__(self):
        return f"{self.project.name} / {self.name}"


class Service(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    environment = models.ForeignKey(
        Environment,
        on_delete=models.CASCADE,
        related_name="services",
    )

    name = models.CharField(max_length=150)

    slug = models.SlugField(max_length=150)

    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    repository_path = models.CharField(
        max_length=255,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["environment", "slug"],
                name="unique_service_slug_per_environment",
            )
        ]
        ordering = ["name"]

    def __str__(self):
        return f"{self.environment} / {self.name}"


class Deployment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        RUNNING = "running", "Running"
        SUCCEEDED = "succeeded", "Succeeded"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="deployments",
    )

    deployment_number = models.PositiveIntegerField()

    commit_sha = models.CharField(
        max_length=64,
        db_index=True,
    )

    image = models.CharField(max_length=255)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    logs = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["service", "-created_at"]),
            models.Index(fields=["service", "status"]),
        ]
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.deployment_number:
            from django.db import transaction
            with transaction.atomic():
                service = Service.objects.select_for_update().get(id=self.service_id)
                last_deployment = Deployment.objects.filter(service=service).order_by("-deployment_number").first()
                self.deployment_number = (last_deployment.deployment_number + 1) if last_deployment else 1
                super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.service.name} / #{self.deployment_number}"