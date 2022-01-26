import React from 'react';
import ReactTooltip from "react-tooltip";
import SlidingPane from "../../../components/SlidingPane";
import {SlidePaneContext} from "../../../contexts/SlidePaneContext";
import OkIcon from "../../../assets/img/ok.svg";
import FailIcon from "../../../assets/img/fail.svg";
import LinkIcon from "../../../assets/img/link.svg";
import {configUtil, dateUtil} from "../../../utils";
import "./ItemDetail.css";

const DetailContainer = (props) => {
    const {domain} = configUtil.getConfig(props.serviceKey);

    /**
     * @TODO
     * 적립한 계정 정보 보여주기
     * 적립이 안된 경우, 사유 보여주기
     */
    //const accountKey = storageUtil.getAccountInfo(props.serviceKey, props.accountId);

    return (
        <div className="item-detail-container">
            {
                props.desc ?  <div className="desc"><h4>Description</h4> <span>{props.desc}</span></div> : null
            }
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
                        <img src={configUtil.getFavicon(domain)} alt="service" />
                    </div>
                    <div className="row-item">
                        {
                            props.originUrl ? <a href={props.originUrl} target='_blank' rel="noopener noreferrer"><img src={LinkIcon} alt="link" /></a> : null
                        }
                    </div>
                    <div className="row-item">
                        <img data-for="isSuccessIcon" src={props.isSuccess ? OkIcon : FailIcon} data-tip={props.isSuccess ? 'Done successfully.' : props.reason || 'Unknown Error'}  data-border="" alt="status" />

                        <ReactTooltip id="isSuccessIcon" />
                    </div>
                    <div className="row-item text_muted">{props.reward || 0}</div>
                </div>

            </div>
        </div>
    );
}

const ItemDetail = () => {
    const  { isPaneOpen, setIsPaneOpen, paneProps } = React.useContext(SlidePaneContext);

    const createdAt = dateUtil.dateFormat(paneProps.createdAt, 'YYYY-MM-DD HH:mm:ss');

    return (
        <SlidingPane {...paneProps} isPaneOpen={isPaneOpen} setIsPaneOpen={setIsPaneOpen} title={paneProps.title}  subTitle={createdAt} >
            <DetailContainer {...paneProps} />
        </SlidingPane>
    );
}

export default ItemDetail;