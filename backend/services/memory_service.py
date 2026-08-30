from datetime import datetime

from bson import ObjectId

from models.gallery import memories_collection
from services.space_service import get_space_by_id
from services.upload_service import delete_memory_media
from utils.serializer import serialize


def create_memory(
    space_id,
    uploader_id,
    media_type,
    url,
    public_id,
    original_filename,
    caption=""
):
    """Persist only the explicitly supported memory fields."""
    memory = {
        "space_id": space_id,
        "uploader_id": uploader_id,
        "media_type": media_type,
        "url": url,
        "public_id": public_id,
        "original_filename": original_filename,
        "caption": caption,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = memories_collection.insert_one(memory)
    memory["_id"] = result.inserted_id
    return serialize(memory)


def get_space_memories(space_id):
    if not ObjectId.is_valid(space_id):
        return []

    memories = list(
        memories_collection.find({"space_id": space_id})
        .sort("created_at", -1)
    )
    return serialize(memories)


def get_memory_by_id(space_id, memory_id):
    if not ObjectId.is_valid(space_id) or not ObjectId.is_valid(memory_id):
        return None

    memory = memories_collection.find_one({
        "_id": ObjectId(memory_id),
        "space_id": space_id
    })
    return serialize(memory) if memory else None


def delete_memory(space_id, memory_id, requester_id):
    """Delete a memory only for its uploader or the owning space's owner."""
    memory = get_memory_by_id(space_id, memory_id)
    if not memory:
        return {"success": False, "reason": "not_found"}

    # get_space_by_id also retains the project's established space-access
    # behavior while exposing the owner_id needed for this policy.
    space = get_space_by_id(space_id, requester_id)
    if not space:
        return {"success": False, "reason": "forbidden"}

    is_uploader = memory["uploader_id"] == requester_id
    is_space_owner = space.get("owner_id") == requester_id
    if not is_uploader and not is_space_owner:
        return {"success": False, "reason": "forbidden"}

    # Remove the remote asset first. The database record remains available if
    # Cloudinary cannot confirm cleanup.
    if not delete_memory_media(memory["public_id"], memory["media_type"]):
        return {"success": False, "reason": "media_delete_failed"}

    result = memories_collection.delete_one({
        "_id": ObjectId(memory_id),
        "space_id": space_id
    })
    if result.deleted_count != 1:
        return {"success": False, "reason": "database_delete_failed"}

    return {"success": True}
