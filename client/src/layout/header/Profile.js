import React, {useContext} from "react";

import classes from "./Profile.module.scss";

import ProfileImage from './ProfileImage'
import ProfileName from "./ProfileName";
import {GeneralFieldsContext} from "../../store/GeneralFieldsContext";
const Profile = (props) => {
    const profileContent = useContext(GeneralFieldsContext)
    if (!profileContent) {
        return <p>Loading...</p>;
    }
    const profileName = profileContent['profile_title'];
    const profileImage = profileContent['profile_image'];
    const imageUrl = profileImage['url'];

    return (
        <div className={`${classes.msProfile} mt-lg-4`}>
            <ProfileImage
                src={imageUrl}
                alt={profileImage['title']}
            />
            <ProfileName
                name={profileName}
            />
        </div>
    );
};

export default Profile;
