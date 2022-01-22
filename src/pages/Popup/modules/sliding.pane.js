import React from 'react'

import SlidingPane from "react-sliding-pane";
import 'react-slidedown/lib/slidedown.css'

const Pane = (props) => {
    return (
        <SlidingPane
            className={props.className || 'item-detail-layer-popup'}
            isOpen={props.isPaneOpen || false}
            title={props.title}
            subtitle={props.subTitle}
            width={props.width || "100%"}
            overlayClassName={props.overlayClassName || "slide-pane_overlay"}
            onRequestClose={() => props.setIsPaneOpen(false)}
        >
            {props.children}
        </SlidingPane>
    )
}

export default React.memo(Pane);