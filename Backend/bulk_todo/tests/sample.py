import requests

from app.utils.utils import timer_func

TEST_SIZE = 10000


@timer_func
def test_case():
    for x in range(TEST_SIZE):
        # test auto setting sequence
        response = requests.post(
            "http://127.0.0.1:8000/api/v1/bulk_todo/project/1/task/",
            data={"name": "Test_{}".format(x), "description": "test"},
        )


@timer_func
def test_case2():
    data = [
        {"name": "MyTask_{}".format(x), "description": "Test 2"}
        for x in range(TEST_SIZE)
    ]
    response = requests.post(
        "http://127.0.0.1:8000/api/v1/bulk_todo/project/1/task/", json=data
    )


# test_case()
test_case2()
