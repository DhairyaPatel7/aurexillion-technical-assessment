from fastapi.testclient import TestClient


def register(client: TestClient, email: str = "new@example.com", password: str = "secret123"):
    return client.post("/api/v1/auth/register", json={"email": email, "password": password})


def test_register_returns_a_token(anon_client: TestClient):
    response = register(anon_client, email="alice@example.com")

    assert response.status_code == 201
    body = response.json()
    assert body["accessToken"]
    assert body["user"]["email"] == "alice@example.com"


def test_register_rejects_duplicate_email(anon_client: TestClient):
    register(anon_client, email="dup@example.com")
    assert register(anon_client, email="dup@example.com").status_code == 409


def test_login_succeeds_with_correct_password(anon_client: TestClient):
    register(anon_client, email="bob@example.com", password="secret123")
    response = anon_client.post(
        "/api/v1/auth/login", json={"email": "bob@example.com", "password": "secret123"}
    )
    assert response.status_code == 200
    assert response.json()["accessToken"]


def test_login_fails_with_wrong_password(anon_client: TestClient):
    register(anon_client, email="carol@example.com", password="secret123")
    response = anon_client.post(
        "/api/v1/auth/login", json={"email": "carol@example.com", "password": "nope"}
    )
    assert response.status_code == 401


def test_tickets_require_authentication(anon_client: TestClient):
    assert anon_client.get("/api/v1/tickets").status_code == 401


def test_me_returns_the_current_user(anon_client: TestClient):
    token = register(anon_client, email="dave@example.com").json()["accessToken"]
    response = anon_client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "dave@example.com"
