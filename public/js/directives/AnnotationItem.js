angular.module( 'madisonApp.directives' )
    .directive( 'annotationItem', [ 'growl', function ( growl ) {
        return {
            restrict    : 'A',
            transclude  : true,
            templateUrl : '/templates/annotation-item.html',
            compile     : function () {
                return {
                    post    : function ( scope, element, attrs ) {
                        var commentLink = element.find( '.comment-link' ).first();
                        var linkPath    = window.location.origin + window.location.pathname + '#' + attrs.activityItemLink;
                        $( commentLink ).attr( 'data-clipboard-text', linkPath );

                        var client      = new ZeroClipboard( commentLink );
                        client.on( 'aftercopy', function ( event ) {
                            scope.$apply( function () {
                                growl.addSuccessMessage( "Link copied to clipboard." );
                            });
                        });

                        var $span       = $( element ).find( '.activity-actions > span.ng-binding' );
                        $span.on( "click", function() {
                            var $feedbackElement    = $( this ).closest( '.activity-item' );
                            var prevBackground      = $feedbackElement.css( 'background' );
                            $feedbackElement.css( "background", "#2276d7" );
                            setTimeout( function() {
                                $feedbackElement.css( "background", prevBackground );
                            }, 500 );
                        });
                    }
                };
            }
        };
    }]);