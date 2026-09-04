from datetime import datetime

from bson import ObjectId

from models.timeline import timeline_collection


def serialize_event(event):

    return {
        "id": str(event["_id"]),
        "space_id": str(event["space_id"]),
        "author_id": str(event["author_id"]),
        "title": event.get("title", ""),
        "description": event.get("description", ""),
        "event_date": (
            event["event_date"].isoformat()
            if event.get("event_date")
            else None
        ),
        "created_at": (
            event["created_at"].isoformat()
            if event.get("created_at")
            else None
        ),
        "updated_at": (
            event["updated_at"].isoformat()
            if event.get("updated_at")
            else None
        )
    }


def create_event(
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
        "updated_at": now
    }

    result = timeline_collection.insert_one(
        event
    )

    event["_id"] = result.inserted_id

    return serialize_event(event)


def get_space_events(space_id):

    events = timeline_collection.find(
        {
            "space_id": space_id
        }
    ).sort(
        "event_date",
        -1
    )

    return [
        serialize_event(event)
        for event in events
    ]


def get_event(
    space_id,
    event_id
):

    try:

        event_object_id = ObjectId(
            event_id
        )

    except Exception:

        return None

    event = timeline_collection.find_one({
        "_id": event_object_id,
        "space_id": space_id
    })

    if not event:
        return None

    return serialize_event(event)


def update_event(
    space_id,
    event_id,
    title,
    description,
    event_date
):

    try:

        event_object_id = ObjectId(
            event_id
        )

    except Exception:

        return None

    result = timeline_collection.update_one(
        {
            "_id": event_object_id,
            "space_id": space_id
        },
        {
            "$set": {
                "title": title,
                "description": description,
                "event_date": event_date,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        return None

    return get_event(
        space_id,
        event_id
    )


def delete_event(
    space_id,
    event_id
):

    try:

        event_object_id = ObjectId(
            event_id
        )

    except Exception:

        return None

    result = timeline_collection.delete_one({
        "_id": event_object_id,
        "space_id": space_id
    })

    return result.deleted_count > 0
