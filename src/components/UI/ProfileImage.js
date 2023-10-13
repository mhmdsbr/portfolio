import React from 'react';

import profileImage from "../../assets/Mohammad.jpg";

import classes from "./ProfileImage.module.scss";
const ProfileImage = (props) => {
    return (
        <span className="bg-dark-subtle rounded-pill p-2 mb-3 d-none d-lg-inline-block">
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            <img className={`${classes.msProfileImg} bg-dark-2 rounded-pill d-none d-lg-inline-block `} src={profileImage} alt="profile image" />
        </span>
    );
};

export default ProfileImage;
