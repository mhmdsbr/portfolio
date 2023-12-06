import React, { useState } from 'react';
import classes from './ContactForm.module.scss';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/button/Button';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const ContactForm = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        setFormData({ ...formData, [name]: value });
    };
    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (value.trim() === '') {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: `${name} is required.` }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://mohammadsaber.com/server/wp-json/portfolio/v2/send-email/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSuccessMessage(response.data.message);
            setErrorMessage('');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            setFormData({
                name: '',
                email: '',
                message: '',
            });
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage(error.response.data.message);
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
        }
    };

    return (
        <React.Fragment>
            <h2 className="mb-3 text-uppercase text-center text-md-start text-white">{props.title}</h2>
            <form className={`${classes.contactForm}`} id="contact-form" method="post">
                <div className="row g-4">
                    <div className="col-xl-6">
                        <Input
                            id="nameInput"
                            name="name"
                            value={formData.name}
                            type="text"
                            className={`${classes['input']}`}
                            required="required"
                            placeholder="Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.name && <div className="alert alert-danger mt-4">{errors.name}</div>}
                    </div>
                    <div className="col-xl-6">
                        <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            className={`${classes['input']}`}
                            required="required"
                            placeholder="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="alert alert-danger mt-4">{errors.email}</div>}
                    </div>
                    <div className="col">
                        <Input
                            name="message"
                            type="textarea"
                            value={formData.message}
                            className={`${classes['input']}`}
                            required=""
                            placeholder="Tell us more about your needs........"
                            rows="5"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.message && <div className="alert alert-danger mt-4">{errors.message}</div>}
                    </div>
                    <div className="col-12">
                        <ReCAPTCHA
                            sitekey="6LdeOCMpAAAAANg9qOCzf9jwGN6_qs9XWB5YYjjQ"
                            theme="dark"
                        />
                    </div>
                </div>
                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                <Button
                    id="submit-btn"
                    className="btn rounded-pill mt-4 mb-0 d-inline-flex"
                    onClickHandler={handleSubmit}
                    content={props.buttonTitle}
                    buttonType="button"
                />
            </form>
        </React.Fragment>
    );
};

export default ContactForm;
