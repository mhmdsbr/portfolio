import React from 'react';
import classes from "./Footer.module.scss";

const Footer = () => {
    return (
            <footer id="footer" className={`${classes.footer} bg-dark text-white col-10 offset-2 gx-0`}>
                <div className="container max-width">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 text-center text-lg-start">
                            <p className="mb-3 mb-lg-0">Copyright © 2023
                                <a href="#home" className="fw-500">Mohammad</a>
                                . All Rights Reserved.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <ul className="nav nav-separator justify-content-center justify-content-lg-end">
                                <li className="nav-item">
                                    <a className="nav-link text-white" data-bs-toggle="modal" data-bs-target="#terms-policy" href="#terms-policy">Terms &amp; Policy</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white" data-bs-toggle="modal" data-bs-target="#disclaimer" href="#disclaimer">Disclaimer</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
    );
};

export default Footer;