<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;
use PORTFOLIO\Services\SanitizationService;
use WP_Error;
use WP_REST_Response;
use WP_HTTP_Response;

class Testimonial extends ApiHandler {
    private ACFLoaderInterface $acf_loader;
    private SanitizationService $sanitizer;

    // Constants for field names
    private const FIELD_TITLE = 'testimonial_title';
    private const FIELD_OVERLAY = 'testimonial_overlay_title';
    private const FIELD_ITEMS = 'testimonial_items';

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader,
        SanitizationService $sanitizer
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        $this->sanitizer = $sanitizer;
        
        $this->add_route(
            '/testimonial-portfolio',
            'GET',
            'get_testimonial_settings'
        );
    }

    public function get_testimonial_settings(): WP_Error|WP_REST_Response|WP_HTTP_Response {
        $testimonial_title = $this->sanitizer->text(
            $this->acf_loader->get_field(self::FIELD_TITLE, 'option') ?: ''
        );
        
        $testimonial_title_secondary = $this->sanitizer->text(
            $this->acf_loader->get_field(self::FIELD_OVERLAY, 'option') ?: ''
        );
        
        $testimonial_items = $this->acf_loader->get_field(self::FIELD_ITEMS, 'option') ?: [];
        
        $testimonials = [];
        foreach ($testimonial_items as $item) {
            $testimonials[] = [
                'image' => $this->sanitizer->url($item['image'] ?? ''),
                'title' => $this->sanitizer->text($item['title'] ?? ''),
                'subtitle' => $this->sanitizer->text($item['subtitle'] ?? ''),
                'rating' => $this->sanitizer->int($item['rating'] ?? 0),
                'content' => $this->sanitizer->html($item['content'] ?? ''),
            ];
        }

        return rest_ensure_response([
            'testimonial_title' => $testimonial_title,
            'testimonial_title_overlay' => $testimonial_title_secondary,
            'testimonial' => $testimonials,
        ]);
    }
}