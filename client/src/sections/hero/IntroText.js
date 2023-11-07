import React from 'react';

import classes from "./IntroText.module.scss";
import Typewriter from "./TypeWriter";


const IntroText = (props) => {
    const titles = props.data[0].titles;
    const location = props.data[0].location;
    return (
        <div className={`${classes['introText']}`}>
            <p className={`${classes['introText__title']} mb-2 mb-md-3`}>Welcome</p>
            <h2 className={`${classes['introText__name']} mb-2 mb-md-3`}>
                <Typewriter
                    texts={titles}
                    typingSpeed={110}
                    erasingSpeed={30}
                    delay={1200}
                />
            </h2>
            <p className={`${classes['introText__subtitle']} text-5 text-light mb-4`}>{location}</p>
        </div>
    );
};

export default IntroText;