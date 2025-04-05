<?php

namespace PORTFOLIO\Services;

interface ACFLoaderInterface {
    public function get_field(string $field_name, string $options = 'option');
}