import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const ProjectsFieldsContext = createContext();

const ProjectsFieldsProvider = ({ children }) => {
    const [projectsFields, setProjectsFields] = useState(null);

    useEffect(() => {
        const fetchProjectsFields = async () => {
            try {
                const res = await axios.get('http://portfolio.test/wp-json/portfolio/v2/projects-portfolio');
                const { data } = res;
                setProjectsFields(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProjectsFields();
    }, []);

    return (
        <ProjectsFieldsContext.Provider value={projectsFields}>
            {children}
        </ProjectsFieldsContext.Provider>
    );
};

export { ProjectsFieldsProvider, ProjectsFieldsContext };
