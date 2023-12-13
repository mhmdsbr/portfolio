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
new PORTFOLIO\Api\GeneralSettingsApi("portfolio/v2");
new PORTFOLIO\Api\NavMenuApi("portfolio/v2");
new PORTFOLIO\Api\HeroApi("portfolio/v2");
new PORTFOLIO\Api\AboutApi("portfolio/v2");
new PORTFOLIO\Api\ServicesApi("portfolio/v2");
new PORTFOLIO\Api\SummaryApi("portfolio/v2");
new PORTFOLIO\Api\ProjectsApi("portfolio/v2");
new PORTFOLIO\Api\TestimonialApi("portfolio/v2");
new PORTFOLIO\Api\ContactApi("portfolio/v2");
new PORTFOLIO\Api\MailApi("portfolio/v2");
/** ThirdParty **/
new PORTFOLIO\ThirdParty\ACF();

