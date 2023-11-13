import React, { useState, useEffect, useContext } from "react";
import PortfolioItem from "./PortfolioItem";
import classes from "./PortfolioGallery.module.scss";
import { ProjectsFieldsContext } from "../../store/ProjectsFieldsContext";

const portfoliolist = [
    {
        id: 1,
        name: "holigo",
        category: "booking",
    },
    {
        id: 2,
        name: "freedomstock",
        category: "blog",
    },
    {
        id: 3,
        name: "milimol",
        category: "b2b",
    },
    {
        id: 4,
        name: "tarzan",
        category: "gallery",
    },
];


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

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredItems, setFilteredItems] = useState(portfoliolist);
    const [animate, setAnimate] = useState(false);

    // Move the useEffect hook to the top-level
    useEffect(() => {
        if (animate) {
            const animationTimeout = setTimeout(() => {
                setAnimate(false);
            }, 500); // Adjust this timeout to match your CSS transition duration
            return () => clearTimeout(animationTimeout);
        }
    }, [animate]);

    const handleCategorySelection = (selectedCategory) => {
        if (selectedCategory === "all") {
            setFilteredItems(portfoliolist);
        } else {
            const filtered = portfoliolist.filter((item) => item.category === selectedCategory);
            setFilteredItems(filtered);
        }

        setSelectedCategory(selectedCategory);
        setAnimate(true);
    };

    return (
        <div className={`${classes.portfolioGallery} container max-width`}>
            <div className="row justify-content-center">
                <div className="col-12">
                    <ul className="nav pointer-event border-bottom-0 justify-content-center mb-5">
                        {projectTax.map((category) => (
                            <li className="nav-item gx-2" key={category.term_id}>
                                <a
                                    className={`${classes["portfolioGallery__nav-link"]} nav-link text-capitalize text-white m-2`}
                                    onClick={() => handleCategorySelection(category.slug)}
                                    style={category.name === selectedCategory ? { fontWeight: "bold" } : {}}
                                >
                                    {category.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={`${classes["portfolioGallery__items"]}`}>
                {filteredItems.map((item) => (
                    <div className={`${classes["portfolioGallery__grid-item"]} ${classes[`portfolioGallery__${item.category}`]} ${
                        animate ? "fade-in show" : ""
                    }`} key={item.id}>
                        <PortfolioItem item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PortfolioGallery;
