from fastapi import APIRouter, status
from ..controllers.auth_controller import (
    login, refresh_token, logout, get_me, change_password, create_user_endpoint,
)
from ..dto.user import LoginResponse, UserResponse, UserCreateResponse

router = APIRouter()

router.add_api_route("/login", endpoint=login, methods=["POST"], response_model=LoginResponse)
router.add_api_route("/refresh", endpoint=refresh_token, methods=["POST"])
router.add_api_route("/logout", endpoint=logout, methods=["POST"])
router.add_api_route("/me", endpoint=get_me, methods=["GET"], response_model=UserResponse)
router.add_api_route("/change-password", endpoint=change_password, methods=["PUT"])
router.add_api_route("/users", endpoint=create_user_endpoint, methods=["POST"], response_model=UserCreateResponse, status_code=status.HTTP_201_CREATED)
