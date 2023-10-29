import React from 'react';
import classes from './Summary.module.scss';
import TitleSection from '../../components/UI/TitleSection';
import ProgressBar from "../../components/UI/ProgressBar";
import Button from "../../components/UI/Button";

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
    const firstThreeItems = experienceData.slice(0, 3);
    const lastThreeItems = experienceData.slice(3);
    const buttonContent = "Download CV";

    return (
        <section id="summary" className={`${classes.summary} bg-dark`}>
            <TitleSection subtitle="Summary" title="Resume" />
            <div className="container max-width">
                <div className="row gx-5">
                    <div className="col-md-6">
                        {firstThreeItems.map((experience, index) => (
                            <div key={index} className={` ${classes['summary__featured-box']} rounded p-4 mb-4 bg-dark-2`}>
                                <p className="badge p-2 bg-primary text-2 fw-400">{experience.year}</p>
                                <h4 className="text-white">{experience.title}</h4>
                                <p className="text-primary">{experience.company}</p>
                                <p className="mb-0 text-white-50">{experience.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-6">
                        {lastThreeItems.map((experience, index) => (
                            <div key={index} className={` ${classes['summary__featured-box']} rounded p-4 mb-4 bg-dark-2`}>
                                <p className="badge p-2 bg-primary text-2 fw-400">{experience.year}</p>
                                <h4 className="text-white">{experience.title}</h4>
                                <p className="text-primary">{experience.company}</p>
                                <p className="mb-0 text-white-50">{experience.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <ProgressBar />
                    <div className="col-6 mt-5 text-center">
                        <Button className="btn-secondary text-white border-secondary" content={buttonContent} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Summary;
