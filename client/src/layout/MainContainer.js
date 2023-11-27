// MainContent.js
import React from 'react';
import useMobileCheck from "../components/MobileCheck";
import classes from "./MainContainer.module.scss";

const MainContent = ({ children }) => {
    const isMobile = useMobileCheck();
    const mainClasses = `h-100 gx-0 ${classes.main} ${isMobile ? 'col-12' : 'col-10 offset-2'}`;

    return (
        <main className={mainClasses}>
            {children}
        </main>
    );
};

export default MainContent;


