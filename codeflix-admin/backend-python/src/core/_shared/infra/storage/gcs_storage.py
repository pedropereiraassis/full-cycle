import mimetypes
from django.conf import settings

from google.cloud import storage
from pathlib import Path

from src.core._shared.infra.storage.abstract_storage_service import (
    AbstractStorageService,
)


class GCSStorage(AbstractStorageService):
    def __init__(self) -> None:
        # Client vai procurar por env var GOOGLE_APPLICATION_CREDENTIALS
        # https://cloud.google.com/docs/authentication/provide-credentials-adc#how-to
        self.client = storage.Client()
        self.bucket = self.client.bucket(settings.CLOUD_STORAGE_BUCKET_NAME)

    def store(self, file_path: str, content: bytes, content_type: str):
        blob = self.bucket.blob(file_path)

        if not content_type:
            content_type, _ = mimetypes.guess_type(str(file_path))

        blob.upload_from_string(content, content_type=content_type)
