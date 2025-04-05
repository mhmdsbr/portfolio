<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;

class About extends ApiHandler {
	private ACFLoaderInterface $acf_loader;


    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        
        $this->add_route(
            '/about-portfolio',
            'GET',
            'get_about_settings'
        );
    }

	public function get_about_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {

		$about_settings = [
			'about_title' => $this->acf_loader->get_field('about_title', 'option'),
            'about_title_secondary' => $this->acf_loader->get_field('about_overlay_title', 'option'),
            'about_job_title' => $this->acf_loader->get_field('about_job_title', 'option'),
            'about_name' => $this->acf_loader->get_field('about_name', 'option'),
            'about_button' => $this->acf_loader->get_field('about_button', 'option'),
            'about_description' => $this->acf_loader->get_field('about_description', 'option'),
            'about_contact' => $this->get_contact_information(),
            'about_details' => $this->get_details_information()
		];


        return rest_ensure_response($about_settings);

	}

	private function get_contact_information(): array {
		$about_contact = $this->acf_loader->get_field('about_contact_information', 'option') ?: [];
		$contact_info = [];
		foreach ($about_contact as $item) {
			$contact_info[] = [
				'title' => $item['title'] ?? '',
				'content' => $item['content'] ?? ''
			];
		}
		return $contact_info;
	}

	private function get_details_information(): array {
        $about_details = $this->acf_loader->get_field('about_details', 'option') ?: [];
        $details_info = [];
        foreach ($about_details as $item) {
            $details_info[] = [
                'title' => $item['title'] ?? '',
                'content' => $item['number'] ?? ''
            ];
        }
        return $details_info;
    }

}
