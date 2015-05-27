#Installation

For Mac OSX installation instructions, see [Install OSX](INSTALL.OSX.md)

**Dependencies:**

* PHP ( >= 5.4 )
  * mcrypt
* MySQL
* Laravel ( MVC PHP Framework )
* AngularJS ( MVC JS Framework )
* Grunt ( JS Task Runner )
  * Gruntfile.js
* Composer ( PHP Dependency Manager )
  * composer.json
* NPM ( Node Dependency Manager )
	* package.json
* Bower ( Front-end Dependency Manager )
	* bower.json

___

1. Install composer. See https://getcomposer.org/


1. Run `composer self-update` and `composer install` to install all composer packages

1. Copy `.env.example` to `.env.local` and add your mysql credentials
 
1. Run `php artisan migrate` and `php artisan db:seed` from the root directory to set up the database.