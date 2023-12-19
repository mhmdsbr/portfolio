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
import { ApiDataProvider } from "../store/ApiDataProvider";

const AppLayout = () => {
    const endpoints = [
        "general-portfolio",
        "menu-items",
        "hero-portfolio",
        "about-portfolio",
        "services-portfolio",
        "summary-portfolio",
        "projects-portfolio",
        "testimonial-portfolio",
        "contact-portfolio",
    ];

    return (
        <div className="row justify-content-center">
            <ApiDataProvider endpoints={endpoints}>
                <MainSidebar />
                <MainContainer>
                    <Hero />
                    <About />
                    <Services />
                    <Summary />
                    <Portfolio />
                    <Testimonial />
                    <Contact />
                </MainContainer>
                <Footer />
            </ApiDataProvider>
        </div>
    );
};

export default AppLayout;

