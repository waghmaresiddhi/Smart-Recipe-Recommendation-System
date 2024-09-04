import os

import magic
from rest_framework import serializers


class FileValidationUtil:
    @staticmethod
    def file_size_validate(allowed_size_in_mb):
        def inr_fn(value):
            size_limit = allowed_size_in_mb * 1024 * 1024
            if value.size > size_limit:
                raise serializers.ValidationError(
                    f"File size should not exceed than {allowed_size_in_mb} MB"
                )

        return inr_fn

    @staticmethod
    def content_type_validate(valid_mime_types, valid_file_extensions):
        """Returns a function which raises file validation error based on MIME type and file extensions
         https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
         https://stackoverflow.com/questions/23714383/what-are-all-the-possible-values-for-http-content-type-header#comment36445445_23714383

        Parameters:
        valid_mime_types, (List): List of valid MIME types
        valid_file_extensions (List): List of valid file extension types

        Returns:
        Reference:Returning reference function

        """

        def inr_fn(value):
            # valid_mime_types = ['image/jpeg']
            file_mime_type = magic.from_buffer(value.read(1024), mime=True)
            if file_mime_type not in valid_mime_types:
                raise serializers.ValidationError("Unsupported file type.")
            # valid_file_extensions = ['.jpg']
            ext = os.path.splitext(value.name)[1]
            if ext.lower() not in valid_file_extensions:
                raise serializers.ValidationError("Unacceptable file extension.")

        return inr_fn
