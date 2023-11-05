import React from 'react';
import classes from "./ContactForm.module.scss";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/button/Button";

const ContactForm = () => {
    const contactTitle = "Send Us A Note";
    return (
        <React.Fragment>
            <h2 className="mb-3 text-uppercase text-center text-md-start text-white">
                {contactTitle}
            </h2>
            <form className={`${classes.contactForm} `} id="contact-form" action="" method="post">
                <div className="row g-4">
                    <div className="col-xl-6">
                        <Input
                            name="user_name"
                            type="text"
                            className={`${classes['input']}`}
                            required=""
                            placeholder="Name"
                        />
                    </div>
                    <div className="col-xl-6">
                        <Input
                            name="user_email"
                            type="email"
                            className={`${classes['input']}`}
                            required=""
                            placeholder="Email"
                        />
                    </div>
                    <div className="col">
                        <Input
                            name="message"
                            type="textarea"
                            className={`${classes['input']}`}
                            required=""
                            placeholder="Tell us more about your needs........"
                            rows="5"
                        />
                    </div>
                </div>
                <Button
                    id="submit-btn"
                    className="btn rounded-pill mt-4 mb-0 d-inline-flex"
                    type="submit"
                    content="Message"
                >
                </Button>
            </form>
        </React.Fragment>
    );
};

export default ContactForm;
