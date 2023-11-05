import React from 'react';

import classes from "./Hero.module.scss";
import Button from "../../components/UI/button/Button";
import IntroText from "./IntroText";
import SectionContainer from "../../components/UI/section/SectionContainer";
import Section from "../../components/UI/section/Section";
import HeroScrollButton from "./HeroScrollButton";

const Hero= (() => {

    return (
        <Section id="home" className={`p-0`}>
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
                    <HeroScrollButton />
                </div>
            </div>
        </Section>
    );
});

export default Hero;
