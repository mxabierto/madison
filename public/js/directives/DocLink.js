angular.module( 'madisonApp.directives' )
    .directive( 'docLink', [ '$http', '$compile', function ( $http, $compile ) {
        return {
            restrict    : 'AECM',
            link        : function ( scope, elem, attrs ) {
                $http.get( '/api/docs/' + attrs.docId )
                    .success( function ( data ) {
                        var html    = '<a href="/docs/' + data.slug + '">' + data.title + '</a>';
                        var e       = $compile( html )( scope );
                        elem.replaceWith( e );
                    }).error( function ( data ) {
                        console.error( "Unable to retrieve document %o: %o", attrs.docId, data );
                    });
            }
        };
    }]);