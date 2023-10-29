import React from 'react';
import classes from "./TestimonialSlider.module.scss";
import {Swiper, SwiperSlide} from "swiper/react";
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ProfileImage from "../../assets/Mohammad.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";

const TestimonialSlider = () => {
    const starArray = Array(5).fill(faStar);
    const testimonials = [
        {
            name: "Dennis Jacques",
            location: "User from USA",
            text: "“Only trying it out since a few days. But up to now excellent. Seems to work flawlessly. Priced simply dummy text of the printing and typesetting industry.”",
        },
        {
            name: "Dennis Jacques",
            location: "User from USA",
            text: "“Only trying it out since a few days. But up to now excellent. Seems to work flawlessly. Priced simply dummy text of the printing and typesetting industry.”",
        },
        {
            name: "Dennis Jacques",
            location: "User from USA",
            text: "“Only trying it out since a few days. But up to now excellent. Seems to work flawlessly. Priced simply dummy text of the printing and typesetting industry.”",
        },
        {
            name: "Dennis Jacques",
            location: "User from USA",
            text: "“Only trying it out since a few days. But up to now excellent. Seems to work flawlessly. Priced simply dummy text of the printing and typesetting industry.”",
        },

    ];

    return (
        <Swiper
            modules={[Pagination]}
            spaceBetween={50}
            slidesPerView={2}
            pagination={{
                dynamicBullets: true,
            }}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            className={classes.testimonialSlider}
        >
            {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                    <div className={`${classes['testimonialSlider__item']} rounded p-5 bg-dark-2`}>
                        <div className={` ${classes['testimonialSlider__item-head']} d-flex align-items-center mt-auto mb-4`}>
                            <img className="img-fluid rounded-circle d-inline-block" src={ProfileImage} alt="Client" />
                            <p className="ms-3 mb-0">
                                <strong className="d-block mb-2 fw-600 text-white">{testimonial.name}</strong>
                                <span className="fw-500">{testimonial.location}</span>
                            </p>
                        </div>
                        <p className={`${classes['testimonialSlider__item-content']} mb-4 text-white`}>{testimonial.text}</p>
                        <span className={classes['testimonialSlider__item-stars']}>
                                {starArray.map((star, starIndex) => (
                                    <FontAwesomeIcon key={starIndex} icon={star} />
                                ))}
                        </span>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default TestimonialSlider;