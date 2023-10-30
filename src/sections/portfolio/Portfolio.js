import React from 'react';
import classes from "./Portfolio.module.scss";
import TitleSection from "../../components/UI/section/TitleSection";
import PortfolioGallery from "./PortfolioGallery";

const Portfolio = () => {
    return (
        <section id="portfolio" className={`${classes.portfolio} bg-dark-2`}>
            <TitleSection
                subtitle="Portfolio"
                title="My Work"
            />
            <PortfolioGallery />
        </section>
    );
};

export default Portfolio;
