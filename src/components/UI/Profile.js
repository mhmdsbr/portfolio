import React from "react";

import classes from "./Profile.module.scss";

import ProfileImage from './ProfileImage'
import ProfileName from "./ProfileName";
const Profile = (props) => {
    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="#" className={`${classes.msProfile} mb-lg-auto mt-lg-4`}>
            <ProfileImage />
            <ProfileName />
        </a>
    );
};

export default Profile;
