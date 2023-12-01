import React, { Fragment } from 'react';
import classes from "./Input.module.scss";

const Input = ({ value, name, type, required, placeholder, className, rows, onChange, id }) => {
    if (type === 'textarea') {
        return (
            <Fragment>
        <textarea
            value={value}
            name={name}
            className={`${classes.input} form-control ${className}`}
            required={required}
            placeholder={placeholder}
            rows={rows}
            onChange={onChange}
            id={id}
        />
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <input
                    value={value}
                    name={name}
                    type={type}
                    className={`${classes.input} form-control ${className}`}
                    required={required}
                    placeholder={placeholder}
                    onChange={onChange}
                    id={id}
                />
            </Fragment>
        );
    }
};

export default Input;
