import React from 'react';
import classes from "./Portfolio.module.scss";
import TitleSection from "../../components/UI/section/TitleSection";
import PortfolioGallery from "./PortfolioGallery";
import Section from "../../components/UI/section/Section";

const Portfolio = () => {
    return (
        <Section id="portfolio" className={`${classes.portfolio} bg-dark-2`}>
            <TitleSection
                subtitle="Portfolio"
                title="My Work"
            />
            <PortfolioGallery />
        </Section>
    );
};

export default Portfolio;
