
from datetime import datetime, timezone
from uuid import uuid4


def datetime_now() -> datetime:
    return datetime.now(timezone.utc)


def get_uuid4() -> str:
    return uuid4().hex


