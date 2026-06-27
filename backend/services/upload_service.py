import cloudinary.uploader
import config.cloudinary_config

def upload_image(file):

    result = cloudinary.uploader.upload(
        file,
        folder="everUS"
    )

    return {
        "url": result["secure_url"],
        "public_id": result["public_id"]
    }
