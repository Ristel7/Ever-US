from flask import Blueprint

from middleware.jwt_required import jwt_required

from controllers.note_controller import (
    get_space_notes,
    get_single_note,
    create_space_note,
    update_space_note,
    delete_space_note
)


note_bp = Blueprint(
    "note",
    __name__
)


# =========================================================
# GET ALL NOTES
# =========================================================

@note_bp.route(
    "/<space_id>/notes",
    methods=["GET"]
)
@jwt_required
def get_notes_route(space_id):

    return get_space_notes(
        space_id
    )


# =========================================================
# CREATE NOTE
# =========================================================

@note_bp.route(
    "/<space_id>/notes",
    methods=["POST"]
)
@jwt_required
def create_note_route(space_id):

    return create_space_note(
        space_id
    )


# =========================================================
# GET SINGLE NOTE
# =========================================================

@note_bp.route(
    "/<space_id>/notes/<note_id>",
    methods=["GET"]
)
@jwt_required
def get_single_note_route(
    space_id,
    note_id
):

    return get_single_note(
        space_id,
        note_id
    )


# =========================================================
# UPDATE NOTE
# =========================================================

@note_bp.route(
    "/<space_id>/notes/<note_id>",
    methods=["PUT"]
)
@jwt_required
def update_note_route(
    space_id,
    note_id
):

    return update_space_note(
        space_id,
        note_id
    )


# =========================================================
# DELETE NOTE
# =========================================================

@note_bp.route(
    "/<space_id>/notes/<note_id>",
    methods=["DELETE"]
)
@jwt_required
def delete_note_route(
    space_id,
    note_id
):

    return delete_space_note(
        space_id,
        note_id
    )
