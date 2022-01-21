import React, {useState} from "react";
import * as common from "../../../Background/common";
import {SlidePaneContext} from "../../contexts/SlidePaneContext";
import OkIcon from "../../../../assets/img/ok.svg";
import FailIcon from "../../../../assets/img/fail.svg";
import './ListItem.css';

const ListItem = ({transaction}) => {

    const { showSlidePane } = React.useContext(SlidePaneContext);

    const items = transaction.map((t, index)=> {
        return (
            <li key={index} onClick={() => showSlidePane(t)}>
                <div className='transaction'>
                    <img className="icon-19 mr-3" src={common.getFavicon(common.getServiceConfig(t.serviceKey).domain)} />
                    <span className='title'>{t.title}</span>
                </div>
                <div >
                    <img className="icon-19 mr-3" src={t.isSuccess ? OkIcon : FailIcon} />
                    { t.reward || 0}
                </div>
            </li>

        )
    });

    return (
        <ul className="item-container">
            {items}
        </ul>
    );
}

export default ListItem;