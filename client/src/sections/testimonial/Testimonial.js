import React, { useContext, useEffect, useState } from 'react';
import classes from "./Testimonial.module.scss";
import TitleSection from "../../components/UI/section/TitleSection";
import TestimonialSlider from "./TestimonialSlider";
import { TestimonialFieldsContext } from "../../store/TestimonialFieldsContext";

const Testimonial = () => {
    const testimonialData = useContext(TestimonialFieldsContext);

    const [isLoading, setIsLoading] = useState(true);
    const [testimonial, setTestimonial] = useState({
        title: '',
        titleOverlay: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            const testimonialTitle = testimonialData?.testimonial_title || '';
            const testimonialTitleOverlay = testimonialData?.testimonial_title_overlay || '';

            const testimonialTitles = {
                'title': testimonialTitle,
                'titleOverlay': testimonialTitleOverlay,
            };

            setTestimonial(testimonialTitles);
            setIsLoading(false); // Set loading to false once data is set
        };

        fetchData();

    }, [testimonialData]);

    console.log(testimonial);

    // Render loading only when data is still being loaded
    if (isLoading || !testimonial.title) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    // Render Testimonial component only when data is available
    return (
        <section id="testimonial" className={`${classes.testimonial} bg-dark`}>
            <div className="container max-width">
                <TitleSection
                    subtitle={testimonial.title}
                    title={testimonial.titleOverlay}
                />
                <TestimonialSlider />
            </div>
        </section>
    );
};

export default Testimonial;
