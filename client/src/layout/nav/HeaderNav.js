import React, {Fragment, useContext} from "react";
import classes from "./HeaderNav.module.scss";
import { MenuItemsContext } from "../../store/MenuItemsContext";

const HeaderNav = (props) => {
    const menuItems = useContext(MenuItemsContext);

    return (
        <Fragment>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <nav id="header-nav" className="w-100">
                <div id="navbarSupportedContent" className={`${classes.headerNav} collapse navbar-collapse justify-content-center`}>
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
        </Fragment>

    );
};

export default HeaderNav;

