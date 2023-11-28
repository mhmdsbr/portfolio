import React, { useState, useEffect, useContext } from "react";
import PortfolioItem from "./PortfolioItem";
import classes from "./PortfolioGallery.module.scss";
import { ProjectsFieldsContext } from "../../store/ProjectsFieldsContext";

function PortfolioGallery() {
    const projects = useContext(ProjectsFieldsContext);

    let projectTax = [];
    if (projects && projects.length > 0) {
        projects.forEach((project) => {
            const projectTypes = project.project_types;
            if (Array.isArray(projectTypes) && projectTypes.length > 0) {
                projectTax = projectTax.concat(projectTypes);
            }
        });
    }
    const allCategory = {
        term_id: 0,
        name: "All",
        slug: "all",
    };
    projectTax.unshift(allCategory);

    const [portfolioList, setPortfolioList] = useState([]);

    useEffect(() => {
        if (projects && projects.length > 0) {
            let tempPortfolioList = [];
            projects.forEach((project) => {
                const category = project.project_types.length > 0 ? project.project_types[0].slug : 'uncategorized';
                let portfolioItem = {
                    id: project.post_id,
                    name: project.title,
                    category,
                    imageSrc: project.featured_image,
                };
                tempPortfolioList.push(portfolioItem);
            });
            setPortfolioList(tempPortfolioList);
            setFilteredItems(tempPortfolioList);
        }
    }, [projects]);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredItems, setFilteredItems] = useState([]);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (animate) {
            const animationTimeout = setTimeout(() => {
                setAnimate(false);
            }, 500);
            return () => clearTimeout(animationTimeout);
        }
    }, [animate]);

    const handleCategorySelection = (selectedCategory) => {
        if (selectedCategory === "all") {
            setFilteredItems(portfolioList);
        } else {
            const filtered = portfolioList.filter((item) => item.category === selectedCategory);
            setFilteredItems(filtered);
        }

        setSelectedCategory(selectedCategory);
        setAnimate(true);
        setIsLoading(false);
    };

    if(!isLoading) {
        return (
            <div className={`${classes.portfolioGallery} container max-width`}>
                <div className="row justify-content-center">
                    <div className="col-12">
                        <ul className="nav pointer-event border-bottom-0 justify-content-center mb-5">
                            {[...new Set(projectTax.map(category => category.name))].map(uniqueCategory => {
                                const category = projectTax.find(item => item.name === uniqueCategory);

                                return (
                                    <li className="nav-item gx-2" key={category.term_id}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a
                                            className={`${classes["portfolioGallery__nav-link"]} nav-link text-capitalize m-2`}
                                            onClick={() => handleCategorySelection(category.slug)}
                                            style={category.name === selectedCategory ? {fontWeight: "bold"} : {}}
                                        >
                                            {category.name}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className={`${classes["portfolioGallery__items"]}`}>
                    {filteredItems.map((item, index) => (
                        <div
                            className={`${classes["portfolioGallery__grid-item"]} ${classes[`portfolioGallery__${index}`]} ${
                                animate ? "fade-in show" : ""
                            }`} key={item.id}>
                            <PortfolioItem item={item}/>
                        </div>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <p>
                    loading...
                </p>
            </div>
        )
    }
}
export default PortfolioGallery;
