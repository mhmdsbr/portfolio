import React, { Fragment } from 'react';


const AboutContent = ({ name, job, content }) => {
    const { paragraph1, paragraph2 } = content;

    return (
        <Fragment>
            <h2 className="fw-600 mb-3 text-white">
                I'm <span className="text-primary">{name},</span> A {job}
            </h2>
            <p className="text-white-50">{paragraph1}</p>
            <p className="text-white-50">{paragraph2}</p>
        </Fragment>
    );
};

export default AboutContent;