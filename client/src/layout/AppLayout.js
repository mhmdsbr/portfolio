import React from 'react';
import MainContainer from "./MainContainer";
import DataProvider from "../store/dataProvider";
import Hero from "../sections/hero/Hero";

const AppLayout = () => {

    return (
        <div className="row justify-content-center">
            <DataProvider url="https://mohammadsaber.com/server/wp-json/portfolio/v2/hero-portfolio" />
            <MainContainer>
                <Hero />
            </MainContainer>
        </div>
    );
};

export default AppLayout;

