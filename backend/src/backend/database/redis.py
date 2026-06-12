import redis
from src.backend.config.settings import settings

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

def get_redis_client():
    return redis_client