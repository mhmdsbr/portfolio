import React, {useContext} from 'react';
import classes from "./About.module.scss";
import TitleSection from "../../components/UI/section/TitleSection";
import Section from "../../components/UI/section/Section";
import AboutContent from "./AboutContent";
import AboutInfo from "./AboutInfo";
import SectionContainer from "../../components/UI/section/SectionContainer";
import AboutDetails from "./AboutDetails";
import {ApiDataContext} from "../../store/ApiDataProvider";

const About = (props) => {
    const { data } = useContext(ApiDataContext);
    const aboutData = data['about-portfolio'];

    if (!aboutData) return null;

    const about_title = aboutData['about_title'];
    const about_title_overlay = aboutData['about_title_secondary'];
    const about_name = aboutData['about_name'];
    const about_job = aboutData['about_job_title'];
    const about_content = aboutData['about_description'];
    const infoData = aboutData['about_contact'];
    const detailsData = aboutData['about_details'];

    return (
        <Section
            id="about"
            className={`${classes.about} bg-dark`}
        >
            <SectionContainer>
                <TitleSection
                    subtitle={about_title_overlay}
                    title={about_title}
                />
                <div className="row">
                    <div className="col-lg-7 col-xl-8 text-center text-lg-start">
                        <AboutContent
                            name={about_name}
                            job={about_job}
                            content={about_content}
                        />
                    </div>
                    <div className="col-lg-5 col-xl-4">
                        <AboutInfo dataInfo={infoData} />
                    </div>
                </div>
                <AboutDetails detailsData={detailsData} />
            </SectionContainer>
        </Section>
    );
};

export default About;
