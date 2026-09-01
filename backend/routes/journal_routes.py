from flask import Blueprint

from controllers.journal_controller import (
    list_journal_entries,
    create_journal_entry,
    get_single_journal_entry,
    update_journal_entry,
    delete_journal_entry
)

from middleware.jwt_required import jwt_required


journal_bp = Blueprint(
    "journal",
    __name__
)


# =====================================================
# LIST JOURNAL ENTRIES
# =====================================================

@journal_bp.route(
    "/<space_id>/journal",
    methods=["GET"]
)
@jwt_required
def get_journal_entries_route(space_id):

    return list_journal_entries(
        space_id
    )


# =====================================================
# CREATE JOURNAL ENTRY
# =====================================================

@journal_bp.route(
    "/<space_id>/journal",
    methods=["POST"]
)
@jwt_required
def create_journal_entry_route(space_id):

    return create_journal_entry(
        space_id
    )


# =====================================================
# GET SINGLE JOURNAL ENTRY
# =====================================================

@journal_bp.route(
    "/<space_id>/journal/<entry_id>",
    methods=["GET"]
)
@jwt_required
def get_single_journal_entry_route(
    space_id,
    entry_id
):

    return get_single_journal_entry(
        space_id,
        entry_id
    )


# =====================================================
# UPDATE JOURNAL ENTRY
# =====================================================

@journal_bp.route(
    "/<space_id>/journal/<entry_id>",
    methods=["PUT"]
)
@jwt_required
def update_journal_entry_route(
    space_id,
    entry_id
):

    return update_journal_entry(
        space_id,
        entry_id
    )


# =====================================================
# DELETE JOURNAL ENTRY
# =====================================================

@journal_bp.route(
    "/<space_id>/journal/<entry_id>",
    methods=["DELETE"]
)
@jwt_required
def delete_journal_entry_route(
    space_id,
    entry_id
):

    return delete_journal_entry(
        space_id,
        entry_id
    )
