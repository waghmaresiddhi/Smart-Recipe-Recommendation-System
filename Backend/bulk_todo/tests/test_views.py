import pytest
from rest_framework.reverse import reverse
from rest_framework import status

from bulk_todo.models import Project

TEST_SIZE = 10000

pytestmark = pytest.mark.django_db  # All tests use db


@pytest.fixture
def project():
    return Project.objects.create(name="Test")


class TestTask:
    def test_create_task(self, client, project):
        test_url = reverse(
            "project-task-list-create-update",
            kwargs={
                "project_id": project.id,
            },
        )

        for x in range(TEST_SIZE):
            # test auto setting sequence
            response = client.post(
                test_url, data={"name": "Test_{}".format(x), "description": "test"}
            )
            assert response.status_code == status.HTTP_201_CREATED
