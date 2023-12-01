import React from 'react';
import classes from './Button.module.scss';

const Button = ({ buttonType, url, content, onClickHandler, className, id = null }) => {

    if (buttonType === 'button') {
        return (
            <button
                id={id}
                onClick={onClickHandler}
                className={`${classes.button} ${className} btn btn-outline-primary rounded-pill shadow-none smooth-scroll mt-2`}
                type="button"
                role={buttonType}
            >
                {content}
            </button>
        );
    } else {
        return (
            <a
                href={url}
                id={id}
                className={`${classes.button} ${className} btn btn-outline-primary rounded-pill shadow-none smooth-scroll mt-2`}
                content={content}
            >
                {content}
            </a>
        );
    }

};

export default Button;
