import React, { useState, useEffect, useContext } from "react";
import PortfolioItem from "./PortfolioItem";
import classes from "./PortfolioGallery.module.scss";
import { ApiDataContext } from "../../store/ApiDataProvider";

function PortfolioGallery() {
    const { data } = useContext(ApiDataContext);
    const projectsData = data['projects-portfolio'];
    const [portfolioList, setPortfolioList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredItems, setFilteredItems] = useState([]);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (projectsData?.projects) {
            const formattedProjects = projectsData.projects.map(project => ({
                id: project.post_id,
                name: project.title,
                category: project.project_types?.length > 0 ? project.project_types[0] : 'uncategorized',
                imageSrc: project.featured_image,
                url: project.permalink
            }));
            setPortfolioList(formattedProjects);
            setFilteredItems(formattedProjects);
        }
    }, [projectsData]);

    useEffect(() => {
        if (animate) {
            const timer = setTimeout(() => setAnimate(false), 500);
            return () => clearTimeout(timer);
        }
    }, [animate]);

    if (!projectsData) return null;

    // Extract unique categories
    const allCategories = {
        term_id: 0,
        name: "All",
        slug: "all"
    };

    const projectCategories = portfolioList.reduce((acc, project) => {
        if (project.category !== 'uncategorized' && !acc.some(cat => cat.slug === project.category)) {
            acc.push({
                term_id: project.id,
                name: project.category,
                slug: project.category
            });
        }
        return acc;
    }, [allCategories]);

    const handleCategorySelection = (categorySlug) => {
        setFilteredItems(
            categorySlug === "all"
                ? portfolioList
                : portfolioList.filter(item => item.category === categorySlug)
        );
        setSelectedCategory(categorySlug);
        setAnimate(true);
    };

    return (
        <div className={`${classes.portfolioGallery} container max-width`}>
            <div className="row justify-content-center">
                <div className="col-12">
                    <ul className="nav pointer-event border-bottom-0 justify-content-center mb-5">
                        {projectCategories.map(category => (
                            <li className="nav-item gx-2" key={category.slug}>
                                <button
                                    className={`${classes["portfolioGallery__nav-link"]} nav-link text-capitalize m-2 border-0 bg-transparent`}
                                    onClick={() => handleCategorySelection(category.slug)}
                                    style={{
                                        fontWeight: category.slug === selectedCategory ? "bold" : "normal",
                                        cursor: 'pointer'
                                    }}
                                >
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={classes["portfolioGallery__items"]}>
                {filteredItems.map((item) => (
                    <div
                        className={`${classes["portfolioGallery__grid-item"]} ${
                            animate ? "fade-in show" : ""
                        }`}
                        key={item.id}
                    >
                        <PortfolioItem item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PortfolioGallery;