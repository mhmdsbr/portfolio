import React from 'react';
import classes from "./Summary.module.scss";

const ExperienceList = ({experience}) => {
    const firstThreeItems = experience.slice(0, 3);
    const lastThreeItems = experience.slice(3);

    return (
        <div className="row">
            <div className="col-md-6">
                {firstThreeItems.map((experience, index) => (
                    <div key={index} className={` ${classes['summary__featured-box']} rounded p-4 mb-4 bg-dark-2`}>
                        <p className="badge p-2 bg-primary text-2 fw-400">{experience.year}</p>
                        <h4 className="text-white">{experience.title}</h4>
                        <p className="text-primary">{experience.company}</p>
                        <p className="mb-0 text-white-50">{experience.description}</p>
                    </div>
                ))}
            </div>
            <div className="col-md-6">
                {lastThreeItems.map((experience, index) => (
                    <div key={index} className={` ${classes['summary__featured-box']} rounded p-4 mb-4 bg-dark-2`}>
                        <p className="badge p-2 bg-primary text-2 fw-400">{experience.year}</p>
                        <h4 className="text-white">{experience.title}</h4>
                        <p className="text-primary">{experience.company}</p>
                        <p className="mb-0 text-white-50">{experience.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceList;