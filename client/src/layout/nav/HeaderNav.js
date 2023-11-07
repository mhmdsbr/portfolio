import React, { useContext } from "react";
import classes from "./HeaderNav.module.scss";
import { MenuItemsContext } from "../../store/MenuItemsContext";

const HeaderNav = (props) => {
    const menuItems = useContext(MenuItemsContext);

    return (
        <nav id="header-nav" className="navbar navbar-expand-lg w-100">
            <div id="navbarSupportedContent" className="collapse justify-content-center navbar-collapse">
                <ul className="nav flex-column text-lg-center my-lg-auto py-lg-3">
                    {menuItems.map((menuItem, index) => (
                        <li className="nav-item" key={index}>
                            <a
                                href={menuItem.url}
                                className={`${classes['navbar__link']} nav-link`}
                            >
                                {menuItem.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default HeaderNav;

