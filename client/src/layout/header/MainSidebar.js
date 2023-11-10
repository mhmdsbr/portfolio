import React, {useContext} from 'react';

import classes from "./MainSidebar.module.scss";
import Profile from "./Profile";
import HeaderNav from "../nav/HeaderNav";
import FollowUs from "../../components/UI/FollowUs";

import {MenuItemsProvider} from "../../store/MenuItemsContext";
import {GeneralFieldsContext} from "../../store/GeneralFieldsContext";


const MainSidebar = (props) => {
    const generalSettings = useContext(GeneralFieldsContext);
    if (!generalSettings) {
        return <p>Loading...</p>;
    }


    return (
        <header className={`${classes.msHeader} col-2 p-lg-4 text-center fixed-top px-0`}>
            <Profile />
            <MenuItemsProvider>
                <HeaderNav onClick = {props.onClick} />
            </MenuItemsProvider>
                <FollowUs title="" />
        </header>
    );
};

export default MainSidebar;
