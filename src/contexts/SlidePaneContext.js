import React, {createContext, useState } from "react";

const SlidePaneContext = createContext({
    paneProps: {},
    isPaneOpen: false,
    setIsPaneOpen: () => {},
    showSlidePane: () => {}
});

const SlidePaneProvider = ({children}) => {
    const [isPaneOpen, setIsPaneOpen] = useState(false);
    const [paneProps, setPaneProps] = useState({});

    const showSlidePane = (props) => {
        setIsPaneOpen(true);
        setPaneProps(props);
    }

    return (
        <SlidePaneContext.Provider value={{isPaneOpen, setIsPaneOpen, paneProps, showSlidePane}}>
            {children}
        </SlidePaneContext.Provider>
    );
}

export { SlidePaneContext, SlidePaneProvider };
