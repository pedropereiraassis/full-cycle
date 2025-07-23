import os
import dotenv
import jwt
from src.core._shared.infra.auth.auth_service_interface import AuthServiceInerface

dotenv.load_dotenv()


class JwtAuthService(AuthServiceInerface):
    def __init__(self, token: str = "") -> None:
        raw_public_key = os.getenv("AUTH_PUBLIC_KEY")
        self.public_key = (
            f"-----BEGIN PUBLIC KEY-----\n{raw_public_key}\n-----END PUBLIC KEY-----"
        )
        self.token = token.replace("Bearer ", "", 1)

    def _decode_token(self) -> dict:
        try:
            return jwt.decode(
                self.token, self.public_key, algorithms=["RS256"], audience="account"
            )
        except jwt.PyJWTError as err:
            print("Error deconding token:", err)
            return {}

    def is_authenticated(self):
        return bool(self._decode_token())

    def has_role(self, role):
        decoded_token = self._decode_token()
        realm_access = decoded_token.get("realm_access", {})
        roles = realm_access.get("roles", [])

        return role in roles
