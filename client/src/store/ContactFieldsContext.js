import React, {createContext, useState, useEffect, useCallback} from 'react';
import axios from "axios";

const ContactFieldsContext = createContext();

const ContactFieldsProvider = ({ children }) => {
    const [contactFields, setContactFields] = useState(null);

    const fetchContactFields = useCallback(async () => {
        try {
            const res = await axios.get('http://portfolio.test/wp-json/portfolio/v2/contact-portfolio');
            const { data } = res;
            setContactFields(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchContactFields().then(r => {});
    }, [fetchContactFields]);

    if (contactFields === null) {
        return null;
    }

    let content = {
        title: contactFields.contact_title,
        title_overlay: contactFields.contact_title_overlay,
        contact_form_title: contactFields.contact_form_title,
        contact_button: contactFields.contact_button,
        contact_info_title: contactFields.contact_info_title,
        contact_info_address: contactFields.contact_info_address,
        contact_info_phone: contactFields.contact_info_phone,
        contact_info_email: contactFields.contact_info_email
    };

    return (
        <ContactFieldsContext.Provider value={content}>
            {children}
        </ContactFieldsContext.Provider>
    );
};

export { ContactFieldsProvider, ContactFieldsContext };
