##Installation on OSX

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

1. Make sure your virtual environment is up and running, this can be a Homestead or Vagrant instance or a LAMP installation (Apache, MySQL, PHP).

1. Install Xcode + CLI tools, if not already done.

1. Install homebrew. Although this is optional, it will make things faster and easier.

1. Install composer. See https://getcomposer.org/, or through homebrew.

1. Install node and npm. http://nodejs.org/, or through homebrew.

1. Install bower (easiest through npm). Yes, that's 3 package managers we've installed.

1. Run npm install so that it can grab the packages in packages.json.
 
1. Run `composer self-update` and `composer install` to install all composer packages

1. Run `npm install`

1. Run `bower install`

1. Install compass. If you do not have any ruby gems installed, you can get away with sudo gem update --system and sudo gem install compass, installing the compass gem on top of Mac OSX's ruby. In general, you will want to use something like RVM to manage a separate version of ruby which does not interfere with OSX.

1. Set up the vhost and database

1. Copy `.env.example` to `.env.local` and add your mysql credentials

1. Run `php artisan migrate` and `php artisan db:seed` from the root directory to set up the database.

1. Finally, install and run elasticsearch. See here for installation - https://gist.github.com/rajraj/1556657

When editing any .js files, make sure to run grunt so that it can watch for and re-minify (among other things) the main build/app.js and build/app.map files.

