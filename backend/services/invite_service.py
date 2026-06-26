from services.membership_service import add_member, is_member
from models.space import spaces_collection


def join_space_by_invite(invite_code, user_id):
    # Find the space
    space = spaces_collection.find_one({
        "invite_code": invite_code
    })

    if not space:
        return {
            "success": False,
            "message": "Invalid invite code"
        }

    space_id = str(space["_id"])

    # Check if already a member
    if is_member(space_id, user_id):
        return {
            "success": False,
            "message": "You are already a member of this space"
        }

    # Add membership
    add_member(space_id, user_id, "member")

    return {
        "success": True,
        "message": "Joined space successfully",
        "space_id": space_id
    }
