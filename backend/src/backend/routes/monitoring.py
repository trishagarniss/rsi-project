from fastapi import APIRouter
from ..controllers.monitoring_controller import health, check_db, check_redis, ping

router = APIRouter()

router.add_api_route("/health", endpoint=health, methods=["GET"])
router.add_api_route("/check-db", endpoint=check_db, methods=["GET"])
router.add_api_route("/check-redis", endpoint=check_redis, methods=["GET"])
router.add_api_route("/ping", endpoint=ping, methods=["GET"])
