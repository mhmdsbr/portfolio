import React from 'react';
import classes from "./Button.module.scss";

const Button = ({ content, className, url, id=null }) => {
    return (
        <a
            id={id}
            href={url}
            className={`${classes.button} ${className} btn btn-outline-primary rounded-pill shadow-none smooth-scroll mt-2`}
        >
            {content}
        </a>
    );
};
export default Button;
