import React from "react";

import classes from "./HeaderNav.module.scss";

const HeaderNav = (props) => {
    return (
        <nav id="header-nav" className="navbar navbar-expand-lg w-100">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div id="navbarSupportedContent" className="collapse justify-content-center navbar-collapse" >
                <ul className="nav flex-column text-lg-center my-lg-auto py-lg-3">
                    <li className="nav-item">
                        <a className="nav-link">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link">About Me</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link">What I Do</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link">Resume</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link">Portfolio</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link">Testimonial</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link">Contact</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default HeaderNav;
