/*global window*/
window.jQuery = window.$;

var imports = [
    'madisonApp.filters',
    'madisonApp.services',
    'madisonApp.resources',
    'madisonApp.directives',
    'madisonApp.controllers',
    'madisonApp.dashboardControllers',
    'ui',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'angular-growl',
    'ngResource',
    'angular-tour',
    'ngRoute',
    'ipCookie',
    'pascalprecht.translate'
  ];

var app = angular.module('madisonApp', imports);

// Add a prefix to all http calls
app.config(function ($httpProvider) {
  $httpProvider.interceptors.push(function ($q) {
    return {
      request: function (request) {
        // Except for filepaths
        if (request.url.indexOf("templates/") < 0 &&
            request.url.indexOf("tour/") < 0) {
          request.url = "/participa/" + request.url;
          request.url = request.url.replace(/\/\//g, "/");
        } else {
          request.url = "/participa-assets/" + request.url;
          request.url = request.url.replace(/\/\//g, "/");
        }
        return request || $q.when(request);
      }
    };
  });
});

app.config(['growlProvider', '$httpProvider', '$routeProvider', function (growlProvider, $httpProvider, $routeProvider) {
    //Set up growl notifications
  growlProvider.messagesKey("messages");
  growlProvider.messageTextKey("text");
  growlProvider.messageSeverityKey("severity");
  $httpProvider.responseInterceptors.push(growlProvider.serverMessagesInterceptor);
  growlProvider.onlyUniqueMessages(true);
  growlProvider.globalTimeToLive(5000);

  $routeProvider
    .when('/user/edit/:user/notifications', {
      templateUrl: "/templates/pages/user-notification-settings.html",
      controller: "UserNotificationsController",
      title: "Notification Settings"
    });
}]);

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
    'POSTED': 'Posted',
    'UPDATED': 'Updated'
  });

  $translateProvider.translations('es', {
    'POSTED': 'Publicación',
    'UPDATED': 'Última actualización'
  });

  $translateProvider.preferredLanguage('es');
}]);

window.console = window.console || {};
window.console.log = window.console.log || function () {};
