import uuid
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from organizations.models import Organization, Membership
from projects.models import Project, Environment, Service, Deployment

User = get_user_model()

class DeploymentDomainTests(APITestCase):
    def setUp(self):
        # Create users
        self.owner = User.objects.create_user(email="owner@infrapulse.dev", password="password123")
        self.dev = User.objects.create_user(email="dev@infrapulse.dev", password="password123")
        self.viewer = User.objects.create_user(email="viewer@infrapulse.dev", password="password123")
        self.outsider = User.objects.create_user(email="outsider@infrapulse.dev", password="password123")
        
        # Create Org and Memberships
        self.org = Organization.objects.create(name="Test Org", slug="test-org")
        Membership.objects.create(organization=self.org, user=self.owner, role=Membership.Role.OWNER)
        Membership.objects.create(organization=self.org, user=self.dev, role=Membership.Role.DEVELOPER)
        Membership.objects.create(organization=self.org, user=self.viewer, role=Membership.Role.VIEWER)

        self.org2 = Organization.objects.create(name="Other Org", slug="other-org")
        Membership.objects.create(organization=self.org2, user=self.outsider, role=Membership.Role.OWNER)

        # Create Project and Environment
        self.project = Project.objects.create(organization=self.org, name="Test Project", slug="test-project")
        self.env = Environment.objects.create(project=self.project, name="Production", slug="production", type=Environment.Type.PRODUCTION)
        self.project2 = Project.objects.create(organization=self.org2, name="Other Project", slug="other-project")
        self.env2 = Environment.objects.create(project=self.project2, name="Staging", slug="staging", type=Environment.Type.STAGING)

        self.service_list_url = reverse("service-list-create", kwargs={"project_id": self.project.id})
    
    def get_deployment_list_url(self, service_id):
        return reverse("deployment-list-create", kwargs={"service_id": service_id})

    # SERVICE TESTS
    # 1. authenticated organization member can list services
    def test_member_can_list_services(self):
        Service.objects.create(environment=self.env, name="API", slug="api")
        self.client.force_authenticate(user=self.viewer)
        response = self.client.get(self.service_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    # 2. authorized developer can create service
    def test_developer_can_create_service(self):
        self.client.force_authenticate(user=self.dev)
        response = self.client.post(self.service_list_url, {
            "environment": str(self.env.id),
            "name": "Web",
            "slug": "web"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Service.objects.filter(slug="web").exists())

    # 3. viewer cannot create service
    def test_viewer_cannot_create_service(self):
        self.client.force_authenticate(user=self.viewer)
        response = self.client.post(self.service_list_url, {
            "environment": str(self.env.id),
            "name": "Web",
            "slug": "web"
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 4. service must belong to the specified project
    def test_service_must_belong_to_project(self):
        # Even if user has access to env2, it's not in self.project
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(self.service_list_url, {
            "environment": str(self.env2.id),
            "name": "Web",
            "slug": "web"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 5. environment from another project cannot be attached
    def test_cross_project_env_rejected(self):
        self.client.force_authenticate(user=self.dev)
        response = self.client.post(self.service_list_url, {
            "environment": str(self.env2.id),
            "name": "Web",
            "slug": "web"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 6. duplicate service slug inside same environment is rejected
    def test_duplicate_slug_in_environment_rejected(self):
        Service.objects.create(environment=self.env, name="API", slug="api")
        self.client.force_authenticate(user=self.dev)
        response = self.client.post(self.service_list_url, {
            "environment": str(self.env.id),
            "name": "Another API",
            "slug": "api"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 7. same service slug can exist in different environments
    def test_same_slug_in_different_environments_allowed(self):
        Service.objects.create(environment=self.env, name="API", slug="api")
        env_staging = Environment.objects.create(project=self.project, name="Staging", slug="staging", type=Environment.Type.STAGING)
        self.client.force_authenticate(user=self.dev)
        response = self.client.post(self.service_list_url, {
            "environment": str(env_staging.id),
            "name": "API Staging",
            "slug": "api"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # 8. cross-organization user cannot access service
    def test_cross_org_user_cannot_access_services(self):
        self.client.force_authenticate(user=self.outsider)
        response = self.client.get(self.service_list_url)
        # Should return 404/403 or empty array if project not found
        # In DRF, if object is not found or no permissions it might be 403 or empty depending on view implementation
        # Actually list view returns empty array if no projects found, but wait! The service url requires project_id.
        # But if project doesn't exist for that user...
        # Wait, the view doesn't explicitly check project existence in GET, it just filters.
        # But for outsider it returns empty list.
        self.assertEqual(response.data, [])

    # 9. unauthorized user cannot modify/delete service
    def test_unauthorized_modify_delete_service(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        self.client.force_authenticate(user=self.viewer)
        url = reverse("service-detail", kwargs={"id": svc.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # DEPLOYMENT TESTS
    # 10. authorized user can create deployment
    def test_authorized_user_can_create_deployment(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        self.client.force_authenticate(user=self.dev)
        response = self.client.post(self.get_deployment_list_url(svc.id), {
            "commit_sha": "a81f3c",
            "image": "img:a81f3c"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # 11. deployment starts as pending
    def test_deployment_starts_pending(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        self.client.force_authenticate(user=self.dev)
        response = self.client.post(self.get_deployment_list_url(svc.id), {
            "commit_sha": "a81f3c",
            "image": "img:a81f3c"
        })
        self.assertEqual(response.data["status"], Deployment.Status.PENDING)

    # 12. client cannot force succeeded status
    def test_client_cannot_force_status(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        self.client.force_authenticate(user=self.dev)
        response = self.client.post(self.get_deployment_list_url(svc.id), {
            "commit_sha": "a81f3c",
            "image": "img:a81f3c",
            "status": "succeeded"
        })
        self.assertEqual(response.data["status"], Deployment.Status.PENDING)

    # 13. deployment belongs to correct service
    def test_deployment_belongs_to_correct_service(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        self.client.force_authenticate(user=self.dev)
        response = self.client.post(self.get_deployment_list_url(svc.id), {
            "commit_sha": "a81f3c",
            "image": "img:a81f3c"
        })
        d = Deployment.objects.get(id=response.data["id"])
        self.assertEqual(d.service.id, svc.id)

    # 14. deployment list returns newest first
    def test_deployment_list_newest_first(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        Deployment.objects.create(service=svc, commit_sha="111", image="img:111", deployment_number=1)
        Deployment.objects.create(service=svc, commit_sha="222", image="img:222", deployment_number=2)
        
        self.client.force_authenticate(user=self.dev)
        response = self.client.get(self.get_deployment_list_url(svc.id))
        self.assertEqual(response.data[0]["commit_sha"], "222")

    # 15. deployment filtering by status works
    def test_deployment_status_filtering(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        Deployment.objects.create(service=svc, commit_sha="111", image="img:111", status=Deployment.Status.SUCCEEDED)
        Deployment.objects.create(service=svc, commit_sha="222", image="img:222", status=Deployment.Status.FAILED)
        
        self.client.force_authenticate(user=self.dev)
        response = self.client.get(self.get_deployment_list_url(svc.id) + "?status=succeeded")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["status"], "succeeded")

    # 16. deployment detail enforces organization isolation
    def test_deployment_detail_isolation(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        dep = Deployment.objects.create(service=svc, commit_sha="111", image="img:111")
        
        self.client.force_authenticate(user=self.outsider)
        url = reverse("deployment-detail", kwargs={"id": dep.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # 17. deployment logs enforce organization isolation
    def test_deployment_logs_isolation(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        dep = Deployment.objects.create(service=svc, commit_sha="111", image="img:111", logs="secret logs")
        
        self.client.force_authenticate(user=self.outsider)
        url = reverse("deployment-logs", kwargs={"id": dep.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # 18. user with deployments:create can create deployment
    def test_user_with_permission_creates_deployment(self):
        # Handled in test 10
        pass

    # 19. viewer cannot create deployment
    def test_viewer_cannot_create_deployment(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        self.client.force_authenticate(user=self.viewer)
        response = self.client.post(self.get_deployment_list_url(svc.id), {
            "commit_sha": "a81f3c",
            "image": "img:a81f3c"
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 20. only pending/running deployment can be cancelled
    def test_only_pending_running_cancelled(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        dep = Deployment.objects.create(service=svc, commit_sha="111", image="img:111", status=Deployment.Status.PENDING)
        
        self.client.force_authenticate(user=self.dev)
        url = reverse("deployment-cancel", kwargs={"id": dep.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], Deployment.Status.CANCELLED)

    # 21. succeeded deployment cannot be cancelled
    def test_succeeded_cannot_be_cancelled(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        dep = Deployment.objects.create(service=svc, commit_sha="111", image="img:111", status=Deployment.Status.SUCCEEDED)
        
        self.client.force_authenticate(user=self.dev)
        url = reverse("deployment-cancel", kwargs={"id": dep.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 22. failed deployment cannot be cancelled
    def test_failed_cannot_be_cancelled(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        dep = Deployment.objects.create(service=svc, commit_sha="111", image="img:111", status=Deployment.Status.FAILED)
        
        self.client.force_authenticate(user=self.dev)
        url = reverse("deployment-cancel", kwargs={"id": dep.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 23. cancellation sets finished_at when appropriate
    def test_cancellation_sets_finished_at(self):
        from django.utils import timezone
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        dep = Deployment.objects.create(service=svc, commit_sha="111", image="img:111", status=Deployment.Status.RUNNING, started_at=timezone.now())
        
        self.client.force_authenticate(user=self.dev)
        url = reverse("deployment-cancel", kwargs={"id": dep.id})
        response = self.client.post(url)
        
        dep.refresh_from_db()
        self.assertIsNotNone(dep.finished_at)

    # DEPLOYMENT NUMBER TESTS
    # 24. deployment numbers increment per service
    def test_deployment_numbers_increment(self):
        svc = Service.objects.create(environment=self.env, name="API", slug="api")
        self.client.force_authenticate(user=self.dev)
        r1 = self.client.post(self.get_deployment_list_url(svc.id), {"commit_sha": "a", "image": "a"})
        r2 = self.client.post(self.get_deployment_list_url(svc.id), {"commit_sha": "b", "image": "b"})
        r3 = self.client.post(self.get_deployment_list_url(svc.id), {"commit_sha": "c", "image": "c"})
        
        self.assertEqual(r1.data["deployment_number"], 1)
        self.assertEqual(r2.data["deployment_number"], 2)
        self.assertEqual(r3.data["deployment_number"], 3)

    # 25. separate services have independent deployment numbering
    def test_independent_deployment_numbering(self):
        svc1 = Service.objects.create(environment=self.env, name="API", slug="api")
        svc2 = Service.objects.create(environment=self.env, name="Web", slug="web")
        
        self.client.force_authenticate(user=self.dev)
        r1 = self.client.post(self.get_deployment_list_url(svc1.id), {"commit_sha": "a", "image": "a"})
        r2 = self.client.post(self.get_deployment_list_url(svc2.id), {"commit_sha": "b", "image": "b"})
        
        self.assertEqual(r1.data["deployment_number"], 1)
        self.assertEqual(r2.data["deployment_number"], 1)
