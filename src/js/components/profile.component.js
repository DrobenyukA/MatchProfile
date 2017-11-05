import React, {Component} from "react";
import PropTypes from "prop-types";
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';

import TYPES from "../constants/types.constants";
import PROFILES from "../constants/profiles.constants";


/**
 * Specifies the drag source contract.
 * Returns the data describing the dragged item
 */
const profileSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
            title: props.title,
            description: props.description,
            category: props.category
        };
    },
    /**
     * Because we have different lists we should have specific implementation of monitors isDragging function
     */
    isDragging(props, monitor){
        return props.id === monitor.getItem().id;
    }
};

const profileTarget = {
    hover(props, monitor, component) {

        const dragged = monitor.getItem();

        const hovered = props;

        /** RULE:
         * Don't replace items with themselves
         */
        if (dragged.index === hovered.index && dragged.id === hovered.id) {
            return
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        /**
         * RULE:
         * Only perform the move when the mouse has crossed half of the items height
         * When dragging downwards, only move when the cursor is below 50%
         * When dragging upwards, only move when the cursor is above 50%
         */
        //Dragging downwards
        if (dragged.index < hovered.index && hoverClientY < hoverMiddleY) {
            return
        }

        // Dragging upwards
        if (dragged.index > hovered.index && hoverClientY > hoverMiddleY) {
            return
        }

        // Update position of element in lists
        props.onMove(dragged, hovered);

        // avoid expensive index searches.
        monitor.getItem().index = hovered.index;

        // replace the category name in item and correct index
        if (dragged.category !== hovered.category) {
            monitor.getItem().category = hovered.category;
            monitor.getItem().index = hovered.length ? hovered.length : PROFILES.FIRST_PLACE;
        }

    }
};

@DropTarget(TYPES.PROFILE, profileTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))

@DragSource(TYPES.PROFILE, profileSource, (connect, monitor) => ({
    /** Transfer decorator into props **/
    connectDragSource: connect.dragSource(),
    /** Add indicator of dragging into props **/
    isDragging: monitor.isDragging()
}))

class Profile extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {title, description, connectDragSource, connectDropTarget, isDragging} = this.props;
        const styles = isDragging ? {borderColor: "red", cursor: "move"} : {};
        return connectDragSource(
            connectDropTarget(
                <div className="profile" style={styles}>
                    <h4>{title}</h4>
                    <p>{description}</p>
                    <button>menu</button>
                </div>
            )
        )
    }
};

Profile.PropTypes = {
    id: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    description: PropTypes.string,
    onMove: PropTypes.func.isRequired,
};

export default Profile;