import React from 'react';

import classes from "./Hero.module.scss";
import Button from "../../components/UI/Button";
import IntroText from "../../components/UI/IntroText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

const Hero= ((props) => {

    return (
        <section id="home" className={`${classes.hero} position-relative`}>
            <div className={classes['hero__wrap']}>
                <div className={`${classes['hero__mask']} opacity-75 bg-dark`}></div>
                <div className={`${classes['hero__bg']} parallax`}></div>
                <div className={`${classes['hero__content']} d-flex min-vh-100`}>
                    <div className="container my-auto">
                        <div className="row">
                            <div className="col-12 text-center">
                                <IntroText />
                                <Button content="hire me" />
                            </div>
                        </div>
                    </div>
                    <div
                        className={classes['hero__scrollBtn']}
                        onClick={() => {
                            const targetElement = document.getElementById('about');
                            if (targetElement) {
                                const targetOffset = targetElement.getBoundingClientRect().top;
                                window.scrollTo({
                                    top: targetOffset,
                                    behavior: 'smooth',
                                });
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faChevronDown} size="1x" className={classes['hero__btn-bounce']} />
                    </div>

                </div>
            </div>

        </section>
    );
});

export default Hero;
