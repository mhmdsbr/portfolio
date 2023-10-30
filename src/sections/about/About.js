import React from 'react';

import classes from "./About.module.scss";
import TitleSection from "../../components/UI/section/TitleSection";
import Section from "../../components/UI/section/Section";
import AboutContent from "./AboutContent";
import AboutInfo from "./AboutInfo";
import SectionContainer from "../../components/UI/section/SectionContainer";
import AboutDetails from "./AboutDetails";

const About = (props) => {
    const name = 'Mohammad Saber';
    const job = 'Web Developer';
    const content = {
        paragraph1: 'I help you build a brand for your business at an affordable price. Thousands of clients have procured exceptional results while working with our dedicated team. when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
        paragraph2: 'Delivering work within time and budget which meets client’s requirements is our motto. Lorem Ipsum has been the industry\'s standard dummy text ever when an unknown printer took a galley.'
    };
    const infoData = [
        { label: "Name", value: "Mohammad Saber" },
        { label: "Email", value: "saaber.mohamad@gmail.com" },
        { label: "Age", value: 29 },
        { label: "From", value: "Iran, Gilan, Rasht" },
    ];
    const detailsData = [
        { label: "Years as a developer", value: 5 },
        { label: "Happy Clients", value: 30 },
        { label: "Projects Done", value: 80 },
        { label: "Years as an English instructor", value: 8 },
    ];

    return (
        <Section
            id="about"
            className={`${classes.about} bg-dark`}
        >
            <SectionContainer>
                <TitleSection
                    subtitle="About Me"
                    title="Know me more"
                />
                <div className="row">
                    <div className="col-lg-7 col-xl-8 text-center text-lg-start">
                        <AboutContent
                            name={name}
                            job={job}
                            content={content}
                        />
                    </div>
                    <div className="col-lg-5 col-xl-4">
                        <AboutInfo data={infoData} />
                    </div>
                </div>
                <AboutDetails detailsData={detailsData} />
            </SectionContainer>
        </Section>
    );
};

export default About;
