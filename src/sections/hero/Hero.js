import React from 'react';

import classes from "./Hero.module.scss";
import Button from "../../components/UI/button/Button";
import IntroText from "./IntroText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import SectionContainer from "../../components/UI/section/SectionContainer";
import Section from "../../components/UI/section/Section";

const Hero= ((props) => {

    return (
        <Section id="home" className={`${classes.hero} p-0`}>
            <div className={classes['hero__wrap']}>
                <div className={`${classes['hero__mask']} opacity-75 bg-dark`}></div>
                <div className={`${classes['hero__bg']} parallax`}></div>
                <div className={`${classes['hero__content']} d-flex min-vh-100`}>
                    <SectionContainer className="my-auto" >
                        <div className="row">
                            <div className="col-12 text-center">
                                <IntroText />
                                <Button content="hire me" />
                            </div>
                        </div>
                    </SectionContainer>
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
        </Section>
    );
});

export default Hero;
