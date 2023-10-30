import React from 'react';

function ProgressBarComponent() {
    // Define an array of data with information for each progress bar
    const progressBarData = [
        { label: 'Web Design', percentage: 65 },
        { label: 'Front-end Development', percentage: 80 },
        { label: 'Back-end Development', percentage: 70 },
        { label: 'UI/UX Design', percentage: 75 },
        { label: 'Content Creation', percentage: 90 },
        { label: 'Testing', percentage: 60 },
    ];

    return (
        <div className="row p-0 mt-4">
            {progressBarData.map((item, index) => (
                <div key={index} className="col-md-6">
                    <p className="fw-500 text-start mb-2 text-light">
                        {item.label} <span className="float-end">{item.percentage}%</span>
                    </p>
                    <div className="progress progress-sm mb-4 bg-dark">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            aria-valuenow={item.percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: `${item.percentage}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProgressBarComponent;
