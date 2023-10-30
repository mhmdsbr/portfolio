import React from 'react';
import classes from "./Hero.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const scrollToAbout = () => {
    const targetElement = document.getElementById('about');
    if (targetElement) {
        const targetOffset = targetElement.getBoundingClientRect().top;
        window.scrollTo({
            top: targetOffset,
            behavior: 'smooth',
        });
    }
};

const HeroScrollButton = () => {
    return (
        <div
            className={classes['hero__scrollBtn']}
            onClick={scrollToAbout}
        >
            <FontAwesomeIcon icon={faChevronDown} size="1x" className={classes['hero__btn-bounce']} />
        </div>
    );
};

export default HeroScrollButton;
