import React from 'react';
import classes from "./Summary.module.scss";

const ExperienceList = ({jobs}) => {
    const firstThreeItems = jobs.slice(0, 3);
    const lastThreeItems = jobs.slice(3);

    return (
        <div className="row">
            <div className="col-md-6">
                {firstThreeItems.map((jobs, index) => (
                    <div key={index} className={` ${classes['summary__featured-box']} rounded p-4 mb-4 bg-dark-2`}>
                        <p className="badge p-2 bg-primary fw-400">{jobs.from} - {jobs.to}</p>
                        <h4 className="text-white">{jobs.title}</h4>
                        <p className="text-primary mb-0">{jobs.company}</p>
                        <p className={`${classes['summary__featured-description']} mb-0 text-white-50`}>{jobs.description}</p>
                    </div>
                ))}
            </div>
            <div className="col-md-6">
                {lastThreeItems.map((jobs, index) => (
                    <div key={index} className={` ${classes['summary__featured-box']} rounded p-4 mb-4 bg-dark-2`}>
                        <p className="badge p-2 bg-primary fw-400">{jobs.from} - {jobs.to}</p>
                        <h4 className="text-white">{jobs.title}</h4>
                        <p className="text-primary mb-0">{jobs.company}</p>
                        <p className={`${classes['summary__featured-description']} mb-0 text-white-50`}>{jobs.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceList;