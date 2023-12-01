import React, { Fragment } from 'react';
import classes from "./Input.module.scss";

const Input = ({ name, type, required, placeholder, className, rows, onChange }) => {
    if (type === 'textarea') {
        return (
            <Fragment>
        <textarea
            name={name}
            className={`${classes.input} form-control ${className}`}
            required={required}
            placeholder={placeholder}
            rows={rows}
            onChange={onChange}
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
                    onChange={onChange}
                />
            </Fragment>
        );
    }
};

export default Input;
