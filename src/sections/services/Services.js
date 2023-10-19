import React from 'react';
import classes from '../services/Services.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPalette,
    faDesktop,
    faPencilRuler,
    faPaintbrush,
    faChartArea,
    faBullhorn,
} from '@fortawesome/free-solid-svg-icons';

const servicesData = [
    {
        icon: faPalette,
        title: 'Graphic Design',
        content: 'Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.',
    },
    {
        icon: faDesktop,
        title: 'Web Development',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        icon: faPencilRuler,
        title: 'UI/UX Design',
        content: 'Vim, ad mea essent possim iriure. Lisque persius interesset his et, in quot quidam persequeris.',
    },
    {
        icon: faPaintbrush,
        title: 'Digital Marketing',
        content: 'Ad mea essent possim iriure. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        icon: faChartArea,
        title: 'Data Analysis',
        content: 'Quot quidam persequeris vim. Lisque persius interesset his et, in quot quidam persequeris vim.',
    },
    {
        icon: faBullhorn,
        title: 'Advertising',
        content: 'Iriure. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
];


const Services = () => {
    return (
        <section id="services" className={`${classes.services} bg-dark-2`}>
            <div className="container max-width">
                <div className="position-relative d-flex text-center mb-5">
                    <h2 className={`${classes['services__title-muted']} w-100 mb-0 opacity-25`}>services</h2>
                    <p className={`${classes['services__title']} fw-600 position-absolute w-100 align-self-center lh-base mb-0 text-white`}>
                        What I do?
                        <span className={`${classes['services__title-separator']} border-bottom border-5 border-primary d-block mx-auto`}></span>
                    </p>
                </div>
                <div className="row">
                    <div className="col-lg-11 mx-auto">
                        <div className="row">
                            {servicesData.map((service, index) => (
                                <div key={index} className="col-md-6">
                                    <div className={`${classes['services__featured-box']} mb-5`}>
                                        <div className={`${classes['services__featured-box-icon']} text-primary rounded bg-dark`}>
                                            <FontAwesomeIcon icon={service.icon} size="2x" />
                                        </div>
                                        <div className={`${classes['services__featured-box-content']}`}>
                                            <h3 className="text-white">{service.title}</h3>
                                            <p className="mb-0 text-white-50">{service.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
