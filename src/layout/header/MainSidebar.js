// MainSidebar.js
import React from 'react';

import classes from "./MainSidebar.module.scss";
import Profile from "../../components/UI/Profile";
import HeaderNav from "../nav/HeaderNav";


const MainSidebar = (props) => {
    return (
        <header className={`${classes.msHeader} col-2 p-lg-4 text-center fixed-top px-0`}>
            <Profile />
            <HeaderNav />
        </header>
    );
};

export default MainSidebar;
