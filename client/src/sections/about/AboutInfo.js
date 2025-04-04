import React, { Fragment, useContext } from 'react';
import classes from "./About.module.scss";
import Button from "../../components/UI/button/Button";
import {ApiDataContext} from "../../store/ApiDataProvider";

const AboutInfo = ({ dataInfo }) => {
    const { data } = useContext(ApiDataContext);
    const aboutData = data['about-portfolio'];
    if (aboutData === null) return null;

    const about_button = aboutData['about_button'];
    const shouldShowButton = about_button?.url && about_button?.title;

    return (
        <Fragment>
            <div className={`${classes['about__my-info']} ps-lg-4`}>
                <ul className="list-style text-light">
                    {dataInfo.map((item, index) => (
                        <li key={index}>
                            <span
                                className={`${classes['about__info']}`}>
                                {item.title}:
                            </span>
                            {item.content}
                        </li>
                    ))}
                </ul>
                {shouldShowButton && (
                    <Button
                        className="p-1"
                        url={about_button.url}
                        content={about_button.title}
                    />
                )}
            </div>
        </Fragment>
    );
};

export default AboutInfo;
