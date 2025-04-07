<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;
use PORTFOLIO\Services\SanitizationService;
use WP_REST_Request;
use WP_REST_Response;

class Mail extends ApiHandler {
    private ACFLoaderInterface $acf_loader;
    private SanitizationService $sanitizer;

    private const SMTP_HOST = 'smtp_host';
    private const SMTP_PORT = 'smtp_port';
    private const SMTP_USERNAME = 'smtp_username';
    private const SMTP_PASSWORD = 'smtp_password';

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader,
        SanitizationService $sanitizer
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        $this->sanitizer = $sanitizer;

        $this->add_route(
            '/send-email',
            'POST',
            'send_custom_email'
        );

        add_action('phpmailer_init', [$this, 'setupSmtp']);
    }

    public function send_custom_email(WP_REST_Request $request): WP_REST_Response {
        $data = $request->get_json_params();

        // Validate required fields
        if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'Name, email, and message are required.'
            ], 400);
        }

        // Sanitize input
        $name = $this->sanitizer->text($data['name']);
        $email = $this->sanitizer->email($data['email']);
        $message = $this->sanitizer->html($data['message']);

        // Prepare email
        $to = 'saaber.mohamad@gmail.com';
        $subject = 'Portfolio Contact form Message';
        $body = "Name: $name<br>Email: $email<br>Message: $message";
        $headers = ['Content-Type: text/html; charset=UTF-8'];

        // Send email
        $result = wp_mail($to, $subject, $body, $headers);

        return new WP_REST_Response([
            'success' => $result,
            'message' => $result
                ? 'Email sent successfully!'
                : 'Failed to send email. Please try again later'
        ], $result ? 200 : 500);
    }

    public function setupSmtp($phpmailer): void {
        $credentials = [
            'host' => $this->acf_loader->get_field(self::SMTP_HOST, 'option'),
            'port' => $this->acf_loader->get_field(self::SMTP_PORT, 'option'),
            'username' => $this->acf_loader->get_field(self::SMTP_USERNAME, 'option'),
            'password' => $this->acf_loader->get_field(self::SMTP_PASSWORD, 'option'),
        ];

        if (!empty($credentials['host'])) {
            $phpmailer->isSMTP();
            $phpmailer->Host = $this->sanitizer->text($credentials['host']);
            $phpmailer->Port = $this->sanitizer->int($credentials['port']);
            $phpmailer->SMTPAuth = true;
            $phpmailer->Username = $this->sanitizer->text($credentials['username']);
            $phpmailer->Password = $this->sanitizer->text($credentials['password']);
            $phpmailer->SMTPSecure = 'ssl';
        }
    }
}