angular.module( 'madisonApp.directives' )
    .directive( 'subcommentLink', [ 'growl', '$anchorScroll', '$timeout', function ( growl, $anchorScroll, $timeout ) {
        return {
            restrict    : 'A',
            template    : '<span class="glyphicon glyphicon-link" title="Copy link to clipboard"></span>',
            compile     : function () {
                return {
                    post    : function ( scope, element, attrs ) {
                        var commentLink = element;
                        var linkPath    = window.location.origin + window.location.pathname + '#subcomment_' + attrs.subCommentId;
                        $( commentLink ).attr( 'data-clipboard-text', linkPath );

                        var client      = new ZeroClipboard( commentLink );
                        client.on( 'aftercopy', function ( event ) {
                            scope.$apply( function () {
                                growl.addSuccessMessage( "Link copied to clipboard." );
                            });
                        });

                        $timeout( function () {
                            $anchorScroll();
                        }, 0 );

                        var $span       = $( element ).closest( '.activity-icon' ).children( 'span.ng-binding' );
                        $span.on( "click", function() {
                            $( element ).closest( '.activity-reply' ).effect( "highlight", {
                                color   : "#2276d7"
                            }, 1000 );
                        });
                    }
                };
            }
        };
    }]);