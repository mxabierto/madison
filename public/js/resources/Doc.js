angular.module( 'madisonApp.resources' )
    .factory( 'Doc', [ '$resource', function( $resource ) {
        return $resource( "/api/docs/:id", null, {
            query   : {
                method  : 'GET',
                isArray : false
            }
        });
    }]);