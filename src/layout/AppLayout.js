import React from 'react';

import MainContainer from "./MainContainer";
import MainSidebar from "./header/MainSidebar";
import Hero from "../sections/hero/Hero";
import About from "../sections/about/About";
import Services from "../sections/services/Services";
import Summary from "../sections/summary/Summary";
import Portfolio from "../sections/portfolio/Portfolio";
import Testimonial from "../sections/testimonial/Testimonial";
import Contact from "../sections/contact/Contact";

const AppLayout = () => {

    return (
        <div className="row justify-content-center">
            <MainSidebar/>
            <MainContainer>
                <Hero/>
                <About/>
                <Services/>
                <Summary/>
                <Portfolio/>
                <Testimonial/>
                <Contact/>
            </MainContainer>
        </div>
    );
};

export default AppLayout;
