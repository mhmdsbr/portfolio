import React from 'react';
import classes from "./About.module.scss";

const AboutDetails = ({ detailsData }) => {
    return (
        <div className={`${classes['about__brands-grid']} separator-border mt-10`}>
            <div className="row">
                {detailsData.map((item, index) => (
                    <div className="col-6 col-md-3" key={index}>
                        <div className={`${classes['about__brands-grid-item']} text-center`}>
                            <h4 className="mb-0 text-white-50">
                                <span>{item.value}</span>+
                            </h4>
                            <p className="mb-0 text-light">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutDetails;
