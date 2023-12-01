import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import classes from "./FollowUs.module.scss";
import {ApiDataContext} from "../../store/ApiDataProvider";

const FollowUs = ({title, className}) => {
    const socialApi = useContext(ApiDataContext);
    const socialMediaData = socialApi['general-portfolio'];
    if (socialMediaData === null) {
        return null
    }
    const { linkedin, github, twitter, google} = socialMediaData

    const socialMediaLinks = {
        linkedin,
        github,
        twitter,
        google,
    };
    const linksArray = Object.entries(socialMediaLinks).map(([icon, url]) => ({ icon, url }));

    return (
        <div className={`${classes['social-icons']} ${className}`} >
            <h2 className={`${classes['social-icons__title']} mb-3 text-uppercase text-white`}>{title}</h2>
            <ul className={`${classes['social-icons__items']} social-icons d-flex gap-3 justify-content-center list-unstyled justify-content-md-start`}>
                {linksArray?.map((link, index) => (
                    <li className={`text-secondary`} key={index}>
                        <a href={link.icon === 'google' ? 'mailto:' + link.url : link.url} target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={['fab', link.icon]}/>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FollowUs;

