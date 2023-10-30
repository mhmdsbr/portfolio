import React from 'react';
import classes from "./Section.module.scss";
const Section = (props) => {
    return (
        <section id={props.id} className={`${classes.section} ${props.className}`}>
            {props.children}
        </section>
    );
};

export default Section;