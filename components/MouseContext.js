import Router from "next/router";
import React, { createContext, useState, useEffect } from "react";

export const MouseContext = createContext({
    cursorType: false,
});
const MouseContextProvider = (props) => {
    const [cursorType, setCursorType] = useState("");

    const handleCursorChange = (cursorType) => {
        setCursorType(cursorType);
    };
    //라우팅 변경시 화살표 커서 없얘기
    Router.events.on("routeChangeComplete", () => setTimeout(() => {setCursorType(false)}, 500));

    return (
        <MouseContext.Provider
            value={{
                cursorType: cursorType,
                handleCursorChange: handleCursorChange,
            }}
        >
            {props.children}
        </MouseContext.Provider>
    );
};
export default MouseContextProvider;
