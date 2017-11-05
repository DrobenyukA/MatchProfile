import React, {Component} from "react";
import {DragLayer} from "react-dnd";

function collect (monitor) {
    const item = monitor.getItem();
    return {
        index: item && item.index,
        category: item && item.category,
        title: item && item.title,
        description: item && item.description,
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    };
}

@DragLayer(collect)
class Draggable extends Component {
    constructor(props){
        super(props)
    }

    getItemStyles(currentOffset) {
        if (!currentOffset) {
            return {
                display: 'none'
            };
        }

        // http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
        const x = currentOffset.x;
        const y = currentOffset.y;
        const transform = `translate(${x}px, ${y}px)`;

        return {
            height:"100px",
            background: "pink",
            border:"1px solid red",
            pointerEvents: 'none',
            transform: transform,
            WebkitTransform: transform
        };
    }

    render(){
        const {isDragging, currentOffset, title, description, category} = this.props;
        if (!isDragging) return null;
        return (
            <div
                className="item preview"
                style={this.getItemStyles(currentOffset)}
            >
                <h4>{title} <em>{category}</em></h4>
                <p>{description}</p>
            </div>
        );
    }
}

export default Draggable;