<?php

namespace PORTFOLIO\Services;

class ACFLoader implements ACFLoaderInterface {
    public function get_field(string $field_name, string $options = 'option') {
        return function_exists('get_field')
            ? get_field($field_name, $options)
            : null;
    }
}