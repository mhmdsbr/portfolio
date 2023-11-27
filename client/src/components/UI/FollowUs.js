import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {GeneralFieldsContext} from "../../store/GeneralFieldsContext";
import classes from "./FollowUs.module.scss";

const FollowUs = ({title}) => {
    const { linkedin, github, twitter, google } = useContext(GeneralFieldsContext);

    const socialMediaLinks = {
        linkedin,
        github,
        twitter,
        google,
    };
    const linksArray = Object.entries(socialMediaLinks).map(([icon, url]) => ({ icon, url }));

    return (
        <div className={classes['social-icons']} >
            <h2 className={`${classes['social-icons__title']} mb-3 text-uppercase text-white`}>{title}</h2>
            <ul className={`${classes['social-icons__items']} social-icons d-flex gap-3 justify-content-center list-unstyled justify-content-md-start`}>
                {linksArray?.map((link, index) => (
                    <li className={`text-secondary`} key={index}>
                        <a href={link.url} target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={['fab', link.icon]}/>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FollowUs;

