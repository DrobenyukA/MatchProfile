import React, {Component} from "react";
import PropTypes from "prop-types";
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';

import TYPES from "../constants/types.constants";
import PROFILES from "../constants/profiles.constants";

import BurgerSVG from "../../assets/dragger.svg";

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
            category: props.category,
            length: props.length
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


        /**
         * RULE:
         * prevent the replacing of last item from list
         */
        if (dragged.length === 1){
            return
        }

        // Update position of element in lists
        props.onMove(dragged, hovered);

        // avoid expensive index searches.
        monitor.getItem().index = hovered.index;

        // replace the category name in profile and setting correct index of new category list
        if (dragged.category !== hovered.category) {
            monitor.getItem().category = hovered.category;
            monitor.getItem().index = hovered.category === PROFILES.ACTIVE ? hovered.length : PROFILES.FIRST_PLACE;
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

    getPriority(){
        const {category, index} =  this.props;
        return category === PROFILES.ACTIVE ?
            <span className="priority">{index + 1}</span> : null;

    }
    render() {
        const {title, description, connectDragSource, connectDropTarget, isDragging} = this.props;
        const classNames = isDragging ? "profile placeholder" : "profile" ;
        return connectDragSource(
            connectDropTarget(
                <div className={classNames}>
                    {this.getPriority()}
                    <div className="wrapper">
                        <div className="content">
                            <h4>{title}</h4>
                            <p>{description}</p>
                        </div>
                        <div className="control">
                            <BurgerSVG />
                        </div>
                    </div>
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