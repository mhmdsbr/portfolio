import React from 'react';

import classes from "./About.module.scss";

const About = () => {
    return (
        <section id="about" className={`${classes.about} bg-dark`}>
            <div className="container">
                <div className="position-relative d-flex text-center mb-5">
                    <h2 className={`${classes['about__title-muted']} w-100 mb-0 opacity-25`}>About Me</h2>
                    <p className={`${classes['about__title']} fw-600 position-absolute w-100 align-self-center lh-base mb-0 text-white`}>Know Me More
                        <span className={`${classes['about__title-separator']} border-bottom border-5 border-primary d-block mx-auto`}></span>
                    </p>
                </div>
                <div className="row">
                    <div className="col-lg-7 col-xl-8 text-center text-lg-start">
                        <h2 className="fw-600 mb-3 text-white">
                            I'm <span className="text-primary">Simone Olivia,</span>
                            a Web Developer
                        </h2>
                        <p className="text-white-50">I help you build brand for your business at an affordable price. Thousands of clients have procured exceptional results while working with our dedicated team. when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        <p className="text-white-50">Delivering work within time and budget which meets client’s requirements is our moto. Lorem Ipsum has been the industry's standard dummy text ever when an unknown printer took a galley.</p>
                    </div>
                    <div className="col-lg-5 col-xl-4">
                        <div className="ps-lg-4">
                            <ul className="list-style-2 list-style-light text-light">
                                <li><span className="fw-600 me-2">Name:</span>Simone Olivia</li>
                                <li><span className="fw-600 me-2">Email:</span>
                                    <a href="mailto:chat@simone.com">chat@simone.com</a>
                                </li>
                                <li>
                                    <span className="fw-600 me-2">Age:</span>28
                                </li>
                                <li className="border-0">
                                    <span className="fw-600 me-2">From:</span>
                                    Los Angeles, California
                                </li>
                            </ul>
                            <a href="/demo/react/simone/demo/static/media/resume.c84e759e31a37c0be66e.pdf" download="" className="btn btn-primary rounded-pill">Download CV
                            </a>
                        </div>
                    </div>
                </div>
                <div className="brands-grid separator-border mt-5 separator-border-light">
                    <div className="row">
                        <div className="col-6 col-md-3">
                            <div className="featured-box text-center">
                                <h4 className="text-12  mb-0 text-white-50">
                                    <span>10</span>+
                                </h4>
                                <p className="mb-0 text-light">Years Experiance</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="featured-box text-center">
                                <h4 className="text-12  mb-0 text-white-50">
                                    <span>250</span>+
                                </h4>
                                <p className="mb-0 text-light">Happy Clients</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="featured-box text-center">
                                <h4 className="text-12  mb-0 text-white-50">
                                    <span>650</span>+
                                </h4>
                                <p className="mb-0 text-light">Projects Done</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="featured-box text-center">
                                <h4 className="text-12  mb-0 text-white-50">
                                    <span>38</span>
                                </h4>
                                <p className="mb-0 text-light">Get Awards</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
