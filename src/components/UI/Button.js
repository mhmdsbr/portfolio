import React from 'react';

import classes from "./Button.module.scss";
const Button = () => {
    return (
        <a href="#contact" className={` ${classes.button} btn btn-outline-primary rounded-pill shadow-none smooth-scroll mt-2`}>
            Hire Me
        </a>
    );
};

export default Button;