import React, { createContext, useEffect, useState, useCallback } from 'react';
import axios from "axios";

const TestimonialFieldsContext = createContext();

const TestimonialFieldsProvider = ({ children }) => {
    const [testimonialFields, setTestimonialFields] = useState(null);

    const fetchTestimonialFields = useCallback(async () => {
        try {
            const res = await axios.get('http://portfolio.test/wp-json/portfolio/v2/testimonial-portfolio');
            const { data } = res;
            setTestimonialFields(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchTestimonialFields().then(r => {});
    }, [fetchTestimonialFields]);

    if (testimonialFields === null) {
        return null;
    }

    let content = {
        title: testimonialFields.testimonial_title,
        title_overlay: testimonialFields.testimonial_title_overlay,
        items: testimonialFields.testimonial,
    };


    return (
        <TestimonialFieldsContext.Provider value={content}>
            {children}
        </TestimonialFieldsContext.Provider>
    );
};

export { TestimonialFieldsProvider, TestimonialFieldsContext };
