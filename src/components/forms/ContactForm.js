import React from 'react';
import classes from "./ContactForm.module.scss";
const ContactForm = () => {
    return (
        <React.Fragment>
            <h2 className="mb-3 text-uppercase text-center text-md-start text-white">Send us a note</h2>
            <form className={`${classes.contactForm} `} id="contact-form" action="" method="post">
                <div className="row g-4">
                    <div className="col-xl-6">
                        <input name="user_name" type="text" className={`${classes['contactForm__input']} form-control`} required="" placeholder="Name" />
                    </div>
                    <div className="col-xl-6">
                        <input name="user_email" type="email" className={`${classes['contactForm__input']} form-control`} required="" placeholder="Email" />
                    </div>
                    <div className="col">
                        <textarea name="message" className={`${classes['contactForm__input']} form-control`} rows="5" required="" placeholder="Tell us more about your needs........">
                        </textarea>
                    </div>
                </div>
                <p className="mt-4 mb-0">
                    <button id="submit-btn" className="btn btn-primary rounded-pill d-inline-flex" type="submit">Send Message</button>
                </p>
                <div className="Toastify"></div>
            </form>
        </React.Fragment>
    );
};

export default ContactForm;