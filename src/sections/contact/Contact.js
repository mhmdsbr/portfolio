import React from 'react';
import classes from "./Contact.module.scss";
import TitleSection from "../../components/UI/section/TitleSection";
import {
    faEnvelope,
    faPhone,

} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FollowUs from "../../components/UI/FollowUs";
import ContactForm from "../../components/forms/ContactForm";

const socialMediaLinks = [
    { icon: 'linkedin', url: 'http://www.linkedin.com/' },
    { icon: 'github', url: 'http://www.github.com/' },
    { icon: 'twitter', url: 'http://www.twitter.com/' },
    { icon: 'google', url: 'http://www.google.com/' },
];
const Contact = () => {
    return (
        <section id="contact" className={`${classes.contact} bg-dark-2`}>
            <div className="container max-width">
                <TitleSection
                    subtitle="contact"
                    title="Be in touch"
                />
                <div className="row">
                    <div className="col-md-4 col-xl-3 gx-1 order-1 order-md-0 text-center text-md-start">
                        <h2 className="mb-3 text-5 text-uppercase text-white">Address</h2>
                        <p className="mb-4 text-light">Iran, Gilan, Rasht</p>
                        <p className="mb-3 d-flex align-items-baseline text-light">
                            <span className="pe-2 text-primary">
                                <FontAwesomeIcon icon={faPhone} size="1x" />
                            </span>
                            (098) 935 390 9220
                        </p>
                        <p className="mb-4 text-light">
                            <span className="pe-2 text-primary">
                                <FontAwesomeIcon icon={faEnvelope} size="1x" />
                            </span>
                            saaber.mohamad@gmail.com
                        </p>
                        <FollowUs title="Follow Us" socialMediaLinks={socialMediaLinks} />
                    </div>
                    <div className="col-md-8 col-xl-9 order-0 order-md-1">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
