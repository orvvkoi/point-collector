import React, {useState} from "react";
import {arrayUtil, configUtil} from "../../../utils";
import './Categories.css';
import AllIcon from "../../../assets/img/all.svg";
import AccountIcon from "../../../assets/img/account.svg";

const Category = ({isActive, serviceKey, accountId, iconUrl, title, todayPoint, handleCategory}) => {
    return (
        <div className={`category ${isActive ? "active" : ""}`} onClick={() => handleCategory(serviceKey, accountId)}>
            <img className="icon-19 mr-3" src={iconUrl} alt="service" />
            <div>
                <span>{title}</span>
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

    return (
        <div className="category-container">
            <div className="main-category">
                <div className={`category ${!activeCategory.serviceKey ? "active" : ""}`} onClick={() => handleCategory()}>
                    <img className="icon-19 mr-3" src={AllIcon}  alt="All" />
                    <span>All</span>
                </div>
                {
                    Object.keys(services).map((serviceKey)=> {

                        const isActive = activeCategory.serviceKey === serviceKey;
                        const iconUrl = configUtil.getFavicon(configUtil.getConfig(serviceKey).domain);
                        const title = services[serviceKey];
                        const todayPoint = todayTransaction? arrayUtil.calculateTotal(configUtil.getConfig(todayTransaction, {serviceKey})) : 0;

                        const categoryData = {
                            isActive, serviceKey, iconUrl, title, todayPoint, handleCategory
                        }

                        return <Category key={serviceKey} {...categoryData} />
                    })
                }
            </div>
            <div className={`sub-category ${activeCategory.serviceKey ? "active" : ""}`}>
                {
                    activeCategory.serviceKey ? Object.entries(statisticsDetail[activeCategory.serviceKey]).map(([accountId, point]) => {
                        const accountKey = Object.keys(account[activeCategory.serviceKey]).find(key => account[activeCategory.serviceKey][key] === accountId);

                        return {accountKey, accountId, point}
                    }).map(({accountKey, accountId, point}) => {

                        const isActive = activeCategory.accountId === accountId;
                        const title = `${accountKey}: ${point}`;
                        const todayPoint = todayTransaction? arrayUtil.calculateTotal(arrayUtil.filterArrayObject(todayTransaction, {accountId})) : 0;

                        const categoryData = {
                            isActive, serviceKey: activeCategory.serviceKey, accountId, iconUrl: AccountIcon, title, todayPoint, handleCategory
                        }

                        return <Category key={accountKey} {...categoryData} />
                    }) : null
                }
            </div>
        </div>
    );
};

export default Categories;