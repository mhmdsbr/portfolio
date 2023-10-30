import React from 'react';
const SectionContainer = (props) => {
    return (
        <div id={props.id} className={`${props.className} container max-width `}>
            {props.children}
        </div>
    );
};

export default SectionContainer;