import React, { useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./FollowUs.module.scss";
import { ApiDataContext } from "../../store/ApiDataProvider";

const FollowUs = ({ title, className }) => {
    const { data } = useContext(ApiDataContext);
    const generalSettings = data['general-portfolio'];
    
    if (!generalSettings?.social_links) return null;

    // Destructure social links from the nested object
    const { linkedin, github, twitter, email } = generalSettings.social_links;

    const socialMediaLinks = [
        { icon: 'linkedin', url: linkedin },
        { icon: 'github', url: github },
        { icon: 'twitter', url: twitter },
        { icon: 'google', url: `mailto:${email}` }
    ];

    return (
        <div className={`${classes['social-icons']} ${className}`}>
            <h2 className={`${classes['social-icons__title']} mb-3 text-uppercase text-white`}>
                {title}
            </h2>
            <ul className={`${classes['social-icons__items']} social-icons d-flex gap-3 justify-content-center list-unstyled justify-content-md-start`}>
                {socialMediaLinks.map((link, index) => (
                    link.url && (
                        <li className="text-secondary" key={index}>
                            <a href={link.url} target="_blank" rel="noreferrer">
                                <FontAwesomeIcon icon={['fab', link.icon]} />
                            </a>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
};

export default FollowUs;