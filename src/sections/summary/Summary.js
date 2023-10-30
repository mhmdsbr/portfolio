import React from 'react';
import classes from './Summary.module.scss';
import TitleSection from '../../components/UI/section/TitleSection';
import ProgressBar from "./ProgressBar";
import Button from "../../components/UI/button/Button";
import Section from "../../components/UI/section/Section";
import SectionContainer from "../../components/UI/section/SectionContainer";
import ExperienceList from "./ExperienceList";

const experienceData = [
    {
        year: '2012 - 2013',
        title: 'Jr. UI UX Designer',
        company: 'Themeforest',
        description: 'Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.',
    },
    {
        year: '2014 - 2016',
        title: 'Jr. Product Designer',
        company: 'Dribbble',
        description: 'Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.',
    },
    {
        year: '2017 - 2019',
        title: 'Product Designer',
        company: 'Adobe',
        description: 'Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.',
    },
    // Add three more items here
    {
        year: '2020 - 2021',
        title: 'Senior UI Designer',
        company: 'Google',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        year: '2022 - 2023',
        title: 'Lead Product Designer',
        company: 'Apple',
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        year: '2024 - 2025',
        title: 'Principal Designer',
        company: 'Microsoft',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
];

const Summary = () => {

    const buttonContent = "Download CV";

    return (
        <Section id="summary" className={`${classes.summary} bg-dark`}>
            <TitleSection subtitle="Summary" title="Resume" />
            <SectionContainer>
                <ExperienceList experience={experienceData} />
                <div className="row justify-content-center">
                    <ProgressBar />
                    <div className="col-6 mt-5 text-center">
                        <Button className="btn-secondary text-white border-secondary" content={buttonContent} />
                    </div>
                </div>
            </SectionContainer>
        </Section>
    );
};

export default Summary;
