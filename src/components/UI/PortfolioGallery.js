import React, { useState, useMemo } from "react";
import PortfolioItem from "./PortfolioItem";
import classes from "./PortfolioGallery.module.scss";
import project1 from '../../assets/project-1.jpg';
import project2 from '../../assets/project-2.jpg';
import project3 from '../../assets/project-3.jpg';
import project4 from '../../assets/project-4.jpg';

const portfoliolist = [
    {
        id: 1,
        name: "holigo",
        category: "booking",
        imageSrc: project1
    },
    {
        id: 2,
        name: "freedomstock",
        category: "blog",
        imageSrc: project3
    },
    {
        id: 3,
        name: "milimol",
        category: "b2b",
        imageSrc: project2
    },
    {
        id: 4,
        name: "tarzan",
        category: "gallery",
        imageSrc: project4
    },

];
const categorylist = [
    { id: 1, category: "all", value: "all" },
    { id: 2, category: "booking", value: "all" },
    { id: 3, category: "blog", value: "all" },
    { id: 4, category: "b2b", value: "all" },
    { id: 5, category: "gallery", value: "all" }
];

function Portfolio() {
    const [filter, setFilter] = useState("all");

    const filteredPortfolio = useMemo(() => {
        if (filter === "all") return portfoliolist;

        return portfoliolist.filter((portfolio) => portfolio.category === filter);
    }, [filter]);

    return (
        <div className={`${classes.portfolioGallery} container max-width`}>
            <div className="row justify-content-center">
                <div className="col-12">
                    <ul className="nav pointer-event border-bottom-0 justify-content-center mb-5">
                        {categorylist.map((types) => (
                            <li className="nav-item gx-2">
                                <a className={`${classes['portfolioGallery__nav-link']} nav-link text-capitalize text-white m-2`} onClick={() => setFilter(types.category)}>
                                    {types.category}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={`${classes['portfolioGallery__items']}`}>
                {filteredPortfolio.map((item) => (
                    <div className={`${classes['portfolioGallery__grid-item']}`} key={item.id}>
                        <PortfolioItem item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Portfolio;
