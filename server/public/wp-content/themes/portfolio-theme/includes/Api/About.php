<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;
use PORTFOLIO\Services\SanitizationService;
use WP_Error;
use WP_REST_Response;
use WP_HTTP_Response;

class About extends ApiHandler {
    private ACFLoaderInterface $acf_loader;
    private SanitizationService $sanitizer;

    private const FIELD_TITLE = 'about_title';
    private const FIELD_OVERLAY = 'about_overlay_title';
    private const FIELD_JOB_TITLE = 'about_job_title';
    private const FIELD_NAME = 'about_name';
    private const FIELD_BUTTON = 'about_button';
    private const FIELD_DESCRIPTION = 'about_description';
    private const FIELD_CONTACT = 'about_contact_information';
    private const FIELD_DETAILS = 'about_details';

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader,
        SanitizationService $sanitizer
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        $this->sanitizer = $sanitizer;

        $this->add_route(
            '/about-portfolio',
            'GET',
            'get_about_settings'
        );
    }

    public function get_about_settings(): WP_Error|WP_REST_Response|WP_HTTP_Response {
        $about_settings = [
            'about_title' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_TITLE, 'option') ?: ''),
            'about_title_secondary' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_OVERLAY, 'option') ?: ''),
            'about_job_title' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_JOB_TITLE, 'option') ?: ''),
            'about_name' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_NAME, 'option') ?: ''),
            'about_button' => $this->sanitizer->button($this->acf_loader->get_field(self::FIELD_BUTTON, 'option') ?: []),
            'about_description' => $this->sanitizer->html($this->acf_loader->get_field(self::FIELD_DESCRIPTION, 'option') ?: ''),
            'about_contact' => $this->get_contact_information(),
            'about_details' => $this->get_details_information()
        ];

        return rest_ensure_response($about_settings);
    }

    private function get_contact_information(): array {
        $about_contact = $this->acf_loader->get_field(self::FIELD_CONTACT, 'option') ?: [];
        $contact_info = [];

        foreach ($about_contact as $item) {
            $contact_info[] = [
                'title' => $this->sanitizer->text($item['title'] ?? ''),
                'content' => $this->sanitizer->text($item['content'] ?? '')
            ];
        }

        return $contact_info;
    }

    private function get_details_information(): array {
        $about_details = $this->acf_loader->get_field(self::FIELD_DETAILS, 'option') ?: [];
        $details_info = [];

        foreach ($about_details as $item) {
            $details_info[] = [
                'title' => $this->sanitizer->text($item['title'] ?? ''),
                'content' => $this->sanitizer->text($item['number'] ?? '')
            ];
        }

        return $details_info;
    }

}