import React, { Fragment } from 'react';
import classes from "./About.module.scss";
import Button from "../../components/UI/button/Button";

const AboutInfo = ({ data }) => {
    return (
        <Fragment>
            <div className={`${classes['about__my-info']} ps-lg-4`}>
                <ul className="list-style text-light">
                    {data.map((item, index) => (
                        <li key={index}>
                            <span className={`${classes['about__info']}`}>{item.label}:</span>{item.value}
                        </li>
                    ))}
                </ul>
                <Button className="p-1" href="#" content="Download CV"/>
            </div>
        </Fragment>
    );
};

export default AboutInfo;
