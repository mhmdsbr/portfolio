import React from 'react';
import classes from "./Portfolio.module.scss";
import TitleSection from "../../components/UI/TitleSection";

const Portfolio = () => {
    return (
        <section id="summary" className={`${classes.portfolio} bg-dark-2`}>
            <TitleSection
                subtitle="Portfolio"
                title="My Work"
            />
        </section>
    );
};

export default Portfolio;
