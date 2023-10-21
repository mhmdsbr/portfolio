import React from 'react';
import PropTypes from 'prop-types';
import classes from './TitleSection.module.scss';

const TitleSection = ({ title, subtitle }) => {
    return (
        <div className="titleSection position-relative d-flex text-center mb-5">
            <h2 className={`${classes['titleSection__title-muted']} w-100 mb-0 opacity-25`}>
                {subtitle}
            </h2>
            <p className={`${classes['titleSection__title']} fw-600 position-absolute w-100 align-self-center lh-base mb-0 text-white`}>
                {title}
                <span className={`${classes['titleSection__title-separator']} border-bottom border-5 border-primary d-block mx-auto`}></span>
            </p>
        </div>
    );
};

TitleSection.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
};

export default TitleSection;
