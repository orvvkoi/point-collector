import React, {useState, useEffect, useMemo } from 'react';
import {dateUtil, arrayUtil} from "../../utils";
import {useStorage} from "../../hooks";
import List from "./List";
import Categories from "./Categories";
import './Popup.css';


/**
 * @TODO
 * 1. 실제 크롬 적용시 드랍다운 애니메이션 부드럽지 못한 현상.
 * -> 세로폭 고정 해봐야함.
 * 2. payment 등록 안된 경우에 대한 대처 필요.
 */
const Popup = () => {
    const storage = useStorage();
    const [list, setList] = useState({});

    let {account, statistics: {total, ...services}, statisticsDetail, transaction} = {...storage}
    transaction = transaction && arrayUtil.reverseObjectByKey(transaction);

    useEffect(() => {
        setList(transaction);
    }, [storage]);


    const todayTransaction = transaction && transaction[dateUtil.getTodayStartOf()];

    /**
     * @TODO
     * useMemo 성능 측정
     */
	const todayPoint = useMemo(()=> {
        return todayTransaction ? arrayUtil.calculateTotal(todayTransaction) : '';
    }, []);

    const handleList = (serviceKey, accountId) => {
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

        setList(output);
    }

    return (
        <div className="main-container">
            <div className="title">
                <div>
                    <span>Points collected: {total ? total : 0}</span>
                    {todayPoint ? <span>(+{todayPoint})</span> : ``}
				</div>
            </div>

            <Categories account={account} services={services} statisticsDetail={statisticsDetail} todayTransaction={todayTransaction} handleList={handleList} />
            <List transaction={list}/>
        </div>
    );

};

export default Popup;
