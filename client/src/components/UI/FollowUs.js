import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FollowUs = ({title, socialMediaLinks}) => {
    const linksArray = Object.entries(socialMediaLinks).map(([icon, url]) => ({ icon, url }));

    return (
        <React.Fragment>
            <h2 className="mb-3 text-uppercase text-white">{title}</h2>
            <ul className="social-icons d-flex gap-3 justify-content-center list-unstyled justify-content-md-start">
                {linksArray?.map((link, index) => (
                    <li className={`social-icons-${link.icon} text-secondary`} key={index}>
                        <a href={link.url} target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={['fab', link.icon]} size="2x"/>
                        </a>
                    </li>
                ))}
            </ul>
        </React.Fragment>
    );
};

export default FollowUs;

