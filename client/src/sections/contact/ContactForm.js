import React, {useState} from 'react';
import classes from './ContactForm.module.scss';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/button/Button';
import axios from 'axios';


const ContactForm = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        console.log(e.target.name, e.target.value);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        try {
            const response = await axios.post('https://mohammadsaber.com/server/wp-json/portfolio/v2/send-email/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data.message);
        } catch (error) {
            console.error('Error submitting form:', error.response.data.message);
        }
    };


    return (
        <React.Fragment>
            <h2 className="mb-3 text-uppercase text-center text-md-start text-white">
                {props.title}
            </h2>
            <form
                className={`${classes.contactForm} `}
                id="contact-form"
                onSubmit={handleSubmit}
                method="post"
            >
                <div className="row g-4">
                    <div className="col-xl-6">
                        <Input
                            name="name"
                            type="text"
                            className={`${classes['input']}`}
                            required=""
                            placeholder="Name"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-xl-6">
                        <Input
                            name="email"
                            type="email"
                            className={`${classes['input']}`}
                            required=""
                            placeholder="Email"
                            onChange={handleChange}
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
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <Button
                    id="submit-btn"
                    className="btn rounded-pill mt-4 mb-0 d-inline-flex"
                    onClickHandler={handleSubmit}
                    content={props.buttonTitle}
                />
            </form>
        </React.Fragment>
    );
};

export default ContactForm;

