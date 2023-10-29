import React from 'react';
import classes from "./Testimonial.module.scss";
import TitleSection from "../../components/UI/TitleSection";
import TestimonialSlider from "../../components/UI/TestimonialSlider";


const Testimonial = () => {
    return (
        <section id="testimonial" className={`${classes.testimonial} bg-dark`}>
            <div className="container max-width">
                <TitleSection
                    subtitle="testimonial"
                    title="Client Speak"
                />
                <TestimonialSlider />
            </div>
        </section>
    );
};

export default Testimonial;
