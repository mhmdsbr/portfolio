import React, {useContext} from 'react';
import TitleSection from "../../components/UI/section/TitleSection";
import classes from '../services/Services.module.scss';
import Section from "../../components/UI/section/Section";
import SectionContainer from "../../components/UI/section/SectionContainer";
import ServicesList from "./ServicesList";
import {ApiDataContext} from "../../store/ApiDataProvider";

const Services = () => {
    const servicesDataApi = useContext(ApiDataContext);
    const servicesData = servicesDataApi['services-portfolio'];
    if (servicesData === null) {
        return null;
    }
    const services_title = servicesData['services_title'];
    const services_title_overlay = servicesData['services_title_overlay'];
    const services = servicesData['services'];

    return (
        <Section id="services" className={`${classes.services} bg-dark-2`}>
            <SectionContainer>
                <TitleSection
                    title={services_title}
                    subtitle={services_title_overlay}
                />
                <div className="row">
                    <div className="col-lg-12">
                        <ServicesList servicesData={services} />
                    </div>
                </div>
            </SectionContainer>
        </Section>
    );
};

export default Services;
