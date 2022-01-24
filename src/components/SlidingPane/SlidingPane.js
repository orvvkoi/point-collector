import React from 'react'

import ReactSlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import "./SlidingPane.css";

const SlidingPane = (props) => {
    return (
        <ReactSlidingPane
            className={props.className || 'item-detail-layer-popup'}
            isOpen={props.isPaneOpen || false}
            title={props.title}
            subtitle={props.subTitle}
            width={props.width || "100%"}
            overlayClassName={props.overlayClassName || "slide-pane_overlay"}
            onRequestClose={() => props.setIsPaneOpen(false)}
        >
            {props.children}
        </ReactSlidingPane>
    )
}

export default React.memo(SlidingPane);