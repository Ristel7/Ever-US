def validate_required(value):

    return value is not None and str(value).strip() != ""


def validate_length(value, max_length):

    return len(value) <= max_length
