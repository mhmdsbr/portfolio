import React, { Fragment } from 'react';


const AboutContent = ({ name, job, content }) => {

    return (
        <Fragment>
            <h2 className="fw-600 mb-3 text-white">
                I'm <span className="text-primary">{name},</span> A {job}
            </h2>
            <p className="text-white-50">{content}</p>
        </Fragment>
    );
};

export default AboutContent;