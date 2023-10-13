import React from 'react';

import MainContainer from "./MainContainer";
import MainSidebar from "./MainSidebar";

const AppLayout = (props) => {
    return (
        <div className="row justify-content-center">
            <MainSidebar />
            <MainContainer />
        </div>
    );
};

export default AppLayout;
