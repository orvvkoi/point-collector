import React, {useState} from "react";
import Avatar from 'react-avatar';
import {arrayUtil, configUtil} from "../../../utils";
import './Categories.css';
import AllIcon from "../../../assets/img/all.svg";
import ReactTooltip from "react-tooltip";

const Category = ({isActive, serviceKey, accountId, iconUrl, text, point, todayPoint, handleCategory}) => {
    return (
        <div className={`category ${isActive ? "active" : ""}`} onClick={() => handleCategory(serviceKey, accountId)} data-delay-show='1000' data-tip={text}>
            {
                accountId
                    ? <Avatar name={text} maxInitials="2" size="19" round={true} textSizeRatio={2} />
                    : <img className="icon-19 mr-3" src={iconUrl} alt="service" />
            }
            <div className="point">
                <span>{point}</span>
                {todayPoint ? <span>(+{todayPoint})</span> : ''}
            </div>
        </div>
    );
}

const Categories = ({account, services, statisticsDetail, todayTransaction, handleList}) => {
    const [activeCategory, setActiveCategory] = useState({
        "serviceKey": "",
        "accountId": ""
    });

    const handleCategory = (serviceKey = '', accountId = '') => {
        handleList(serviceKey, accountId);

        setActiveCategory({
            serviceKey
            , accountId
        });
    }

    //@TODO 계정 수가 많아지는 경우에 대한 대처 필요.
    return (
        <div className="category-container">
            {
                Object.keys(services).length > 0 && (
                    <>
                        <div className="main-category">
                            <div className={`category ${!activeCategory.serviceKey ? "active" : ""}`} onClick={() => handleCategory()}>
                                <img className="icon-19 mr-3" src={AllIcon}  alt="All" />
                                <span>All</span>
                            </div>
                            {
                                Object.keys(services).map((serviceKey)=> {

                                    const isActive = activeCategory.serviceKey === serviceKey;
                                    const iconUrl = configUtil.getFavicon(configUtil.getConfig(serviceKey).domain);
                                    const point = services[serviceKey];
                                    const todayPoint = todayTransaction? arrayUtil.calculateTotal(todayTransaction, {serviceKey}) : 0;

                                    const categoryData = {
                                        isActive, serviceKey, iconUrl, point, todayPoint, handleCategory
                                    }

                                    return <Category key={serviceKey} {...categoryData} />
                                })
                            }
                        </div>
                        <div className={`sub-category ${activeCategory.serviceKey ? "active" : ""}`}>
                            {
                                activeCategory.serviceKey && Object.entries(statisticsDetail[activeCategory.serviceKey]).map(([accountId, point]) => {
                                    const accountKey = Object.keys(account[activeCategory.serviceKey]).find(key => account[activeCategory.serviceKey][key] === accountId);

                                    return {accountKey, accountId, point}
                                }).map(({accountKey, accountId, point}) => {

                                    const isActive = activeCategory.accountId === accountId;
                                    const text = accountKey;
                                    const todayPoint = todayTransaction? arrayUtil.calculateTotal(arrayUtil.filterArrayObject(todayTransaction, {accountId})) : 0;

                                    const categoryData = {
                                        isActive, serviceKey: activeCategory.serviceKey, accountId, text, point, todayPoint, handleCategory
                                    }

                                    return (
                                        <>
                                            <Category key={accountKey} {...categoryData} />
                                            <ReactTooltip data-for={accountKey} />
                                        </>
                                    )
                                })
                            }
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default Categories;