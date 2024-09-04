from pathlib import Path

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import os

# Create Dir for logs
BASE_DIR = Path(__file__).resolve().parent
final_directory = BASE_DIR / '.logs'
if not os.path.exists(final_directory):
    print(".logs folder created")
    os.makedirs(final_directory)

pk_obj = rsa.generate_private_key(public_exponent=65537, key_size=2048)

private_key = pk_obj.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.TraditionalOpenSSL,
    encryption_algorithm=serialization.NoEncryption(),
)

public_key = pk_obj.public_key().public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo,
)
f = open("id_rsa", "wb")
f.write(private_key)
f.close()

f = open("id_rsa.pub", "wb")
f.write(public_key)
f.close()
env_options = [
    {"key": "DEBUG", "label": "<True/False>"},
    {"key": "DB_PRODUCTION", "label": "<True/False>"},
    {"key": "TWO_FA", "label": "<True/False>"},
    {"key": "SECRET_KEY", "label": "<secret_value/String>"},
    {"key": "EMAIL_HOST", "label": "<host (smtp) name>"},
    {"key": "EMAIL_ID", "label": "<email_id>"},
    {"key": "EMAIL_HOST_USER", "label": "<email_id>"},
    {"key": "EMAIL_HOST_PASSWORD", "label": "<password>"},
    {"key": "CLIENT_URL", "label": "<http://localhost:4200>"},
    {"key": "SERVER_URL", "label": "<http://127.0.0.1:8000>"},
    {"key": "ALLOWED_HOSTS", "label": "<127.0.0.1,>"},
    {"key": "CORS_ALLOWED_ORIGINS", "label": "<http://localhost:4200>"},
    {"key": "DRF_RECAPTCHA_SECRET_KEY", "label": "<secret_key>"},
    {
        "key": "GOOGLE_CLIENT_ID",
        "label": "<use: google_client_id for google authentication>",
    },
    {
        "key": "GOOGLE_CLIENT_SECRET",
        "label": "<use: google_client_secret for google authentication",
    },
    {
        "key": "TWITTER_API_KEY",
        "label": "use: twitter_api_key for twitter authentication",
    },
    {
        "key": "TWITTER_CONSUMER_SECRET",
        "label": "use: twitter_consumer_secret for twitter authentication",
    },
    {"key": "DB_ENGINE", "label": "<database backend>"},
    {"key": "DB_NAME", "label": "<database name>"},
    {"key": "DB_USER", "label": "<database user name>"},
    {"key": "DB_PASSWORD", "label": "<database password>"},
    {"key": "DB_HOST", "label": "<database hosted on>"},
    {"key": "DB_PORT", "label": "<database port>"},
    {
        "key": "OTP_SERVICE_API_KEY_PROPERTY",
        "label": "<sms key to send key https://2factor.in/>",
    },
    {"key": "LINKEDIN_CLIENT_ID", "label": "Linkedin Keys"},
    {"key": "LINKEDIN_CLIENT_SECRET", "label": "Linkedin Keys"},
]
flag_env_exist = True
try:
    f = open(".env")
except IOError:
    flag_env_exist = False
finally:
    f.close()


def generate_env_strings(key, label):
    value = input("Please enter value for " + key + "(" + label + "):")
    return key + "=" + value + "\n"


def create_env():
    file = open(".env", "w")
    for env in env_options:
        file.writelines(generate_env_strings(env["key"], env["label"]))
    file.close()


def old_hash():
    # from cryptography.hazmat.primitives import serialization as crypto_serialization
    # from cryptography.hazmat.primitives.asymmetric import rsa
    # from cryptography.hazmat.backends import default_backend as crypto_default_backend

    key = rsa.generate_private_key(
        backend=crypto_default_backend(), public_exponent=65537, key_size=2048
    )

    private_key = key.private_bytes(
        crypto_serialization.Encoding.PEM,
        crypto_serialization.PrivateFormat.PKCS8,
        crypto_serialization.NoEncryption(),
    )

    public_key = key.public_key().public_bytes(
        crypto_serialization.Encoding.OpenSSH, crypto_serialization.PublicFormat.OpenSSH
    )


if flag_env_exist:
    value = input(
        ".env file is already exist! Do you want to overwrite it (Y/N): "
    ).lower()
    if value == "y":
        create_env()
    else:
        print("Exiting...!")
else:
    create_env()
