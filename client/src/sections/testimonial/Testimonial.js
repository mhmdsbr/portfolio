import React, {useContext} from 'react';
import classes from "./Testimonial.module.scss";
import TitleSection from "../../components/UI/section/TitleSection";
import TestimonialSlider from "./TestimonialSlider";
import {ApiDataContext} from "../../store/ApiDataProvider";

const Testimonial = () => {
    const testimonialsData = useContext(ApiDataContext);
    if (testimonialsData === null) {
        return null;
    }

    return (
        <section id="testimonial" className={`${classes.testimonial} bg-dark`}>
            <div className="container max-width">
                <TitleSection
                    subtitle={testimonialsData.testimonial_title}
                    title={testimonialsData.testimonial_title_overlay}
                />
                <TestimonialSlider testimonials={testimonialsData.testimonial}/>
            </div>
            <p>Test</p>
        </section>
    );
};

export default Testimonial;
