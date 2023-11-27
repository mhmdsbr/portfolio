import React from 'react';
import classes from "./About.module.scss";

const AboutDetails = ({ detailsData }) => {
    return (
        <div className={`${classes['about__brands-grid']} separator-border mt-10`}>
            <div className="row">
                {detailsData.map((item, index) => (
                    <div className="col-12 mb-6 mb-md-0 col-md-3" key={index}>
                        <div className={`${classes['about__brands-grid-item']} text-center`}>
                            <h4 className="mb-0 text-white-50">
                                <span>{item.content}</span>+
                            </h4>
                            <p className="mb-0 text-light">{item.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutDetails;
