import React from 'react';
import classes from "./Services.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ServicesList = ({servicesData}) => {
    return (
        <div className="row">
            {servicesData.map((service, index) => (
                <div key={index} className="col-md-6">
                    <div className={`${classes['services__featured-box']} mb-5`}>
                        <div className={`${classes['services__featured-box-icon']} text-primary rounded bg-dark`}>
                            <FontAwesomeIcon icon={service.icon} size="2x" />
                        </div>
                        <div className={`${classes['services__featured-box-content']}`}>
                            <h3 className="text-white">{service.title}</h3>
                            <p className="mb-0 text-white-50">{service.content}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServicesList;