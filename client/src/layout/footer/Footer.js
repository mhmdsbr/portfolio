import React, {useContext} from 'react';
import {createPortal} from "react-dom";
import classes from "./Footer.module.scss";
import useMobileCheck from "../../components/MobileCheck";
import {ApiDataContext} from "../../store/ApiDataProvider";

const Footer = (props) => {
    const footerApi = useContext(ApiDataContext);
    const footerData = footerApi['general-portfolio'];
    const isMobile = useMobileCheck();
    if (footerData === null) {
        return null;
    }
    const termsDisclaimer = {
        terms: footerData.terms,
        disclaimer: footerData.disclaimer
    }
    return (
        <footer id="footer" className={`${classes.footer} ${isMobile ? 'col-12' : 'col-10 offset-2'} bg-dark text-white gx-0`}>
            <div className="container max-width">
                <div className="row justify-content-center">
                    <div className="col-lg-6 text-center text-lg-start">
                        <p className="mb-3 mb-lg-0">
                            Copyright © 2023 <a href="#home" className="fw-medium text-primary">Mohammad Saber</a>. All Rights Reserved.
                        </p>
                    </div>
                    <div className="col-lg-6">
                        <ul className="nav nav-separator justify-content-center justify-content-lg-end">
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    role="button"
                                    data-bs-toggle="modal"
                                    href="#terms-policy"
                                >
                                    Terms &amp; Policy
                                </a>
                                {createPortal(
                                    <div className="modal fade" id="terms-policy" tabIndex="-1" role="dialog" aria-labelledby="terms-policyLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-xl" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header d-flex">
                                                    <h5 className="modal-title text-white" id="terms-policyLabel">
                                                        Terms and Policies
                                                    </h5>
                                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                    <a type="button" className="btn-secondary h4 mb-0 text-decoration-none" data-bs-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </a>
                                                </div>
                                                <div
                                                    className="modal-body"
                                                    dangerouslySetInnerHTML={{ __html: termsDisclaimer.terms }}
                                                >
                                                </div>
                                            </div>
                                        </div>
                                    </div>,
                                    document.body
                                )}
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    role="button"
                                    data-bs-toggle="modal"
                                    href="#disclaimer"
                                >
                                    Disclaimer
                                </a>
                                {createPortal(
                                    <div className="modal fade" id="disclaimer" tabIndex="-1" role="dialog" aria-labelledby="diclaimerLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-xl" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header d-flex">
                                                    <h5 className="modal-title text-white" id="disclaimerLabel">
                                                        Copyright and Disclaimer
                                                    </h5>
                                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                    <a type="button" className="btn-secondary h4 mb-0 text-decoration-none" data-bs-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </a>
                                                </div>
                                                <div className="modal-body" dangerouslySetInnerHTML={{ __html: termsDisclaimer.disclaimer }}>
                                                </div>
                                            </div>
                                        </div>
                                    </div>,
                                    document.body
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;