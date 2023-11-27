import React, { Fragment, useContext, useState } from "react";
import classes from "./HeaderNav.module.scss";
import { MenuItemsContext } from "../../store/MenuItemsContext";

const HeaderNav = (props) => {
    const menuItems = useContext(MenuItemsContext);
    const [isToggled, setIsToggled] = useState(false);

    const toggleHandler = () => {
        setIsToggled(!isToggled);
    };

    return (
        <Fragment>
            <button
                onClick={toggleHandler}
                className={`${classes.headerNavToggler} navbar-toggler order-1 ${isToggled ? classes.toggled : ''}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#header-nav"
                aria-controls="header-nav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav id="header-nav" className={`${classes.headerNav} collapse navbar-collapse justify-content-center`}>
                <ul className="nav p-2 flex-column text-lg-center my-lg-auto py-lg-3">
                    {menuItems.map((menuItem, index) => (
                        <li className={`${classes['headerNav__item']} nav-item`} key={index}>
                            <a
                                href={menuItem.url}
                                className={`${classes['headerNav__link']} nav-link`}
                            >
                                {menuItem.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </Fragment>
    );
};

export default HeaderNav;
