import React from 'react';
import classes from "./Contact.module.scss";
import TitleSection from "../../components/UI/TitleSection";

const Contact = () => {
    return (
        <section id="contact" className={`${classes.contact} bg-dark-2`}>
            <TitleSection
                subtitle="contact"
                title="Be in touch"
            />
        </section>
    );
};

export default Contact;
