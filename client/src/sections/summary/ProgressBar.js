import React from 'react';

function ProgressBarComponent({progressBarData}) {

    return (
        <div className="row p-0 mt-4">
            {progressBarData.map((item, index) => (
                <div key={index} className="col-md-6">
                    <p className="fw-500 text-start mb-2 text-light">
                        {item.skill} <span className="float-end">{item.level}%</span>
                    </p>
                    <div className="progress progress-sm mb-4 bg-dark">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            aria-valuenow={item.level}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: `${item.level}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProgressBarComponent;
