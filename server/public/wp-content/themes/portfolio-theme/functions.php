<?php

// Register an autoloader function to load classes dynamically
spl_autoload_register( function ( $classname ) {
	$parts = explode( '\\', $classname );
	array_shift( $parts );
	$path      = implode( DIRECTORY_SEPARATOR, $parts );
	$classpath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . $path . '.php';
	if ( file_exists( $classpath ) ) {
		include_once $classpath;
	}
} );

/** Core **/
new PORTFOLIO\Core\Cleaner();
new PORTFOLIO\Core\Enqueues();
new PORTFOLIO\Core\General();
new PORTFOLIO\Core\PostType();

/** Api **/
new PORTFOLIO\Api\ApiHandler("portfolio/v2");
new PORTFOLIO\Api\Config("portfolio/v2");
new PORTFOLIO\Api\GeneralSettings("portfolio/v2");
new PORTFOLIO\Api\NavMenu("portfolio/v2");
new PORTFOLIO\Api\Hero("portfolio/v2");
new PORTFOLIO\Api\About("portfolio/v2");
new PORTFOLIO\Api\Services("portfolio/v2");
new PORTFOLIO\Api\Summary("portfolio/v2");
new PORTFOLIO\Api\Projects("portfolio/v2");
new PORTFOLIO\Api\Testimonial("portfolio/v2");
new PORTFOLIO\Api\Contact("portfolio/v2");
new PORTFOLIO\Api\Mail("portfolio/v2");

/** ThirdParty **/
new PORTFOLIO\ThirdParty\ACF();

