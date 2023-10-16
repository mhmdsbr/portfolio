import React from 'react';

import MainContainer from "./MainContainer";
import MainSidebar from "./header/MainSidebar";
import Hero from "../sections/hero/Hero";
import About from "../sections/about/About";

const AppLayout = () => {
    return (
        <div className="row justify-content-center">
            <MainSidebar />
            <MainContainer>
                <Hero />
                <About />
            </MainContainer>
        </div>
    );
};

export default AppLayout;
