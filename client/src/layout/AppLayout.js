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
import Footer from "./footer/Footer";
import { HeroFieldsProvider } from "../store/HeroFieldsContext";
import {GeneralFieldsProvider} from "../store/GeneralFieldsContext";

const AppLayout = (props) => {

    return (
        <div className="row justify-content-center">
            <GeneralFieldsProvider>
                <MainSidebar />
            <MainContainer>
                <HeroFieldsProvider>
                    <Hero/>
                </HeroFieldsProvider>
                <About/>
                <Services/>
                <Summary/>
                <Portfolio/>
                <Testimonial/>
                <Contact/>
            </MainContainer>
            </GeneralFieldsProvider>
            <Footer />
        </div>
    );
};

export default AppLayout;
