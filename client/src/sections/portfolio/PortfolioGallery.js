import React, { useState, useEffect } from "react";
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
    { id: 2, category: "booking", value: "booking" },
    { id: 3, category: "blog", value: "blog" },
    { id: 4, category: "b2b", value: "b2b" },
    { id: 5, category: "gallery", value: "gallery" }
];

function PortfolioGallery() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredItems, setFilteredItems] = useState(portfoliolist);
    const [animate, setAnimate] = useState(false); // State to control animation

    // Function to update the displayed items based on the selected category
    const handleCategorySelection = (selectedCategory) => {
        if (selectedCategory === "all") {
            // Show all items when "all" is selected
            setFilteredItems(portfoliolist);
        } else {
            // Show items with the selected category
            const filtered = portfoliolist.filter(item => item.category === selectedCategory);
            setFilteredItems(filtered);
        }

        setSelectedCategory(selectedCategory);
        setAnimate(true); // Enable animation
    };

    // Use useEffect to reset the animation flag after the animation is complete
    useEffect(() => {
        if (animate) {
            const animationTimeout = setTimeout(() => {
                setAnimate(false);
            }, 500); // Adjust this timeout to match your CSS transition duration
            return () => clearTimeout(animationTimeout);
        }
    }, [animate]);

    return (
        <div className={`${classes.portfolioGallery} container max-width`}>
            <div className="row justify-content-center">
                <div className="col-12">
                    <ul className="nav pointer-event border-bottom-0 justify-content-center mb-5">
                        {categorylist.map((category) => (
                            <li className="nav-item gx-2" key={category.id}>
                                <a
                                    className={`${classes['portfolioGallery__nav-link']} nav-link text-capitalize text-white m-2`}
                                    onClick={() => handleCategorySelection(category.value)}
                                    style={category.value === selectedCategory ? { fontWeight: "bold" } : {}}
                                >
                                    {category.category}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={`${classes['portfolioGallery__items']}`}>
                {filteredItems.map((item) => (
                    <div className={`${classes['portfolioGallery__grid-item']} ${classes[`portfolioGallery__${item.category}`]} ${animate ? 'fade-in show' : ''}`} key={item.id}>
                        <PortfolioItem item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PortfolioGallery;
