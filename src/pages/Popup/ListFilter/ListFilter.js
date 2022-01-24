import React, {useState, useMemo, useCallback} from "react";
import {dateUtil, arrayUtil, configUtil} from "../../../utils";
import './ListFilter.css';
import AllIcon from "../../../assets/img/all.svg";
import AccountIcon from "../../../assets/img/account.svg";

const ListFilter = ({account, services, statisticsDetail, transaction, handleList}) => {
    const [activeService, setActiveService] = useState({
        "serviceKey": "",
        "accountId": ""
    });

    const todayTransaction = transaction && transaction[dateUtil.getTodayStartOf()];

    const filterTransaction = (serviceKey, accountId) => {
        let output;

        /**
         * (Object.keys(services).length > 1 || Object.keys(account[serviceKey]).length > 1)
         * 1 또는 0인 경우 All(전체)과 다를바 없다.
         */
        if (serviceKey && (Object.keys(services).length > 1 || Object.keys(account[serviceKey]).length > 1)) {
            output = Object.keys(transaction).reduce((acc, date) => {
                let keyValuePair = {serviceKey}

                if (accountId) {
                    keyValuePair = {...keyValuePair, accountId}
                }

                const t = arrayUtil.filterArrayObject(transaction[date], keyValuePair);

                if (t.length > 0) {
                    acc[date] = t;
                }

                return acc;
            }, {})
        } else {
            output = transaction;
        }

        return output;
    };

    const handleService = (serviceKey = '', accountId = '') => {
        handleList(filterTransaction(serviceKey, accountId));

        setActiveService({
            serviceKey
            , accountId
        });
    }

    return (
        <div className="service-filter">
            <div className="service-group">
                <div className={`service ${!activeService.serviceKey ? "active" : ""}`} onClick={() => handleService()}>
                    <img className="icon-19 mr-3" src={AllIcon}  alt="All" />
                    <span>All</span>
                </div>
                {
                    Object.keys(services).map((serviceKey,index)=> {
                        return (
                            <div key={index} className={`service ${activeService.serviceKey === serviceKey ? "active" : ""}`} onClick={() => handleService(serviceKey)}>
                                <img className="icon-19 mr-3" src={configUtil.getFavicon(configUtil.getConfig(serviceKey).domain)} alt="service" />
                                <div>
                                    <span>{services[serviceKey]}</span>
                                    {todayTransaction ? <span>(+{arrayUtil.calculateTotal(configUtil.getConfig(todayTransaction, {serviceKey}))})</span> : ''}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className={`service-detail ${activeService.serviceKey ? "active" : ""}`}>
                {
                    activeService.serviceKey ? Object.entries(statisticsDetail[activeService.serviceKey]).map(([accountId, point]) => {
                        const accountKey = Object.keys(account[activeService.serviceKey]).find(key => account[activeService.serviceKey][key] === accountId);

                        return {accountKey, accountId, point}
                    }).map(({accountKey, accountId, point}, index) => {
                        return (
                            <div key={index} className={`account ${activeService.accountId === accountId ? "active" : ""}`} onClick={() => handleService(activeService.serviceKey, accountId)}>
                                <img className="icon-19 mr-3" src={AccountIcon} alt="account" />
                                <span>{accountKey}: {point}</span>
                                {todayTransaction ? <span>(+{arrayUtil.calculateTotal(arrayUtil.filterArrayObject(todayTransaction, {accountId}))})</span> : ''}
                            </div>
                        );
                    }) : null
                }
            </div>
        </div>
    );
};


export default ListFilter;