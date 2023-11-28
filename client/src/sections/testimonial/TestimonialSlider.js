import React, { useEffect, useRef } from 'react';
import { register } from 'swiper/element/bundle';
import classes from "./TestimonialSlider.module.scss";
import 'swiper/css';
import 'swiper/css/pagination';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";

const TestimonialSlider = (props) => {
    const swiperElRef = useRef(null);
    useEffect(() => {
        register();
        const params = {
            slidesPerView: 1,
            breakpoints: {
                992: {
                    slidesPerView: 2,
                },
            },
            autoHeight: true,
            spaceBetween: 20,
            pagination: {
                dynamicBullets: true,
                clickable: true,
            },
            injectStyles: [
                `:host .swiper {
                    padding-bottom: 32px;
                  } .swiper-pagination-bullet {
                    width: 12px;
                    height: 12px;
                  }`,
            ],
        };
        Object.assign(swiperElRef.current, params);
        swiperElRef.current.initialize();

    }, []);

    return (
        <swiper-container
            className={classes.testimonialSlider}
            ref={swiperElRef}
            init={false}
        >
            {props.testimonials.map((testimonial, index) => (
                <swiper-slide key={index}>
                    <div className={`${classes['testimonialSlider__item']} rounded p-5 bg-dark-2`}>
                        <div
                            className={` ${classes['testimonialSlider__item-head']} d-flex align-items-center mt-auto mb-4`}>
                            <img className="img-fluid rounded-circle d-inline-block" src={testimonial.image}
                                 alt="Client"/>
                            <p className="ms-3 mb-0">
                                <strong className="d-block mb-2 fw-600 text-white">{testimonial.title}</strong>
                                <span className="fw-500">{testimonial.subtitle}</span>
                            </p>
                        </div>
                        <p className={`${classes['testimonialSlider__item-content']} mb-4 text-white`}>{testimonial.content}</p>
                        <span className={classes['testimonialSlider__item-stars']}>
                           {Array.from({ length: parseInt(testimonial.rating, 10) }).map((rating, starIndex) => (
                               <FontAwesomeIcon key={starIndex} icon={faStar} />
                           ))}
                        </span>
                    </div>
                </swiper-slide>
            ))}
        </swiper-container>
    );
};

export default TestimonialSlider;