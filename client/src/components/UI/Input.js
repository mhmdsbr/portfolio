import React, { Fragment } from 'react';
import classes from "./Input.module.scss";

const Input = ({ name, type, required, placeholder, className, rows }) => {
    if (type === 'textarea') {
        return (
            <Fragment>
        <textarea
            name={name}
            className={`${classes.input} form-control ${className}`}
            required={required}
            placeholder={placeholder}
            rows={rows}
        />
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <input
                    name={name}
                    type={type}
                    className={`${classes.input} form-control ${className}`}
                    required={required}
                    placeholder={placeholder}
                />
            </Fragment>
        );
    }
};

export default Input;
