import React from "react";

import classes from "./ProfileName.module.scss";
const ProfileName = (props) => {
    return (
        <h1 className={` ${classes.msProfileName} text-5 text-white text-center mb-0 d-lg-block`}>
            Mohammad Saber
        </h1>
    );
};

export default ProfileName;
