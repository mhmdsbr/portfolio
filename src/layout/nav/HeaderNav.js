import React from "react";

import classes from "./HeaderNav.module.scss";

const HeaderNav = (props) => {
    return (
        <nav id="header-nav" className="navbar navbar-expand-lg w-100">
            <div id="navbarSupportedContent" className="collapse justify-content-center navbar-collapse" >
                <ul className="nav flex-column text-lg-center my-lg-auto py-lg-3">
                    <li className="nav-item">
                        <a href="#" className={`${classes['navbar__link']} nav-link`}>Home</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={`${classes['navbar__link']} nav-link `}>About Me</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={`${classes['navbar__link']} nav-link `}>What I Do</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={`${classes['navbar__link']} nav-link `}>Resume</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={`${classes['navbar__link']} nav-link `}>Portfolio</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={`${classes['navbar__link']} nav-link `}>Testimonial</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={`${classes['navbar__link']} nav-link `}>Contact</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default HeaderNav;
