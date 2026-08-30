from datetime import datetime
from bson import ObjectId

from models.membership import memberships_collection
from models.user import users_collection


# =========================================================
# SERIALIZE MEMBERS
# =========================================================

def serialize(members):

    result = []

    for member in members:

        user_id = member.get("user_id")

        user = None

        # Convert string user_id to ObjectId
        # when looking up the user.
        try:

            if isinstance(user_id, ObjectId):

                user = users_collection.find_one({
                    "_id": user_id
                })

            else:

                user = users_collection.find_one({
                    "_id": ObjectId(
                        str(user_id)
                    )
                })

        except Exception as error:

            print(
                "User lookup failed:",
                error
            )

        member_data = {
            "id": str(member["_id"]),

            "space_id": str(
                member["space_id"]
            ),

            "user_id": str(
                user_id
            ),

            "role": member.get(
                "role",
                "member"
            ),

            "joined_at": (
                member["joined_at"].isoformat()
                if member.get("joined_at")
                else None
            ),

            "name": "Unknown User",

            "email": "",

            "profile_image": ""
        }

        # Add actual user information
        if user:

            member_data["name"] = user.get(
                "name",
                "Unknown User"
            )

            member_data["email"] = user.get(
                "email",
                ""
            )

            member_data["profile_image"] = user.get(
                "profile_image",
                ""
            )

        result.append(
            member_data
        )

    return result


# =========================================================
# ADD MEMBER
# =========================================================

def add_member(
    space_id,
    user_id,
    role="member"
):

    member = {

        "space_id": space_id,

        "user_id": user_id,

        "role": role,

        "joined_at": datetime.utcnow()

    }

    result = memberships_collection.insert_one(
        member
    )

    return str(
        result.inserted_id
    )


# =========================================================
# CHECK MEMBERSHIP
# =========================================================

def is_member(
    space_id,
    user_id
):

    member = memberships_collection.find_one({
        "space_id": space_id,
        "user_id": user_id
    })

    return member is not None


# =========================================================
# GET SPACE MEMBERS
# =========================================================

def get_space_members(
    space_id
):

    members = list(
        memberships_collection.find({
            "space_id": space_id
        })
    )

    return serialize(
        members
    )
