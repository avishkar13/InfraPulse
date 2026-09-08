import os
import sys
import django
import random
import uuid
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model
from organizations.models import Organization, Membership
from projects.models import Project, Environment, Repository, Service, Deployment

User = get_user_model()

def run_seed():
    print("Starting database seed...")

    # 1. Users
    users_data = [
        {"email": "owner@infrapulse.dev", "password": "password123", "role": Membership.Role.OWNER, "first_name": "Alice", "last_name": "Owner"},
        {"email": "admin@infrapulse.dev", "password": "password123", "role": Membership.Role.ADMIN, "first_name": "Bob", "last_name": "Admin"},
        {"email": "developer@infrapulse.dev", "password": "password123", "role": Membership.Role.DEVELOPER, "first_name": "Charlie", "last_name": "Dev"},
        {"email": "viewer@infrapulse.dev", "password": "password123", "role": Membership.Role.VIEWER, "first_name": "Diana", "last_name": "Viewer"},
    ]

    users = {}
    for data in users_data:
        user, created = User.objects.get_or_create(
            email=data["email"],
            defaults={"first_name": data["first_name"], "last_name": data["last_name"]}
        )
        if created:
            user.set_password(data["password"])
            user.save()
            print(f"Created user: {user.email}")
        users[data["role"]] = user

    # 2. Organization
    org, created = Organization.objects.get_or_create(
        slug="infrapulse-labs",
        defaults={"name": "InfraPulse Labs"}
    )
    if created:
        print(f"Created Organization: {org.name}")

    # 3. Memberships
    for role, user in users.items():
        Membership.objects.get_or_create(
            organization=org,
            user=user,
            defaults={"role": role}
        )

    # 4. Projects
    projects_data = [
        {"name": "Frontend Portal", "slug": "frontend-portal", "description": "Next.js dashboard application"},
        {"name": "Payment Gateway", "slug": "payment-gateway", "description": "Core payment processing service"},
    ]

    created_projects = []
    for data in projects_data:
        project, created = Project.objects.get_or_create(
            organization=org,
            slug=data["slug"],
            defaults={"name": "Frontend Portal", "description": data["description"]}
        )
        # Update name safely in case of defaults bug in get_or_create
        project.name = data["name"]
        project.description = data["description"]
        project.save()
        created_projects.append(project)

    frontend_proj, payment_proj = created_projects

    # 5. Repositories
    repos_data = [
        {"project": frontend_proj, "provider": Repository.Provider.GITHUB, "name": "infrapulse/frontend-portal", "url": "https://github.com/infrapulse/frontend-portal", "default_branch": "main"},
        {"project": payment_proj, "provider": Repository.Provider.GITHUB, "name": "infrapulse/payment-gateway", "url": "https://github.com/infrapulse/payment-gateway", "default_branch": "main"},
    ]

    for data in repos_data:
        Repository.objects.get_or_create(
            project=data["project"],
            defaults={
                "provider": data["provider"],
                "name": data["name"],
                "url": data["url"],
                "default_branch": data["default_branch"]
            }
        )

    # 6. Environments
    envs = []
    env_types = [
        (Environment.Type.DEVELOPMENT, "development"),
        (Environment.Type.STAGING, "staging"),
        (Environment.Type.PRODUCTION, "production")
    ]

    for proj in created_projects:
        for env_type, slug in env_types:
            env, _ = Environment.objects.get_or_create(
                project=proj,
                slug=slug,
                defaults={"name": env_type.capitalize(), "type": env_type, "is_active": True}
            )
            envs.append(env)

    print("Created projects, repositories, and environments.")

    # 7. Services
    # We will attach some services to these environments
    services_data = [
        # Frontend Portal Services
        {"project": frontend_proj, "name": "Web App", "slug": "web-app", "description": "React/Next.js UI"},
        {"project": frontend_proj, "name": "BFF API", "slug": "bff-api", "description": "Backend-for-Frontend GraphQL API"},
        # Payment Gateway Services
        {"project": payment_proj, "name": "Transaction Processor", "slug": "transaction-processor", "description": "Handles payment states"},
        {"project": payment_proj, "name": "Reconciliation Cron", "slug": "reconciliation-cron", "description": "Nightly reconciliation tasks"},
    ]

    all_services = []
    for env in envs:
        proj_services = [s for s in services_data if s["project"] == env.project]
        for s_data in proj_services:
            svc, _ = Service.objects.get_or_create(
                environment=env,
                slug=s_data["slug"],
                defaults={
                    "name": s_data["name"],
                    "description": s_data["description"],
                    "status": Service.Status.ACTIVE
                }
            )
            all_services.append(svc)
            
    print("Created services.")

    # 8. Deployments
    # We want a mix of deployment statuses
    statuses = [
        Deployment.Status.SUCCEEDED,
        Deployment.Status.FAILED,
        Deployment.Status.CANCELLED,
        Deployment.Status.RUNNING,
        Deployment.Status.PENDING
    ]

    commit_shas = [
        "a1b2c3d4e5f6", "123456abcdef", "987654fedcba", "bbbbccccdddd", "000011112222"
    ]
    
    now = timezone.now()

    for svc in all_services:
        # Give each service 3-5 deployments
        num_deployments = random.randint(3, 5)
        
        # Check if service already has deployments to avoid spamming on rerun
        if svc.deployments.exists():
            continue

        for i in range(num_deployments):
            status = random.choice(statuses)
            
            # Ensure at least some logical time progression
            start_time = now - timedelta(days=num_deployments - i, hours=random.randint(1, 10))
            finish_time = start_time + timedelta(minutes=random.randint(2, 15)) if status in [Deployment.Status.SUCCEEDED, Deployment.Status.FAILED, Deployment.Status.CANCELLED] else None

            logs = ""
            if status == Deployment.Status.SUCCEEDED:
                logs = "Fetching code...\nBuilding image...\nPushing to registry...\nDeploying to cluster...\nSuccess!"
            elif status == Deployment.Status.FAILED:
                logs = "Fetching code...\nBuilding image...\nError: Missing dependency 'lib-crypto'. Build failed."
            elif status == Deployment.Status.CANCELLED:
                logs = "Fetching code...\nBuild cancelled by user."

            dep = Deployment(
                service=svc,
                commit_sha=random.choice(commit_shas),
                image=f"ghcr.io/infrapulse/{svc.slug}:{random.choice(commit_shas)[:7]}",
                status=status,
                started_at=start_time if status != Deployment.Status.PENDING else None,
                finished_at=finish_time,
                logs=logs
            )
            
            # Since we overridden save() to handle deployment_number, we can just save
            dep.save()

    print("Created realistic deployments.")
    print("Seed completed successfully!")

if __name__ == "__main__":
    run_seed()
