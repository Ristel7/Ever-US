import secrets
import string


def generate_invite_code(length=8):
    """
    Generates a random invite code.
    Example: A8XK92LM
    """

    characters = string.ascii_uppercase + string.digits

    code = "".join(
        secrets.choice(characters)
        for _ in range(length)
    )

    return code
