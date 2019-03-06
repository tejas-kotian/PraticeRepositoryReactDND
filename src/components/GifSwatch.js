import PropTypes from "prop-types";
import React, { Component } from "react";
import { DragSource } from "react-dnd";
import DraggableTypes from "../constants/DraggableTypes";

class GifSwatch extends Component {
  static propTypes = {
    thumbnailUrl: PropTypes.string.isRequired,
    // Injected by React DnD:
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };
  constructor() {
    super();
    this.state = {
      isLoading: true
    };
  }
  componentDidMount() {
    // this.[r]
    //this.setState({isLoading: false})
  }
  // TODO run GIF on hover
  render() {
    const { isDragging, connectDragSource, thumbnailUrl } = this.props;

    const draggingStyles = {
      opacity: 0.5,
      background: "#6B45C9",
      zindex: 2
    };

    const styles = {
      ...(isDragging ? draggingStyles : {})
    };

    return connectDragSource(
      <div className="card" {...styles}>
        <img src={thumbnailUrl} style={{ width: "100%" }} alt="images" />
      </div>
    );
  }
}

// Decorate component with DragSource functionality
// See react-dnd docs: http://gaearon.github.io/react-dnd/docs-overview.html
export default DragSource(
  DraggableTypes.GIF,
  {
    // implement DragSource interface
    beginDrag(props) {
      // return data that identifies this draggable
      const item = { id: props.id };
      console.log("Dragging", item);
      return item;
    },
    endDrag(props, monitor, component) {
      return props.handleDrop(props.id);
    }
  },
  function registerWithDnD(connect, monitor) {
    return {
      // These props are injected into our component
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging()
    };
  }
)(GifSwatch);
