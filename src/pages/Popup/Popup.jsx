import React, {useState, useEffect, useMemo, useCallback, useRef } from 'react';
import * as common from "../Background/common";
import List from "./Components/List/List";
import './Popup.css';
import AllIcon from "../../assets/img/all.svg";
import AccountIcon from "../../assets/img/account.svg";
import {getServiceConfig} from "../Background/common";

/**
 * @TODO
 * 실제 크롬 적용시 드랍다운 애니메이션 부드럽지 못한 현상.
 * -> 세로폭 고정 해봐야함.
 */
const Popup = () => {
    const [storageData, setStorageData] = useState({
        "account": {},
        "statistics": {
            "total": 0
        },
        "statisticsDetail" : {},
        "transaction": {}
    });

    const [activeService, setActiveService] = useState({
        "serviceKey": "",
        "accountId": "",
        "details": []
    });

    const {account, statistics: {total, ...services}, statisticsDetail, transaction} = {...storageData}

    const filterTransaction = (() => {
        const {serviceKey, accountId} = {...activeService};

        let output;

		/**
		 * (Object.keys(services).length > 1 || Object.keys(account[serviceKey]).length > 1)
		 * 1 또는 0인 경우 All(전체)과 다를바 없다.
		 */
        if(serviceKey && (Object.keys(services).length > 1 || Object.keys(account[serviceKey]).length > 1)) {
            output = Object.keys(transaction).reduce((acc, date) => {
                const t = transaction[date].filter(o=> {
					if(accountId) {
						return o.serviceKey === serviceKey
							&& o.accountId === accountId;
					} else {
						return o.serviceKey === serviceKey;
					}
                });

                if(t.length > 0) {
                    acc[date] = t;
                }

                return acc;
            }, {})
        } else {
            output = transaction;
        }

        return output;
    })();

    const handleService = (serviceKey = '', accountId = '') => {
        const details = (() => {
            if(serviceKey) {
                return Object.entries(statisticsDetail[serviceKey]).map(([accountId, point], index) => {
                    const accountKey = Object.keys(account[serviceKey]).find(key => account[serviceKey][key] === accountId);

                    return {accountKey, accountId, point}
                });
            } else {
                return [];
            }
        })();

        setActiveService({
            serviceKey
            , accountId
            , details
        });
    }

    useEffect(() => {
        console.log('call useEffect getStorage')
        const getStorage = async () => {
            const storage = await common.getStorage();
            if(storage) {
                setStorageData({...storage});
            }
        }
        getStorage();
    }, []);

    return (
        <div className="main-container">
            <div className="title">
                Points collected: {total ? total : 0}
            </div>

            <div className="service-filter">
                <div className="service-group">
                    <div className={`service ${!activeService.serviceKey ? "active" : ""}`} onClick={() => handleService()}>
                        <img className="icon-19 mr-3" src={AllIcon} />
                        <span>All</span>
                    </div>
                    {
                        Object.keys(services).map((serviceKey,index)=> {
                            return (
                                <div key={index} className={`service ${activeService.serviceKey === serviceKey ? "active" : ""}`} onClick={() => handleService(serviceKey)}>
                                    <img className="icon-19 mr-3" src={common.getFavicon(common.getServiceConfig(serviceKey).domain)} />
                                    <span>
                                        {services[serviceKey]}
                                    </span>
                                </div>
                            );
                        })
                    }
                </div>
                <div className={`service-detail ${activeService.serviceKey ? "active" : ""}`}>
                    {
                        activeService.details.map(({accountKey, accountId, point}, index) => {
                            return (
                                <div key={index} className={`account ${activeService.accountId === accountId ? "active" : ""}`} onClick={() => handleService(activeService.serviceKey, accountId)}>
                                    <img className="icon-19 mr-3" src={AccountIcon} />
                                    {accountKey}: {point}
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <List transaction={filterTransaction}/>
        </div>
    );

};

export default Popup;
