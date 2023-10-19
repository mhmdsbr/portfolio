import React, { forwardRef } from 'react';

import classes from "./Hero.module.scss";
import Button from "../../components/UI/Button";
import IntroText from "../../components/UI/IntroText";

const Hero = forwardRef((props, ref) => {

    return (
        <section id="home" ref={ref} className={classes.hero}>
            <div className={classes['hero__wrap']}>
                <div className={`${classes['hero__mask']} opacity-75 bg-dark`}></div>
                <div className={`${classes['hero__bg']} parallax`}></div>
                <div className={`${classes['hero__content']} d-flex min-vh-100`}>
                    <div className="container my-auto">
                        <div className="row">
                            <div className="col-12 text-center">
                                <IntroText />
                                <Button />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default Hero;
