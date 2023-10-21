import React from 'react';

import classes from "./About.module.scss";
import TitleSection from "../../components/UI/TitleSection";

const About = (props) => {

    return (
        <section id="about" className={`${classes.about} bg-dark`}>
            <div className="container max-width">
                <TitleSection
                    subtitle="About Me"
                    title="Know me more"
                />
                <div className="row">
                    <div className="col-lg-7 col-xl-8 text-center text-lg-start">
                        <h2 className="fw-600 mb-3 text-white">
                            I'm <span className="text-primary">Mohammad Saber, </span>
                            a Web Developer
                        </h2>
                        <p className="text-white-50">I help you build brand for your business at an affordable price. Thousands of clients have procured exceptional results while working with our dedicated team. when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        <p className="text-white-50">Delivering work within time and budget which meets client’s requirements is our moto. Lorem Ipsum has been the industry's standard dummy text ever when an unknown printer took a galley.</p>
                    </div>
                    <div className="col-lg-5 col-xl-4">
                        <div className={`${classes['about__my-info']} ps-lg-4`}>
                            <ul className="list-style text-light">
                                <li>
                                    <span className={`${classes['about__info']}`}>Name:</span>
                                    Mohammad Saber
                                </li>
                                <li>
                                    <span className={`${classes['about__info']}`}>Email:</span>
                                    <a href="mailto:chat@simone.com">saaber.mohamad@gmail.com</a>
                                </li>
                                <li>
                                    <span className={`${classes['about__info']}`}>Age:</span>29
                                </li>
                                <li className="border-0">
                                    <span className={`${classes['about__info']}`}>From:</span>
                                    Iran, Gilan, Rasht
                                </li>
                            </ul>
                            <a href="#" download="" className="btn btn-primary rounded-pill">Download CV
                            </a>
                        </div>
                    </div>
                </div>
                <div className={`${classes['about__brands-grid']} separator-border mt-10`}>
                    <div className="row">
                        <div className="col-6 col-md-3">
                            <div className={`${classes['about__brands-grid-item']} text-center`}>
                                <h4 className="text-12  mb-0 text-white-50">
                                    <span>5</span>+
                                </h4>
                                <p className="mb-0 text-light">Years as a developer</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className={`${classes['about__brands-grid-item']} text-center`}>
                                <h4 className="mb-0 text-white-50">
                                    <span>30</span>+
                                </h4>
                                <p className="mb-0 text-light">Happy Clients</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className={`${classes['about__brands-grid-item']} text-center`}>
                                <h4 className="mb-0 text-white-50">
                                    <span>80</span>+
                                </h4>
                                <p className="mb-0 text-light">Projects Done</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className={`${classes['about__brands-grid-item']} text-center`}>
                                <h4 className="mb-0 text-white-50">
                                    <span>8</span>+
                                </h4>
                                <p className="mb-0 text-light">Years as an English instructor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
