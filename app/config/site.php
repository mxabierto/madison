<?php

if(file_exists(app_path() . '/config/site.yml')) {
  $site_config = yaml_parse_file(app_path() . '/config/site.yml');
} else {
  $site_config = array(
    'baseurl'=> ''
  );
}

return array(

  /*
  |--------------------------------------------------------------------------
  | Base URL
  |--------------------------------------------------------------------------
  |
  | To be set when you need a path prefix for the web site, e.g. serving from
  | foo.bar/blog. Inspired by Jekyll's baseurl configuration.
  | See http://jekyllrb.com/docs/configuration/
  |
  */

  'baseurl' => $site_config['baseurl'],

);
