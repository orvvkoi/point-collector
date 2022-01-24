import React, {useState, useEffect, useMemo } from 'react';
import {storageUtil, dateUtil, arrayUtil} from "../../utils";
import List from "./List";
import ListFilter from "./ListFilter";
import './Popup.css';

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

    const [list, setList] = useState({});

    useEffect(() => {
        const getStorage = async () => {
            const storage = await storageUtil.getStorage();
            if(storage) {
                setStorageData({...storage});

                handleList(storage.transaction);
            }
        }
        getStorage();
    }, []);

    let {account, statistics: {total, ...services}, statisticsDetail, transaction} = {...storageData}

	const todayTotal = useMemo(()=> {
        const todayTransaction = transaction && transaction[dateUtil.getTodayStartOf()];

        return todayTransaction ? arrayUtil.calculateTotal(todayTransaction) : '';
    }, [transaction]);

    const handleList = (transaction) => {
        setList(arrayUtil.reverseObjectByKey(transaction));
    }

    return (
        <div className="main-container">
            <div className="title">
                <div>
                    <span>Points collected: {total ? total : 0}</span>
                    {todayTotal ? <span>(+{todayTotal})</span> : ``}
				</div>
            </div>

            <ListFilter account={account} services={services} statisticsDetail={statisticsDetail} transaction={transaction} handleList={handleList} />
            <List transaction={list}/>
        </div>
    );

};

export default Popup;
