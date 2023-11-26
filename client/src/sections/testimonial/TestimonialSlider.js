import React from 'react';
import classes from "./TestimonialSlider.module.scss";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";

const TestimonialSlider = (props) => {

    return (
        <Swiper
            modules={[Pagination]}
            spaceBetween={50}
            slidesPerView={2}
            autoHeight={true}
            pagination={{
                dynamicBullets: true,
            }}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => {
            }}
            className={classes.testimonialSlider}
        >
            {props.testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
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
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default TestimonialSlider;