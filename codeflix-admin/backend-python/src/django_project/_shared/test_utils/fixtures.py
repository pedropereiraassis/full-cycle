import jwt
import os
import datetime
import pytest
from rest_framework.test import APIClient

from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization


@pytest.fixture(scope="session", autouse=True)
def rsa_keys():
    # 1. Gera par de chaves para testes
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    private_key_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode()

    public_key = private_key.public_key()
    public_key_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode()

    # 2. Define a env var que seu código usa
    os.environ["AUTH_PUBLIC_KEY"] = (
        public_key_pem.replace("-----BEGIN PUBLIC KEY-----\n", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replace("\n", "")
    )

    return {
        "private_key_pem": private_key_pem,
        "public_key_pem": public_key_pem,
        "private_key": private_key,
    }


@pytest.fixture(scope="session", autouse=True)
def auth_client(rsa_keys):
    # 3. Cria um payload simulando Keycloak com realm_access.roles
    payload = {
        "sub": "test-user-id",
        "aud": "account",
        "iss": "http://auth-server/",
        "realm_access": {"roles": ["admin"]},
        # "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        # "iat": datetime.datetime.utcnow(),
    }

    # 4. Gera o token com RS256
    os.environ["TOKEN"] = jwt.encode(
        payload, rsa_keys["private_key"], algorithm="RS256"
    )
