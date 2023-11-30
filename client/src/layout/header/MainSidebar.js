import React from 'react';

import classes from "./MainSidebar.module.scss";
import Profile from "./Profile";
import HeaderNav from "../nav/HeaderNav";
import FollowUs from "../../components/UI/FollowUs";
import useMobileCheck from "../../components/MobileCheck";

const MainSidebar = (props) => {
    const isMobile = useMobileCheck();
    const headerClasses = ` ${classes.msHeader} p-lg-4 pe-3 ps-3 navbar navbar-expand-lg text-center fixed-top ${isMobile ? 'col-12' : 'col-2' } `

    return (
        <header className={headerClasses}>
            <Profile />
            <HeaderNav onClick = {props.onClick} />
            <FollowUs title="" />
        </header>
    );
};

export default MainSidebar;
