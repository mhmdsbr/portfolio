// MainSidebar.js
import React from 'react';

import classes from "./MainSidebar.module.scss";
import Profile from "./Profile";
import HeaderNav from "../nav/HeaderNav";
import FollowUs from "../../components/UI/FollowUs";

const socialMediaLinks = [
    { icon: 'linkedin', url: 'http://www.linkedin.com/' },
    { icon: 'github', url: 'http://www.github.com/' },
    { icon: 'twitter', url: 'http://www.twitter.com/' },
    { icon: 'google', url: 'http://www.google.com/' },
];


const MainSidebar = (props) => {
    return (
        <header className={`${classes.msHeader} col-2 p-lg-4 text-center fixed-top px-0`}>
            <Profile />
            <HeaderNav onClick = {props.onClick} />
            <FollowUs title="" socialMediaLinks={socialMediaLinks} />
        </header>
    );
};

export default MainSidebar;
