import React, { Fragment } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

const ContactContent = ({ contactInfo }) => {
    return (
        <Fragment>
            <h2 className="mb-3 text-5 text-uppercase text-white">{contactInfo.title}</h2>
            <p className="mb-4 text-light">{contactInfo.address}</p>
            <p className="mb-3 text-light">
                <span className="pe-2 text-primary">
                  <FontAwesomeIcon icon={faPhone} size="1x" />
                </span>
                {contactInfo.phone}
            </p>
            <p className="mb-4 text-light">
                <span className="pe-2 text-primary">
                  <FontAwesomeIcon icon={faEnvelope} size="1x" />
                </span>
                {contactInfo.email}
            </p>
        </Fragment>
    );
};

export default ContactContent;
