'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import styles from "./testimonials.module.css";

const Testimonials: React.FC = () => {
    const testimonials = [
        {
            id: 1,
            name: "John Doe",
            role: "CEO, Company A",
            quote: "This product completely transformed our workflow. Highly recommended!",
            avatar: "/path/to/avatar1.jpg"
        },
        {
            id: 2,
            name: "Jane Smith",
            role: "Marketing Director",
            quote: "Exceptional service and outstanding results. Will definitely work with them again.",
            avatar: "/path/to/avatar2.jpg"
        },
        {
            id: 3,
            name: "Robert Johnson",
            role: "Product Manager",
            quote: "The team delivered beyond our expectations. Truly professional.",
            avatar: "/path/to/avatar3.jpg"
        },
        {
            id: 4,
            name: "Emily Davis",
            role: "UX Designer",
            quote: "Innovative solutions that perfectly matched our needs. Great collaboration!",
            avatar: "/path/to/avatar4.jpg"
        },
        {
            id: 5,
            name: "Michael Wilson",
            role: "CTO",
            quote: "Technical expertise at its finest. Solved our most complex challenges.",
            avatar: "/path/to/avatar5.jpg"
        }
    ];

    const colors = ["#337BFF", "#FF5733", "#33FF57", "#FF33A1", "#8A33FF"];

    return (
        <div className={styles['testimonial-slider']}>
            <Swiper
                modules={[Autoplay]}
                slidesPerView={3}
                spaceBetween={30}
                loop={true}
                freeMode={true}
                speed={15000}
                autoplay={{
                    disableOnInteraction: false,
                }}
                className={styles['testimonial-slider__swiper']}
            >
                {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={testimonial.id} className={styles['testimonial-slider__slide']}>
                        <div className={styles['testimonial-item']} style={{ borderLeft: `4px solid ${colors[index % colors.length]}` }}>
                            <div className={styles['testimonial-content']}>
                                <p className={styles['testimonial-quote']}>{testimonial.quote}</p>
                                <div className={styles['testimonial-author']}>
                                    <div className={styles['author-info']}>
                                        <h4 className={styles['author-name']}>{testimonial.name}</h4>
                                        <p className={styles['author-role']}>{testimonial.role}</p>
                                    </div>
                                    {testimonial.avatar && (
                                        <div className={styles['author-avatar']}>
                                            <img src={testimonial.avatar} alt={testimonial.name} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Testimonials;