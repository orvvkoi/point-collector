import React, { useEffect, useContext, useState } from 'react';
import "react-sliding-pane/dist/react-sliding-pane.css";
import SlidingPane from "../../modules/sliding.pane";
import {SlidePaneContext} from "../../contexts/SlidePaneContext";
import OkIcon from "../../../../assets/img/ok.svg";
import FailIcon from '../../../../assets/img/fail.svg';
import LinkIcon from '../../../../assets/img/link.svg';
import * as common from "../../../Background/common";
import './ItemDetail.css';


const DetailContainer = (props) => {

    console.log('DetailContainer props ', props)

    const {domain} = common.getServiceConfig(props.serviceKey);

    /**
     * @TODO
     * 적립한 계정 정보 보여주기
     * 적립이 안된 경우, 사유 보여주기
     */
    //const accountKey = common.getAccountInfo(props.serviceKey, props.accountId);

    return (
        <div className="item-detail-container">
            <div className="table-container">
                <div className="table-row header">
                    <div className="row-item">
                        service
                    </div>
                    <div className="row-item">
                        url
                    </div>
                    <div className="row-item ">
                        status
                    </div>
                    <div className="row-item ">
                        point
                    </div>
                </div>


                <div className="table-row">
                    <div className="row-item">
                        <img src={common.getFavicon(domain)} />
                    </div>
                    <div className="row-item">
                        <a href={props.url} target='_blank'><img src={LinkIcon} /></a>
                    </div>
                    <div className="row-item"><img src={props.isSuccess ? OkIcon : FailIcon}/></div>
                    <div className="row-item text_muted">{props.reward || 0}</div>
                </div>

            </div>
        </div>
    );
}

const ItemDetail = () => {
    const  { isPaneOpen, setIsPaneOpen, paneProps } = React.useContext(SlidePaneContext);

    const createdAt = common.dateFormat(paneProps.createdAt, 'YYYY-MM-DD HH:mm:ss');

    return (
        <SlidingPane {...paneProps} isPaneOpen={isPaneOpen} setIsPaneOpen={setIsPaneOpen} title={paneProps.title}  subTitle={createdAt} >
            <DetailContainer {...paneProps} />
        </SlidingPane>
    );
}

export default ItemDetail;