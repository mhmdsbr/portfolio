import React from 'react';
import classes from './Button.module.scss';

const Button = ({ content, className, onClickHandler, id = null }) => {
    return (
        <button
            id={id}
            onClick={onClickHandler}
            className={`${classes.button} ${className} btn btn-outline-primary rounded-pill shadow-none smooth-scroll mt-2`}
            type="button"
        >
            {content}
        </button>
    );
};

export default Button;
