import React, {useContext} from 'react';

import classes from "./MainSidebar.module.scss";
import Profile from "./Profile";
import HeaderNav from "../nav/HeaderNav";
import FollowUs from "../../components/UI/FollowUs";

import {MenuItemsProvider} from "../../store/MenuItemsContext";
import {GeneralFieldsContext} from "../../store/GeneralFieldsContext";

// const socialMediaLinks = [
//     { icon: 'linkedin', url: 'http://www.linkedin.com/' },
//     { icon: 'github', url: 'http://www.github.com/' },
//     { icon: 'twitter', url: 'http://www.twitter.com/' },
//     { icon: 'google', url: 'http://www.google.com/' },
// ];

const MainSidebar = (props) => {
    const generalSettings = useContext(GeneralFieldsContext);
    if (!generalSettings) {
        return <p>Loading...</p>;
    }

    console.log(generalSettings);

    return (
        <header className={`${classes.msHeader} col-2 p-lg-4 text-center fixed-top px-0`}>
            <Profile />
            <MenuItemsProvider>
                <HeaderNav onClick = {props.onClick} />
            </MenuItemsProvider>
                <FollowUs title="" socialMediaLinks={generalSettings} />
        </header>
    );
};

export default MainSidebar;
