import React, {useState} from "react";
import {SlidePaneProvider} from "../../../contexts/SlidePaneContext";
import {dateUtil} from "../../../utils";
import Item from "./Item/Item";
import ItemDetail from "../ItemDetail/ItemDetail";
import Dropdown from "../../../components/DropDown";
import './List.css';

const List = ({transaction}) => {
    const [isListActive, setIsListActive] = useState({});

    const toggleActive = index => {
        setIsListActive(state => ({
            ...state,
            [index]: !state[index]
        }));
    };


    if (Object.keys(transaction).length === 0 ) {
        return <div className="empty text_muted">There are no items.</div>
    }

   /* const transactionGroupByDate = Object.values(transaction).reduce((acc, obj) => {
        const transaction = Object.entries(obj);

        for (const [key, value] of transaction) {
            if(!acc[key]) {
                acc[key] = [];
            }

            acc[key] = [...acc[key], ...value]
        }
        return acc;
    }, {});*/



    const results = Object.entries(transaction).map(([date, t], index) => {
        return (
            <React.Fragment key={index}>
                <div key={index} className={`link ${isListActive[index] ? 'open' : ''}`} onClick={() => toggleActive(index)}>
                    {dateUtil.dateFormat(date, 'ddd MMM D YYYY')}<i className="chevron-down" />
                </div>
                <Dropdown open={isListActive[index]}>
                    <Item transaction={t}/>
                </Dropdown>
            </React.Fragment>
        );
    });

    return (
        <SlidePaneProvider>
            <ul className="list-container scrollbar">
                <li>{results}</li>
            </ul>

            <ItemDetail />
        </SlidePaneProvider>
    );
};


export default List;