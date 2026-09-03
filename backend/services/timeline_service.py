from datetime import datetime
from bson import ObjectId

from models.timeline import timeline_collection


def serialize_timeline_event(event):
    if not event:
        return None

    return {
        "id": str(event["_id"]),
        "space_id": event["space_id"],
        "author_id": event["author_id"],
        "title": event.get("title", ""),
        "description": event.get("description", ""),
        "event_date": event.get("event_date"),
        "created_at": event.get("created_at"),
        "updated_at": event.get("updated_at"),
    }


def create_timeline_event(
    space_id,
    author_id,
    title,
    description,
    event_date
):
    now = datetime.utcnow()

    event = {
        "space_id": space_id,
        "author_id": author_id,
        "title": title,
        "description": description,
        "event_date": event_date,
        "created_at": now,
        "updated_at": now,
    }

    result = timeline_collection.insert_one(event)

    event["_id"] = result.inserted_id

    return serialize_timeline_event(event)


def get_space_timeline(space_id):
    events = timeline_collection.find(
        {"space_id": space_id}
    ).sort("event_date", -1)

    return [
        serialize_timeline_event(event)
        for event in events
    ]


def get_timeline_event(space_id, event_id):
    try:
        object_id = ObjectId(event_id)
    except Exception:
        return None

    event = timeline_collection.find_one({
        "_id": object_id,
        "space_id": space_id
    })

    return serialize_timeline_event(event)


def update_timeline_event(
    space_id,
    event_id,
    title,
    description,
    event_date
):
    try:
        object_id = ObjectId(event_id)
    except Exception:
        return None

    result = timeline_collection.find_one_and_update(
        {
            "_id": object_id,
            "space_id": space_id
        },
        {
            "$set": {
                "title": title,
                "description": description,
                "event_date": event_date,
                "updated_at": datetime.utcnow()
            }
        },
        return_document=True
    )

    return serialize_timeline_event(result)


def delete_timeline_event(space_id, event_id):
    try:
        object_id = ObjectId(event_id)
    except Exception:
        return False

    result = timeline_collection.delete_one({
        "_id": object_id,
        "space_id": space_id
    })

    return result.deleted_count > 0
