import React from 'react';
import classes from "./Testimonial.module.scss";
import TitleSection from "../../components/UI/TitleSection";

const Testimonial = () => {
    return (
        <section id="testimonial" className={`${classes.testimonial} bg-dark`}>
            <TitleSection
                subtitle="testimonial"
                title="Client Speak"
            />
        </section>
    );
};

export default Testimonial;
