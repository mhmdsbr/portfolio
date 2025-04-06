<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;
use PORTFOLIO\Services\SanitizationService;
use WP_Error;
use WP_REST_Response;
use WP_HTTP_Response;

class Contact extends ApiHandler {
    private ACFLoaderInterface $acf_loader;
    private SanitizationService $sanitizer;

    // Field name constants
    private const FIELD_TITLE = 'contact_title';
    private const FIELD_OVERLAY = 'contact_overlay_title';
    private const FIELD_FORM_TITLE = 'contact_form_title';
    private const FIELD_BUTTON = 'contact_button';
    private const FIELD_INFO_TITLE = 'contact_info_title';
    private const FIELD_ADDRESS = 'contact_info_address';
    private const FIELD_PHONE = 'contact_info_phone';
    private const FIELD_EMAIL = 'contact_info_email';

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader,
        SanitizationService $sanitizer
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        $this->sanitizer = $sanitizer;
        
        $this->add_route(
            '/contact-portfolio',
            'GET',
            'get_contact_settings'
        );
    }

    public function get_contact_settings(): WP_Error|WP_REST_Response|WP_HTTP_Response {
        return rest_ensure_response([
            'contact_title' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_TITLE, 'option') ?: ''),
            'contact_title_overlay' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_OVERLAY, 'option') ?: ''),
            'contact_form_title' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_FORM_TITLE, 'option') ?: ''),
            'contact_button' => $this->acf_loader->get_field(self::FIELD_BUTTON, 'option') ?: [],
            'contact_info_title' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_INFO_TITLE, 'option') ?: ''),
            'contact_info_address' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_ADDRESS, 'option') ?: ''),
            'contact_info_phone' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_PHONE, 'option') ?: ''),
            'contact_info_email' => $this->sanitizer->email($this->acf_loader->get_field(self::FIELD_EMAIL, 'option') ?: '')
        ]);
    }

}