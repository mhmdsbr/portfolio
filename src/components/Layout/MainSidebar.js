// MainSidebar.js
import React from 'react';

import classes from "./MainSidebar.module.scss";
import Profile from "../UI/Profile";
import HeaderNav from "../UI/HeaderNav";


const MainSidebar = (props) => {
    return (
        <header className={`${classes.msHeader} col-2 p-lg-4 text-center fixed-top px-0`}>
            <Profile />
            <HeaderNav />
        </header>
    );
};

export default MainSidebar;
