from itsdangerous import URLSafeTimedSerializer
from passlib.context import CryptContext
from app.core.config import settings


JWT_SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACTIVATION_SECRET_KEY = settings.ACTIVATION_SECRET_KEY

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
ts = URLSafeTimedSerializer(ACTIVATION_SECRET_KEY)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)