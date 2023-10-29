import React, { useState, useEffect } from 'react';
import classes from "./ScrollToTop.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowUp,
} from '@fortawesome/free-solid-svg-icons';
const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleScroll = () => {
        if (window.scrollY > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            className={`${classes.scrollToTop} ${isVisible ? `${classes['scrollToTop__visible']}` : ''}`}
            onClick={scrollToTop}
        >
            <FontAwesomeIcon icon={faArrowUp} size="1x" />
        </div>
    );
};

export default ScrollToTop;
