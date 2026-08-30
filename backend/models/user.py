from config.database import db

users_collection = db["users"]

# Enforce the application-level uniqueness check even when registrations race.
users_collection.create_index("email", unique=True, name="unique_user_email")
