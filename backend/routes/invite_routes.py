from flask import Blueprint

from controllers.invite_controller import join_space
from middleware.jwt_required import jwt_required

invite_bp = Blueprint("invite", __name__)


@invite_bp.route("/join", methods=["POST"])
@jwt_required
def join_space_route():
    return join_space()
