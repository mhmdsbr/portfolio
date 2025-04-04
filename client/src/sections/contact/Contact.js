import React, { useContext } from 'react';
import classes from './Contact.module.scss';
import TitleSection from '../../components/UI/section/TitleSection';
import FollowUs from '../../components/UI/FollowUs';
import ContactForm from './ContactForm';
import ContactContent from './ContactContent';
import Section from '../../components/UI/section/Section';
import {ApiDataContext} from "../../store/ApiDataProvider";


const Contact = () => {
    const { data } = useContext(ApiDataContext);
    const contactSettings = data['contact-portfolio'];
    if (!contactSettings) return null;


    const contactTitle = {
        title: contactSettings.contact_title,
        overlay: contactSettings.contact_title_overlay
    }
    const contactInfo = {
        title: contactSettings.contact_info_title,
        address: contactSettings.contact_info_address,
        phone: contactSettings.contact_info_phone,
        email: contactSettings.contact_info_email,
    };
    const contactForm = {
        title: contactSettings.contact_form_title,
        buttonTitle: contactSettings.contact_button.title,
        buttonUrl: contactSettings.contact_button.url
    }

    return (
        <Section id="contact" className={`${classes.contact} bg-dark-2`}>
            <div className="container max-width">
                <TitleSection
                    subtitle={contactTitle.title}
                    title={contactTitle.overlay} />
                <div className="row">
                    <div className="col-md-4 col-xl-3 mt-6 mt-sm-0 order-1 order-md-0 text-center text-md-start">
                        <ContactContent contactInfo={contactInfo} />
                        <FollowUs
                            title="Follow Me"
                            className={`${classes['contact__social']}`}
                        />
                    </div>
                    <div className="col-md-8 col-xl-9 order-0 order-md-1">
                        <ContactForm
                            title={contactForm.title}
                            buttonUrl={contactForm.buttonUrl}
                            buttonTitle = {contactForm.buttonTitle}
                        />
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Contact;