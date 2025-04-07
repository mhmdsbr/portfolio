<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;
use PORTFOLIO\Services\SanitizationService;
use WP_Error;
use WP_REST_Response;
use WP_HTTP_Response;

class Services extends ApiHandler {
    private ACFLoaderInterface $acf_loader;
    private SanitizationService $sanitizer;

    private const FIELD_TITLE = 'services_title';
    private const FIELD_OVERLAY_TITLE = 'services_overlay_title';
    private const FIELD_ITEMS = 'service_items';

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader,
        SanitizationService $sanitizer
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        $this->sanitizer = $sanitizer;

        $this->add_route(
            '/services-portfolio',
            'GET',
            'get_services_settings'
        );
    }

    public function get_services_settings(): WP_Error|WP_REST_Response|WP_HTTP_Response {
        $data = $this->get_services_data();

        if (is_wp_error($data)) {
            return $data;
        }

        return rest_ensure_response($data);
    }

    private function get_services_data(): array|WP_Error {
        try {
            return [
                'services_title' => $this->get_sanitized_title(self::FIELD_TITLE),
                'services_title_overlay' => $this->get_sanitized_title(self::FIELD_OVERLAY_TITLE),
                'services' => $this->get_sanitized_service_items(),
            ];
        } catch (\Exception $e) {
            return new WP_Error(
                'service_data_error',
                __('Failed to retrieve service data', 'portfolio'),
                ['status' => 500]
            );
        }
    }

    private function get_sanitized_title(string $field): string {
        return $this->sanitizer->text(
            $this->acf_loader->get_field($field, 'option') ?: ''
        );
    }

    private function get_sanitized_service_items(): array {
        $items = $this->acf_loader->get_field(self::FIELD_ITEMS, 'option') ?: [];

        if (!is_array($items)) {
            return [];
        }

        return array_map(
            fn(array $item): array => [
                'title'   => $this->sanitizer->text($item['title'] ?? ''),
                'content' => $this->sanitizer->html($item['content'] ?? ''),
                'icon'    => $this->sanitizer->text($item['icon'] ?? ''),
            ],
            $items
        );
    }
}