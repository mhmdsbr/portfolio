import React from 'react';

import MainContainer from "./MainContainer";
import MainSidebar from "./header/MainSidebar";
import Intro from "../sections/intro/Intro";

const AppLayout = () => {
    return (
        <div className="row justify-content-center">
            <MainSidebar />
            <MainContainer>
                <Intro />
            </MainContainer>
        </div>
    );
};

export default AppLayout;
