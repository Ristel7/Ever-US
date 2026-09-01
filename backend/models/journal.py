from datetime import datetime

from config.database import db


journal_collection = db["journal"]


journal_collection.create_index(
    [
        ("space_id", 1),
        ("created_at", -1)
    ]
)

journal_collection.create_index(
    [
        ("author_id", 1)
    ]
)
