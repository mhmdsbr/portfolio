<?php

namespace PORTFOLIO\Services;

class SanitizationService {
    /**
     * Sanitize text field
     */
    public function text(string $input): string {
        return sanitize_text_field($input);
    }

    /**
     * Sanitize textarea/content field (allows safe HTML)
     */
    public function html(string $input): string {
        return wp_kses_post($input);
    }

    /**
     * Sanitize URL
     */
    public function url(string $input): string {
        return esc_url_raw($input);
    }

    /**
     * Sanitize email
     */
    public function email(string $input): string {
        return sanitize_email($input);
    }

    /**
     * Sanitize integer
     */
    public function int($input): int {
        return absint($input);
    }

    /**
     * Sanitize HTML class string
     */
    public function htmlClass(string $input): string {
        return sanitize_html_class($input);
    }

    /**
     * Sanitize title
     */
    public function title(string $input): string {
        return sanitize_title($input);
    }

    /**
     * Sanitize text for database
     */
    public function sql(string $input): string {
        return esc_sql($input);
    }

    /**
     * Escape HTML attributes
     */
    public function attr(string $input): string {
        return esc_attr($input);
    }

    /**
     * Escape HTML
     */
    public function escapeHtml(string $input): string {
        return esc_html($input);
    }

    /**
     * Sanitize button array (text and URL)
     */
    public function button(array $input): array {
        return [
            'text' => $this->text($input['text'] ?? ''),
            'url' => $this->url($input['url'] ?? ''),
        ];
    }

    /**
     * Sanitize experience level (0-100)
     */
    public function experienceLevel($input): int {
        $level = $this->int($input);
        return max(0, min(100, $level));
    }

    public function terms(array $terms): array {
        $sanitized = [];

        foreach ($terms as $term) {
            $name = is_object($term) ? $term->name : $term;
            $sanitized[] = $this->text($name);
        }

        return $sanitized;
    }
}