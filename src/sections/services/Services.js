import React from 'react';
import TitleSection from "../../components/UI/section/TitleSection";
import classes from '../services/Services.module.scss';
import {
    faPalette,
    faDesktop,
    faPencilRuler,
    faPaintbrush,
    faChartArea,
    faBullhorn,
} from '@fortawesome/free-solid-svg-icons';
import Section from "../../components/UI/section/Section";
import SectionContainer from "../../components/UI/section/SectionContainer";
import ServicesList from "./ServicesList";

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
        <Section id="services" className={`${classes.services} bg-dark-2`}>
            <SectionContainer>
                <TitleSection
                    title="What I do?"
                    subtitle="Services"
                />
                <div className="row">
                    <div className="col-lg-12">
                        <ServicesList servicesData={servicesData} />
                    </div>
                </div>
            </SectionContainer>
        </Section>
    );
};

export default Services;
