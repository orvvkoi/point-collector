import { useState, useEffect } from "react";
import * as storageUtil from "../utils/storageUtil";

const useStorage = () => {
    const [storage, setStorage] = useState({
        "account": {},
        "statistics": {
            "total": 0
        },
        "statisticsDetail" : {},
        "transaction": {}
    });

    useEffect(() => {
        const getStorage = async () => {
            const res = await storageUtil.getStorage();

            setStorage(res);
        };

        getStorage();
    }, []);

    return storage;
}

export default useStorage;