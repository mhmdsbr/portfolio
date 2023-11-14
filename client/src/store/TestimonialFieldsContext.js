import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const TestimonialFieldsContext = createContext();

const TestimonialFieldsProvider = ({ children }) => {
    const [testimonialFields, setTestimonialFields] = useState({});

    useEffect(() => {
        const fetchTestimonialFields = async () => {
            try {
                const res = await axios.get('http://portfolio.test/wp-json/portfolio/v2/testimonial-portfolio');
                const { data } = res;
                setTestimonialFields(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTestimonialFields();
    }, []);

    return (
        <TestimonialFieldsContext.Provider value={testimonialFields}>
            {children}
        </TestimonialFieldsContext.Provider>
    );
};

export { TestimonialFieldsProvider, TestimonialFieldsContext };
