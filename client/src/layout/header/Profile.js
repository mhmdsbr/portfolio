import React, { useContext } from "react";
import classes from "./Profile.module.scss";
import ProfileImage from './ProfileImage';
import ProfileName from "./ProfileName";
import { ApiDataContext } from "../../store/ApiDataProvider";

const Profile = (props) => {
    const { data } = useContext(ApiDataContext);
    const generalSettings = data['general-portfolio'];
    
    if (!generalSettings?.profile) return null;

    const { image: profileImage, title: profileTitle } = generalSettings.profile;

    return (
        <div className={`${classes.msProfile} mt-lg-4`}>
            {profileImage && (
                <ProfileImage
                    src={profileImage.url}
                    alt={profileImage.alt || "Profile Image"}
                />
            )}
            <ProfileName
                name={profileTitle}
            />
        </div>
    );
};

export default Profile;