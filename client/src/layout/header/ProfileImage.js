import React from 'react';

import classes from "./ProfileImage.module.scss";

const ProfileImage = ({src, alt}) => {
    return (
        <span className="bg-dark-subtle rounded-pill p-2 mb-3 d-none d-lg-inline-block">
            <img 
                className={`${classes.msProfileImg} bg-dark-2 rounded-pill d-none d-lg-inline-block `} 
                src={src}
                alt={alt} />
        </span>
    );
};

export default ProfileImage;
