from config.database import db

db.users.insert_one({
    "name": "Priyanshu",
    "email": "test@example.com"
})

print("User inserted successfully")
