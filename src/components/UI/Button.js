import React from 'react';
import classes from "./Button.module.scss";

const Button = ({ content, className }) => {
    return (
        <a href="#" className={`${classes.button} ${className} btn btn-outline-primary rounded-pill shadow-none smooth-scroll mt-2`}>
            {content}
        </a>
    );
};

export default Button;
