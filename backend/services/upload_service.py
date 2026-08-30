import cloudinary.uploader
import config.cloudinary_config
import os


MAX_MEMORY_FILE_SIZE = 100 * 1024 * 1024
ALLOWED_MEMORY_EXTENSIONS = {
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".webp": "image",
    ".mp4": "video",
    ".webm": "video"
}

def upload_image(file):

    result = cloudinary.uploader.upload(
        file,
        folder="everUS"
    )

    return {
        "url": result["secure_url"],
        "public_id": result["public_id"]
    }


def _detect_media_type(file):
    """Determine supported media type from file bytes, not request metadata."""
    stream = file.stream
    stream.seek(0)
    header = stream.read(32)
    stream.seek(0)

    if header.startswith(b"\xff\xd8\xff"):
        return "image"
    if header.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image"
    if header.startswith(b"RIFF") and header[8:12] == b"WEBP":
        return "image"
    if len(header) >= 8 and header[4:8] == b"ftyp":
        return "video"
    if header.startswith(b"\x1a\x45\xdf\xa3"):
        return "video"
    return None


def validate_memory_file(file):
    if not file or not isinstance(file.filename, str) or not file.filename.strip():
        return None, "Memory file is required"

    extension = os.path.splitext(file.filename)[1].lower()
    expected_type = ALLOWED_MEMORY_EXTENSIONS.get(extension)
    if not expected_type:
        return None, "Unsupported memory file type"

    try:
        stream = file.stream
        stream.seek(0, os.SEEK_END)
        size = stream.tell()
        stream.seek(0)
    except (AttributeError, OSError):
        return None, "Unable to read memory file"

    if size <= 0:
        return None, "Memory file cannot be empty"
    if size > MAX_MEMORY_FILE_SIZE:
        return None, "Memory file exceeds the 100 MB limit"

    detected_type = _detect_media_type(file)
    if detected_type != expected_type:
        return None, "File contents do not match the selected media type"

    return detected_type, None


def upload_memory_media(file, media_type):
    result = cloudinary.uploader.upload(
        file,
        folder="everUS/memories",
        resource_type=media_type
    )
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"]
    }


def delete_memory_media(public_id, media_type):
    try:
        result = cloudinary.uploader.destroy(
            public_id,
            resource_type=media_type,
            invalidate=True
        )
    except Exception:
        return False

    return result.get("result") in {"ok", "not found"}
