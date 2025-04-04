import React, {useContext} from 'react';
import classes from "./Portfolio.module.scss";
import TitleSection from "../../components/UI/section/TitleSection";
import PortfolioGallery from "./PortfolioGallery";
import Section from "../../components/UI/section/Section";
import {ApiDataContext} from "../../store/ApiDataProvider";

const Portfolio = () => {
    const { data } = useContext(ApiDataContext);
    const projectsTitles = data['projects-portfolio'];
    if (projectsTitles === null) return null;

    return (
        <Section id="portfolio" className={`${classes.portfolio} bg-dark-2`}>
            <TitleSection
                subtitle={projectsTitles.portfolio_title}
                title={projectsTitles.portfolio_overlay_title}
            />
            <PortfolioGallery />
        </Section>
    );
};

export default Portfolio;
