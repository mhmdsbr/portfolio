import React from "react";

import classes from "./ProfileName.module.scss";
const ProfileName = (props) => {
    return (
        <h1 className={` ${classes.msProfileName} text-5 text-white mb-0 d-lg-block`}>
            {props.name}
        </h1>
    );
};

export default ProfileName;
