import React, {useContext} from 'react';

import classes from "./MainSidebar.module.scss";
import Profile from "./Profile";
import HeaderNav from "../nav/HeaderNav";
import FollowUs from "../../components/UI/FollowUs";
import useMobileCheck from "../../components/MobileCheck";

import {MenuItemsProvider} from "../../store/MenuItemsContext";
import {ApiDataContext} from "../../store/ApiDataProvider";


const MainSidebar = (props) => {
    const isMobile = useMobileCheck();
    const headerClasses = ` ${classes.msHeader} p-lg-4 pe-3 ps-3 navbar navbar-expand-lg text-center fixed-top ${isMobile ? 'col-12' : 'col-2' } `
    const generalSettings = useContext(ApiDataContext);
    if (!generalSettings) {
        return <p>Loading...</p>;
    }

    return (
        <header className={headerClasses}>
            <Profile />
            <MenuItemsProvider>
                <HeaderNav onClick = {props.onClick} />
            </MenuItemsProvider>
                <FollowUs title="" />
        </header>
    );
};

export default MainSidebar;
