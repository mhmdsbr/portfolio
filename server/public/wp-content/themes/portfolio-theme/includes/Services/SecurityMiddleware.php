<?php

namespace PORTFOLIO\Services;

use WP_Error;
use WP_REST_Request;

class SecurityMiddleware {
    /**
     * Rate limit configuration
     */
    private const RATE_LIMIT = 100; // Requests per hour
    private const RATE_LIMIT_PERIOD = HOUR_IN_SECONDS;

    /**
     * CORS allowed origins
     */
    private static $allowed_origins = [
        'http://localhost:3000',
        'https://mohammadsaber.com',
    ];

    /**
     * Initialize security features
     */
    public static function init(): void {
        // Handle CORS headers
        add_action('rest_api_init', [__CLASS__, 'configure_cors'], 15);

        // Add rate limiting to all requests
        add_filter('rest_pre_dispatch', [__CLASS__, 'check_rate_limit'], 10, 3);
    }

    /**
     * Configure proper CORS headers
     */
    public static function configure_cors(): void {
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        add_filter('rest_pre_serve_request', function($value) {
            $origin = get_http_origin();

            if (self::is_valid_origin()) {
                header("Access-Control-Allow-Origin: $origin");
                header('Access-Control-Allow-Methods: GET, OPTIONS');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Expose-Headers: X-WP-Total, X-WP-TotalPages');
            }

            // Security headers
            header('X-Content-Type-Options: nosniff');
            header('X-Frame-Options: SAMEORIGIN');
            header('X-XSS-Protection: 1; mode=block');

            return $value;
        });
    }

    /**
     * Check rate limiting for API requests
     */
    public static function check_rate_limit($result, $server, $request): mixed {
        // Skip for OPTIONS requests
        if ($request->get_method() === 'OPTIONS') {
            return $result;
        }

        $ip = self::get_client_ip();
        $cache_key = 'api_rate_limit_' . md5($ip . $request->get_route());
        $count = get_transient($cache_key) ?: 0;

        if ($count >= self::RATE_LIMIT) {
            return new WP_Error(
                'rate_limit_exceeded',
                __('Too many requests. Please try again later.', 'portfolio'),
                ['status' => 429]
            );
        }

        set_transient($cache_key, $count + 1, self::RATE_LIMIT_PERIOD);
        return $result;
    }

    /**
     * Get client IP address
     */
    private static function get_client_ip(): string {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    /**
     * Validate request origin
     */
    private static function is_valid_origin(): bool {
        $origin = get_http_origin();
        return in_array($origin, self::$allowed_origins, true);
    }

    /**
     * Basic request validation
     */
    public static function validate_request(WP_REST_Request $request): bool {
        // Check for valid content-type if POST/PUT
        if (in_array($request->get_method(), ['POST', 'PUT'])) {
            $content_type = $request->get_header('content-type');
            if (strpos($content_type, 'application/json') === false) {
                return false;
            }
        }

        return true;
    }

}