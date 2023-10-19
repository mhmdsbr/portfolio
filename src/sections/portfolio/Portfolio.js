import React from 'react';
import classes from "./Portfolio.module.scss";

const Portfolio = () => {
    return (
        <section id="summary" className={`${classes.portfolio} bg-dark-2`}>
            <div className="position-relative d-flex text-center mb-5">
                <h2 className={`${classes['portfolio__title-muted']} w-100 mb-0 opacity-25`}>portfolio</h2>
                <p className={`${classes['portfolio__title']} fw-600 position-absolute w-100 align-self-center lh-base mb-0 text-white`}>
                    My Work
                    <span className={`${classes['portfolio__title-separator']} border-bottom border-5 border-primary d-block mx-auto`}></span>
                </p>
            </div>
        </section>
    );
};

export default Portfolio;
