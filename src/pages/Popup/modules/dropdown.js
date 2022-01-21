import React from 'react'

import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'

function Dropdown(props) {
    return (
        <SlideDown closed={!props.open}>
            {props.children }
        </SlideDown>
    )
}

export default React.memo(Dropdown);