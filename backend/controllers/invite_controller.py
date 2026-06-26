from flask import request, g

from services.invite_service import join_space_by_invite
from utils.response import success, error


def join_space():

    data = request.get_json()

    invite_code = data.get("invite_code")

    if not invite_code:
        return error("Invite code is required", 400)

    result = join_space_by_invite(
        invite_code,
        g.user["_id"]
    )

    if not result["success"]:
        return error(result["message"], 400)

    return success(
        result["message"],
        {
            "space_id": result["space_id"]
        }
    )
