from flask import Blueprint

from controllers.user_controller import (
    get_profile,
    upload_profile_image
)

from middleware.jwt_required import jwt_required


user_bp = Blueprint(
    "user",
    __name__
)


# =====================================================
# GET USER PROFILE
# =====================================================

@user_bp.route(
    "/profile",
    methods=["GET"]
)
@jwt_required
def get_user_profile():

    return get_profile()


# =====================================================
# UPLOAD PROFILE IMAGE
# =====================================================

@user_bp.route(
    "/profile/image",
    methods=["POST"]
)
@jwt_required
def upload_user_profile_image():

    return upload_profile_image()
