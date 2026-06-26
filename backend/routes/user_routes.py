from flask import Blueprint, g
from middleware.jwt_required import jwt_required
from utils.response import success

user_bp = Blueprint("user", __name__)


@user_bp.route("/profile", methods=["GET"])
@jwt_required
def profile():

    return success(
        "Profile fetched successfully",
        {
            "user": {
                "id": g.user["_id"],
                "name": g.user["name"],
                "email": g.user["email"]
            }
        }
    )
