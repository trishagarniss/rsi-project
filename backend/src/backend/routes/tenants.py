from fastapi import APIRouter, status
from ..controllers.tenants_controller import (
    create_tenant_endpoint, list_tenants_endpoint, get_tenant_endpoint,
    update_tenant_endpoint, deactivate_tenant_endpoint,
)
from ..dto.tenant import TenantResponse

router = APIRouter()

router.add_api_route("/", endpoint=create_tenant_endpoint, methods=["POST"], response_model=TenantResponse, status_code=status.HTTP_201_CREATED)
router.add_api_route("/", endpoint=list_tenants_endpoint, methods=["GET"], response_model=list[TenantResponse])
router.add_api_route("/{tenant_id}", endpoint=get_tenant_endpoint, methods=["GET"], response_model=TenantResponse)
router.add_api_route("/{tenant_id}", endpoint=update_tenant_endpoint, methods=["PUT"], response_model=TenantResponse)
router.add_api_route("/{tenant_id}", endpoint=deactivate_tenant_endpoint, methods=["DELETE"])
