angular.module( 'madisonApp.controllers' )
    .controller( 'AppController', [ '$rootScope', '$scope', 'ipCookie', 'UserService', function ( $rootScope, $scope, ipCookie, UserService ) {
        //Update page title
        $rootScope.$on('$routeChangeSuccess', function ( event, current, previous ) {
            $rootScope.pageTitle = current.$$route.title;
        });
        //Watch for user data change
        $scope.$on('userUpdated', function () {
            $scope.user = UserService.user;
        });

        //Load user data
        UserService.getUser();

        //Set up Angular Tour
        $scope.step_messages = {
            step_0: '¡Bienvenido! Participa de manera dinámica y abierta en la mejora de políticas públicas de nuestro país.',
            step_1: 'Comienza aquí:  elige un documento.  Puedes navegar o filtrar por título, categoría, autor o estatus. ¡Elige uno que te interese!',
            step_2: '¡Adéntrate en gob.mx/participa! Explora el documento o utiliza la tabla de contenido para encontrar lo que te interesa.',
            step_3: 'Comparte ideas, comentarios o preguntas con el autor y otros usuarios en la pestaña de Foro.',
            step_4: 'Sugiere cambios específicos al texto. Sólo selecciona un fragmento del documento y agrega tus sugerencias.'
        };

        $scope.currentStep = ipCookie( 'myTour' ) || 0;

        $scope.stepComplete = function () {
            ipCookie('myTour', $scope.currentStep, {path: '/', expires: 10*365});
        };
        $scope.tourComplete = function () {
            ipCookie('myTour', 99, {path: '/', expires: 10*365});
        };
    }]);