from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from organizations.models import Organization, Membership

User = get_user_model()

class OrganizationMembershipTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(email="owner@infrapulse.dev", password="password123")
        self.admin = User.objects.create_user(email="admin@infrapulse.dev", password="password123")
        self.developer = User.objects.create_user(email="dev@infrapulse.dev", password="password123")
        self.viewer = User.objects.create_user(email="viewer@infrapulse.dev", password="password123")
        self.outsider = User.objects.create_user(email="outsider@infrapulse.dev", password="password123")
        
        self.org = Organization.objects.create(name="Test Org", slug="test-org")
        
        self.owner_membership = Membership.objects.create(organization=self.org, user=self.owner, role=Membership.Role.OWNER)
        self.admin_membership = Membership.objects.create(organization=self.org, user=self.admin, role=Membership.Role.ADMIN)
        self.developer_membership = Membership.objects.create(organization=self.org, user=self.developer, role=Membership.Role.DEVELOPER)
        self.viewer_membership = Membership.objects.create(organization=self.org, user=self.viewer, role=Membership.Role.VIEWER)

        self.members_url = reverse("organization-members", kwargs={"organization_id": self.org.id})

    def get_member_detail_url(self, membership_id):
        return reverse("organization-member-detail", kwargs={"organization_id": self.org.id, "membership_id": membership_id})

    # 1. owner can list members
    def test_owner_can_list_members(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.get(self.members_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    # 2. owner can add developer
    def test_owner_can_add_developer(self):
        new_user = User.objects.create_user(email="newdev@infrapulse.dev", password="password123")
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(self.members_url, {"email": "newdev@infrapulse.dev", "role": Membership.Role.DEVELOPER})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Membership.objects.filter(user=new_user, organization=self.org, role=Membership.Role.DEVELOPER).exists())

    # 3. owner can add viewer
    def test_owner_can_add_viewer(self):
        new_user = User.objects.create_user(email="newviewer@infrapulse.dev", password="password123")
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(self.members_url, {"email": "newviewer@infrapulse.dev", "role": Membership.Role.VIEWER})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # 4. owner can add admin
    def test_owner_can_add_admin(self):
        new_user = User.objects.create_user(email="newadmin@infrapulse.dev", password="password123")
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(self.members_url, {"email": "newadmin@infrapulse.dev", "role": Membership.Role.ADMIN})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # 5. adding nonexistent email returns 404
    def test_add_nonexistent_email_returns_404(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(self.members_url, {"email": "nobody@infrapulse.dev", "role": Membership.Role.DEVELOPER})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # 6. adding duplicate member returns 400
    def test_add_duplicate_member_returns_400(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(self.members_url, {"email": "dev@infrapulse.dev", "role": Membership.Role.DEVELOPER})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 7. cannot directly assign owner through add-member API
    def test_cannot_directly_assign_owner(self):
        new_user = User.objects.create_user(email="newowner@infrapulse.dev", password="password123")
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(self.members_url, {"email": "newowner@infrapulse.dev", "role": Membership.Role.OWNER})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 8. admin can add a normal member
    def test_admin_can_add_normal_member(self):
        new_user = User.objects.create_user(email="newdev@infrapulse.dev", password="password123")
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.members_url, {"email": "newdev@infrapulse.dev", "role": Membership.Role.DEVELOPER})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # 9. developer cannot add member
    def test_developer_cannot_add_member(self):
        new_user = User.objects.create_user(email="newdev@infrapulse.dev", password="password123")
        self.client.force_authenticate(user=self.developer)
        response = self.client.post(self.members_url, {"email": "newdev@infrapulse.dev", "role": Membership.Role.DEVELOPER})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 10. viewer cannot add member
    def test_viewer_cannot_add_member(self):
        new_user = User.objects.create_user(email="newdev@infrapulse.dev", password="password123")
        self.client.force_authenticate(user=self.viewer)
        response = self.client.post(self.members_url, {"email": "newdev@infrapulse.dev", "role": Membership.Role.DEVELOPER})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 11. admin cannot modify owner
    def test_admin_cannot_modify_owner(self):
        self.client.force_authenticate(user=self.admin)
        url = self.get_member_detail_url(self.owner_membership.id)
        response = self.client.patch(url, {"role": Membership.Role.DEVELOPER})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 12. admin cannot remove owner
    def test_admin_cannot_remove_owner(self):
        self.client.force_authenticate(user=self.admin)
        url = self.get_member_detail_url(self.owner_membership.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 13. owner can change developer -> viewer
    def test_owner_can_change_developer_to_viewer(self):
        self.client.force_authenticate(user=self.owner)
        url = self.get_member_detail_url(self.developer_membership.id)
        response = self.client.patch(url, {"role": Membership.Role.VIEWER})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.developer_membership.refresh_from_db()
        self.assertEqual(self.developer_membership.role, Membership.Role.VIEWER)

    # 14. owner can change viewer -> developer
    def test_owner_can_change_viewer_to_developer(self):
        self.client.force_authenticate(user=self.owner)
        url = self.get_member_detail_url(self.viewer_membership.id)
        response = self.client.patch(url, {"role": Membership.Role.DEVELOPER})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.viewer_membership.refresh_from_db()
        self.assertEqual(self.viewer_membership.role, Membership.Role.DEVELOPER)

    # 15. owner can remove normal member
    def test_owner_can_remove_normal_member(self):
        self.client.force_authenticate(user=self.owner)
        url = self.get_member_detail_url(self.developer_membership.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Membership.objects.filter(id=self.developer_membership.id).exists())

    # 16. cannot remove last owner
    def test_cannot_remove_last_owner(self):
        self.client.force_authenticate(user=self.owner)
        url = self.get_member_detail_url(self.owner_membership.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 17. organization can never become ownerless
    def test_cannot_demote_last_owner(self):
        self.client.force_authenticate(user=self.owner)
        url = self.get_member_detail_url(self.owner_membership.id)
        response = self.client.patch(url, {"role": Membership.Role.ADMIN})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 18. unauthorized user from another organization cannot access members
    def test_unauthorized_user_cannot_access_members(self):
        self.client.force_authenticate(user=self.outsider)
        response = self.client.get(self.members_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 19. cross-organization membership manipulation is impossible
    def test_cross_organization_manipulation_impossible(self):
        org2 = Organization.objects.create(name="Org 2", slug="org-2")
        Membership.objects.create(organization=org2, user=self.outsider, role=Membership.Role.OWNER)
        self.client.force_authenticate(user=self.outsider)
        
        # Try to delete viewer from org 1
        url = self.get_member_detail_url(self.viewer_membership.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 20. ownership transfer is atomic
    def test_ownership_transfer_is_atomic(self):
        self.client.force_authenticate(user=self.owner)
        url = self.get_member_detail_url(self.owner_membership.id)
        
        response = self.client.patch(url, {
            "role": Membership.Role.ADMIN,
            "transfer_ownership_to": str(self.admin_membership.id)
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.owner_membership.refresh_from_db()
        self.admin_membership.refresh_from_db()
        
        self.assertEqual(self.owner_membership.role, Membership.Role.ADMIN)
        self.assertEqual(self.admin_membership.role, Membership.Role.OWNER)
