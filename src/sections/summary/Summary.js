import React from 'react';
import classes from "./Summary.module.scss";

const Summary = () => {
    return (
        <section id="summary" className={`${classes.summary} bg-dark`}>
            <div className="position-relative d-flex text-center mb-5">
                <h2 className={`${classes['summary__title-muted']} w-100 mb-0 opacity-25`}>summary</h2>
                <p className={`${classes['summary__title']} fw-600 position-absolute w-100 align-self-center lh-base mb-0 text-white`}>
                    Resume
                    <span className={`${classes['summary__title-separator']} border-bottom border-5 border-primary d-block mx-auto`}></span>
                </p>
            </div>
        </section>
    );
};

export default Summary;
