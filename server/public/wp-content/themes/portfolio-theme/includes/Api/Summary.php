<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;
use PORTFOLIO\Services\SanitizationService;
use WP_Error;
use WP_REST_Response;
use WP_HTTP_Response;

class Summary extends ApiHandler {
    private ACFLoaderInterface $acf_loader;
    private SanitizationService $sanitizer;

    private const FIELD_TITLE = 'summary_title';
    private const FIELD_OVERLAY_TITLE = 'summary_overlay_title';
    private const FIELD_BUTTON = 'summary_button';
    private const FIELD_SUMMARY_ITEMS = 'summary_items';
    private const FIELD_EXPERIENCE_ITEMS = 'experiences';

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader,
        SanitizationService $sanitizer
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        $this->sanitizer = $sanitizer;
        
        $this->add_route(
            '/summary-portfolio',
            'GET',
            'get_summary_settings'
        );
    }

    public function get_summary_settings(): WP_Error|WP_REST_Response|WP_HTTP_Response {
        $response = [
            'summary_title' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_TITLE, 'option') ?: ''),
            'summary_title_overlay' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_OVERLAY_TITLE, 'option') ?: ''),
            'summary_button' => $this->sanitizer->button($this->acf_loader->get_field(self::FIELD_BUTTON, 'option') ?: []),
            'summaries' => $this->process_summary_items(
                $this->acf_loader->get_field(self::FIELD_SUMMARY_ITEMS, 'option') ?: []
            ),
            'experiences' => $this->process_experience_items(
                $this->acf_loader->get_field(self::FIELD_EXPERIENCE_ITEMS, 'option') ?: []
            ),
        ];

        return rest_ensure_response($response);
    }

    private function process_summary_items(array $items): array {
        $processed = [];
        
        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }
            
            $processed[] = [
                'from' => $this->sanitizer->text($item['from'] ?? ''),
                'to' => $this->sanitizer->text($item['to'] ?? ''),
                'title' => $this->sanitizer->text($item['title'] ?? ''),
                'company' => $this->sanitizer->text($item['company'] ?? ''),
                'description' => $this->sanitizer->html($item['description'] ?? ''),
            ];
        }

        return $processed;
    }

    private function process_experience_items(array $items): array {
        $processed = [];
        
        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }
            
            $processed[] = [
                'skill' => $this->sanitizer->text($item['skill'] ?? ''),
                'level' => $this->sanitizer->experienceLevel($item['level'] ?? 0),
            ];
        }

        return $processed;
    }
}