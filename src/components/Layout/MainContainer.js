// MainContent.js
import React from 'react';

import classes from "./MainContainer.module.scss";

const MainContent = (props) => {
    return (
        <main className={`col-10 offset-2 h-100  ${classes.main}`}>
            <h1>Main Content</h1>
        </main>
    );
};

export default MainContent;
