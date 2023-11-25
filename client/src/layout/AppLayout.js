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
import {AboutFieldsProvider} from "../store/AboutFieldsContext";
import {ServicesFieldsProvider} from "../store/ServicesFieldsContext";
import {SummaryFieldsProvider} from "../store/SummaryFieldsContext";
import {ProjectsFieldsProvider} from "../store/ProjectsFieldsContext";
import {TestimonialFieldsProvider} from "../store/TestimonialFieldsContext";
import {ContactFieldsProvider} from "../store/ContactFieldsContext";

const AppLayout = (props) => {

    return (
        <div className="row justify-content-center">
            <GeneralFieldsProvider>
                <MainSidebar />
            <MainContainer>
                <HeroFieldsProvider>
                    <Hero/>
                </HeroFieldsProvider>
                <AboutFieldsProvider>
                    <About/>
                </AboutFieldsProvider>
                <ServicesFieldsProvider>
                    <Services/>
                </ServicesFieldsProvider>
                <SummaryFieldsProvider>
                    <Summary/>
                </SummaryFieldsProvider>
                <ProjectsFieldsProvider>
                    <Portfolio/>
                </ProjectsFieldsProvider>
                <TestimonialFieldsProvider>
                    <Testimonial/>
                </TestimonialFieldsProvider>
                <ContactFieldsProvider>
                    <Contact/>
                </ContactFieldsProvider>
            </MainContainer>
            </GeneralFieldsProvider>
            <Footer />
        </div>
    );
};

export default AppLayout;
