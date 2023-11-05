import React from 'react';
import classes from "./Contact.module.scss";
import TitleSection from "../../components/UI/section/TitleSection";

import FollowUs from "../../components/UI/FollowUs";
import ContactForm from "./ContactForm";
import ContactContent from "./ContactContent";
import Section from "../../components/UI/section/Section";

const socialMediaLinks = [
    { icon: 'linkedin', url: 'http://www.linkedin.com/' },
    { icon: 'github', url: 'http://www.github.com/' },
    { icon: 'twitter', url: 'http://www.twitter.com/' },
    { icon: 'google', url: 'http://www.google.com/' },
];
const contactInfo = {
    address: '123 Main Street',
    phone: '(123) 456-7890',
    email: 'example@example.com',
};

const Contact = () => {
    return (
        <Section id="contact" className={`${classes.contact} bg-dark-2`}>
            <div className="container max-width">
                <TitleSection
                    subtitle="contact"
                    title="Be in touch"
                />
                <div className="row">
                    <div className="col-md-4 col-xl-3 gx-1 order-1 order-md-0 text-center text-md-start">
                        <ContactContent contactInfo={contactInfo} />
                        <FollowUs title="Follow Us" socialMediaLinks={socialMediaLinks} />
                    </div>
                    <div className="col-md-8 col-xl-9 order-0 order-md-1">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Contact;
