import PropTypes from "prop-types";
import React, { Component } from "react";
import DraggableTypes from "../constants/DraggableTypes";
import { DropTarget } from "react-dnd";

class GifDropzone extends Component {
  static propTypes = {
    src: PropTypes.string,
    // Injected by React DnD:
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  };

  render() {
    const { connectDropTarget, isOver, canDrop, src } = this.props;
    const defaultStyles = {
      //position: 'relative',
      //border: '3px solid #333'
      width: "auto",
      height: "auto",
      padding: "4px"
    };
    const overlayStyles = {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "rgba(255, 255, 255, .5)"
    };

    return connectDropTarget(
      <div style={defaultStyles}>
        <div style={isOver && canDrop ? overlayStyles : { display: "none" }} />
        {src ? <img src={src} alt="images" /> : null}
      </div>
    );
  }
}

// Decorate component with DropTarget functionality
// See react-dnd docs: http://gaearon.github.io/react-dnd/docs-overview.html
export default DropTarget(
  DraggableTypes.GIF,
  {
    // implement DropTarget interface
    drop(props, monitor, component) {
      const item = monitor.getItem();
      console.log("Dropped", item);
      props.onDrop(item, props.name);
      // TODO update state so the dropped gif is displayed here
      // Hint: you have access to props (like maybe callbacks?) passed in from above
    }
  },
  function registerWithDnD(connect, monitor) {
    return {
      // These props are injected into our component
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    };
  }
)(GifDropzone);
