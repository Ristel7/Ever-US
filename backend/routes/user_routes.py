from flask import Blueprint

from controllers.user_controller import (
    get_profile,
    upload_profile_image
)

from middleware.jwt_required import jwt_required

user_bp = Blueprint("user", __name__)


@user_bp.route("/profile", methods=["GET"])
@jwt_required
def profile():
    return get_profile()


@user_bp.route("/profile-image", methods=["PUT"])
@jwt_required
def profile_image():
    return upload_profile_image()
