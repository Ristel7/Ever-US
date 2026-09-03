from config.database import db


timeline_collection = db["timeline"]


# Space timeline lookup
timeline_collection.create_index(
    [("space_id", 1), ("event_date", -1)]
)

# User-created timeline events
timeline_collection.create_index(
    [("author_id", 1)]
)
