import React from 'react';
import MainContainer from "./MainContainer";
import Hero from "../sections/hero/Hero";

const AppLayout = () => {

    return (
        <div className="row justify-content-center">
            <MainContainer>
                <Hero />
            </MainContainer>
        </div>
    );
};

export default AppLayout;

