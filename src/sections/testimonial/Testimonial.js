import React from 'react';
import classes from "./Testimonial.module.scss";

const Testimonial = () => {
    return (
        <section id="summary" className={`${classes.testimonial} bg-dark`}>
            <div className="position-relative d-flex text-center mb-5">
                <h2 className={`${classes['testimonial__title-muted']} w-100 mb-0 opacity-25`}>testimonial</h2>
                <p className={`${classes['testimonial__title']} fw-600 position-absolute w-100 align-self-center lh-base mb-0 text-white`}>
                    Client Speak
                    <span className={`${classes['testimonial__title-separator']} border-bottom border-5 border-primary d-block mx-auto`}></span>
                </p>
            </div>
        </section>
    );
};

export default Testimonial;
