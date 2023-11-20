import React, {useContext, useEffect, useState} from 'react';
import classes from "./Testimonial.module.scss";
import TitleSection from "../../components/UI/section/TitleSection";
import TestimonialSlider from "./TestimonialSlider";
import { TestimonialFieldsContext } from "../../store/TestimonialFieldsContext";

const Testimonial = () => {
    const testimonialsData = useContext(TestimonialFieldsContext);
    const [testimonialTitles, setTestimonialTitles] = useState(null);
    const [testimonialItems, setTestimonialItems] = useState(null);

    useEffect(() => {
        setTestimonialTitles({
            title: testimonialsData.title,
            title_overlay: testimonialsData.title_overlay,
        })
    }, [testimonialsData.title, testimonialsData.title_overlay]);

    useEffect(() => {
        setTestimonialItems(testimonialsData.items)
    }, [testimonialsData.items]);

    if (testimonialTitles === null || testimonialItems === null) {
        return null;
    }

    let mainTitle = testimonialTitles.title;
    let mainTitle_overlay = testimonialTitles.title_overlay;


    return (
        <section id="testimonial" className={`${classes.testimonial} bg-dark`}>
            <div className="container max-width">
                <TitleSection
                    subtitle={mainTitle}
                    title={mainTitle_overlay}
                />
                <TestimonialSlider testimonials={testimonialItems}/>
            </div>
        </section>
    );
};

export default Testimonial;
