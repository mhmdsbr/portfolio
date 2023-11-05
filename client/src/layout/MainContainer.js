// MainContent.js
import React from 'react';

import classes from "./MainContainer.module.scss";


const MainContent = ({children}) => {
    return (
        <main className={`col-10 offset-2 h-100 gx-0 ${classes.main}`}>
            {children}
        </main>
    );
};

export default MainContent;
