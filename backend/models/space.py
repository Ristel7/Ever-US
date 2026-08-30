from config.database import db

spaces_collection = db["spaces"]

# Invite codes are credentials for joining a space and must never be shared by
# two spaces.  The service also retries on DuplicateKeyError for race safety.
spaces_collection.create_index(
    "invite_code", unique=True, name="unique_space_invite_code"
)
