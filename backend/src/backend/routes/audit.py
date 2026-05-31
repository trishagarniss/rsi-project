from fastapi import APIRouter
from ..controllers.audit_controller import list_audit_logs, list_tenant_logs

router = APIRouter()

router.add_api_route("/", endpoint=list_audit_logs, methods=["GET"])
router.add_api_route("/my-tenant", endpoint=list_tenant_logs, methods=["GET"])
