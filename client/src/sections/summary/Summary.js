import React, {useContext} from 'react';
import classes from './Summary.module.scss';
import TitleSection from '../../components/UI/section/TitleSection';
import ProgressBar from "./ProgressBar";
import Button from "../../components/UI/button/Button";
import Section from "../../components/UI/section/Section";
import SectionContainer from "../../components/UI/section/SectionContainer";
import ExperienceList from "./ExperienceList";
import {SummaryFieldsContext} from "../../store/SummaryFieldsContext";

const Summary = () => {
    const summariesData = useContext(SummaryFieldsContext);
    if (!summariesData) {
        return <p>Loading...</p>;
    }
    const jobs = summariesData.summaries;
    const experiences = summariesData.experiences;
    const buttonContent = summariesData.summary_button;

    return (
        <Section id="summary" className={`${classes.summary} bg-dark`}>
            <TitleSection subtitle="Summary" title="Resume" />
            <SectionContainer>
                <ExperienceList jobs={jobs} />
                <div className="row justify-content-center">
                    <ProgressBar progressBarData={experiences}  />
                    <div className="col-6 mt-5 w-100 text-center">
                        <Button url={buttonContent['url']} className="btn-secondary text-white border-secondary" content={buttonContent['title']} />
                    </div>
                </div>
            </SectionContainer>
        </Section>
    );
};

export default Summary;
