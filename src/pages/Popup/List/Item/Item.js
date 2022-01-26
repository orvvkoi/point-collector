import React from "react";
import ReactTooltip from "react-tooltip";
import {configUtil} from "../../../../utils";
import {SlidePaneContext} from "../../../../contexts/SlidePaneContext";
import OkIcon from "../../../../assets/img/ok.svg";
import FailIcon from "../../../../assets/img/fail.svg";
import './Item.css';

const Item = ({transaction}) => {

    const { showSlidePane } = React.useContext(SlidePaneContext);

    return (
        <>
            <ul className="item-container">
                {
                    transaction.map((t, index)=> {
                        return (
                            <li key={index} onClick={() => showSlidePane()}>
                                <div className='transaction'>
                                    <img className="icon-19 mr-3" src={configUtil.getFavicon(configUtil.getConfig(t.serviceKey).domain)} alt="service" />
                                    <span className='title'>{t.title}</span>
                                </div>
                                <div data-tip={t.isSuccess ? 'Done successfully.' : t.reason || 'Unknown Error'}>
                                    <img className={`icon-19 ${t.isSuccess ? 'mr-3 ' : ''}`} src={t.isSuccess ? OkIcon : FailIcon} alt="status" />
                                    {t.reward || 0}
                                </div>
                            </li>

                        )
                    })
                }
            </ul>
            <ReactTooltip />
        </>
    );
}

export default Item;