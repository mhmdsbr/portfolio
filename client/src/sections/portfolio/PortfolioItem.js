import React from "react";
import classes from "./PortfolioItem.module.scss";
function PortfolioItem(props) {
    const { item } = props;
    return (
        <div className={classes.portfolioItem}>
            <img className={classes['portfolioItem__image']} src={item.imageSrc} alt={item.category} />
            <div className={`${classes['portfolioItem__details']}`}>
                <h2>{item.name}</h2>
                <p className="mb-0">{item.category}</p>
            </div>
        </div>
    );
}
export default PortfolioItem;