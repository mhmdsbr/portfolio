<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;

class Contact extends ApiHandler {
    private ACFLoaderInterface $acf_loader;

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        
        $this->add_route(
            '/contact-portfolio',
            'GET',
            'get_contact_settings'
        );
    }

    public function get_contact_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
        return rest_ensure_response([
            'contact_title' => $this->acf_loader->get_field('contact_title', 'option'),
            'contact_title_overlay' => $this->acf_loader->get_field('contact_overlay_title', 'option'),
            'contact_form_title' => $this->acf_loader->get_field('contact_form_title', 'option'),
            'contact_button' => $this->acf_loader->get_field('contact_button', 'option'),
            'contact_info_title' => $this->acf_loader->get_field('contact_info_title', 'option'),
            'contact_info_address' => $this->acf_loader->get_field('contact_info_address', 'option'),
            'contact_info_phone' => $this->acf_loader->get_field('contact_info_phone', 'option'),
            'contact_info_email' => $this->acf_loader->get_field('contact_info_email', 'option')
        ]);
    }
}