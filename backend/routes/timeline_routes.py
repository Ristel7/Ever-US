from flask import Blueprint

from middleware.jwt_required import jwt_required

from controllers.timeline_controller import (
    list_timeline_events,
    create_timeline_event_controller,
    get_single_timeline_event,
    update_timeline_event_controller,
    delete_timeline_event_controller
)


timeline_bp = Blueprint(
    "timeline",
    __name__
)


@timeline_bp.route(
    "/<space_id>/timeline",
    methods=["GET"]
)
@jwt_required
def get_timeline(space_id):

    return list_timeline_events(
        space_id
    )


@timeline_bp.route(
    "/<space_id>/timeline",
    methods=["POST"]
)
@jwt_required
def create_timeline(space_id):

    return create_timeline_event_controller(
        space_id
    )


@timeline_bp.route(
    "/<space_id>/timeline/<event_id>",
    methods=["GET"]
)
@jwt_required
def get_timeline_event_route(
    space_id,
    event_id
):

    return get_single_timeline_event(
        space_id,
        event_id
    )


@timeline_bp.route(
    "/<space_id>/timeline/<event_id>",
    methods=["PUT"]
)
@jwt_required
def update_timeline(
    space_id,
    event_id
):

    return update_timeline_event_controller(
        space_id,
        event_id
    )


@timeline_bp.route(
    "/<space_id>/timeline/<event_id>",
    methods=["DELETE"]
)
@jwt_required
def delete_timeline(
    space_id,
    event_id
):

    return delete_timeline_event_controller(
        space_id,
        event_id
    )
