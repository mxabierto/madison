angular.module( 'madisonApp.controllers' )
    .controller( 'AnnotationController', [ '$scope', '$sce', '$http', 'annotationService', 'createLoginPopup', 'growl', '$location', '$filter', '$timeout', function ( $scope, $sce, $http, annotationService, createLoginPopup, growl, $location, $filter, $timeout ) {
        $scope.annotations  = [];
        $scope.supported    = null;
        $scope.opposed      = false;

        //Parse sub-comment hash if there is one
        var hash            = $location.hash();
        var subCommentId    = hash.match( /^annsubcomment_([0-9]+)$/ );
        if ( subCommentId ) {
            $scope.subCommentId = subCommentId[1];
        }

        //Watch for annotationsUpdated broadcast
        $scope.$on('annotationsUpdated', function () {
            angular.forEach( annotationService.annotations, function ( annotation ) {
                if ( $.inArray( annotation, $scope.annotations ) < 0 ) {
                    var collapsed = true;
                    if ( $scope.subCommentId ) {
                        angular.forEach( annotation.comments, function ( subcomment ) {
                            if ( subcomment.id == $scope.subCommentId ) {
                                collapsed = false;
                            }
                        });
                    }

                    annotation.label                = 'annotation';
                    annotation.commentsCollapsed    = collapsed;
                    $scope.annotations.push( annotation );
                }
            });

            $scope.$apply();
        });

        $scope.init             = function ( docId ) {
            $scope.user = user;
            $scope.doc  = doc;
        };
        $scope.isSponsor        = function () {
            var currentId   = $scope.user.id;
            var sponsored   = false;

            angular.forEach( $scope.doc.sponsor, function ( sponsor ) {
                if ( currentId === sponsor.id ) {
                    sponsored = true;
                }
            });

            return sponsored;
        };
        $scope.notifyAuthor     = function ( annotation ) {
            $http.post( '/api/docs/' + doc.id + '/annotations/' + annotation.id + '/' + 'seen' )
                .success(function ( data ) {
                    annotation.seen = data.seen;
                }).error(function ( data ) {
                    console.error( "Unable to mark activity as seen: %o", data );
                });
        };
        $scope.getDocComments   = function ( docId ) {
            $http({
                method  : 'GET',
                url     : '/api/docs/' + docId + '/comments'
            })
            .success( function ( data ) {
                angular.forEach( data, function ( comment ) {
                    var collapsed = false;
                    if ( $scope.subCommentId ) {
                        angular.forEach( comment.comments, function ( subcomment ) {
                            if ( subcomment.id == $scope.subCommentId ) {
                                collapsed = false;
                            }
                        });
                    }

                    comment.commentsCollapsed   = collapsed;
                    comment.label               = 'comment';
                    comment.link                = 'comment_' + comment.id;
                    $scope.annotations.push( comment );
                });
            })
            .error( function ( data ) {
                console.error( "Error loading comments: %o", data );
            });
        };
        $scope.commentSubmit    = function () {
            var comment     = angular.copy( $scope.comment );
            comment.user    = $scope.user;
            comment.doc     = $scope.doc;

            $http.post( '/api/docs/' + comment.doc.id + '/comments', {
                'comment'   : comment
                })
                .success( function () {
                    comment.label       = 'comment';
                    comment.user.fname  = comment.user.name;
                    $scope.stream.push( comment );
                    $scope.comment.text = '';

                    feedbackMessage( '<b>¡Gracias!</b> Acabas de agregar un comentario', 'success', '#participate-activity-message' );
                })
                .error( function ( data ) {
                    console.error( "Error posting comment: %o", data );
                });
        };
        $scope.activityOrder    = function ( activity ) {
            var popularity  = activity.likes - activity.dislikes;

            return popularity;
        };
        $scope.addAction        = function ( activity, action, $event ) {
            if ( $scope.user.id !== '' ) {
                $http.post( '/api/docs/' + $scope.doc.id + '/' + activity.label + 's/' + activity.id + '/' + action )
                    .success( function ( data ) {
                        activity.likes      = data.likes;
                        activity.dislikes   = data.dislikes;
                        activity.flags      = data.flags;
                    }).error( function ( data ) {
                        console.error( data );
                    });
            } else {
              createLoginPopup($event);
            }
        };
        $scope.collapseComments = function ( activity ) {
            activity.commentsCollapsed  = !activity.commentsCollapsed;
        };
        $scope.subcommentSubmit = function ( activity, subcomment ) {
            if ( $scope.user.id === '' ) {
                var focused = document.activeElement;

                if ( document.activeElement == document.body ) {
                    pageY   = $( window ).scrollTop() + 300;
                    clientX = $( window ).width() / 2 - 100;
                } else {
                    pageY   = $( focused ).offset().top;
                    clientX = $( focused ).offset().left;
                }

                createLoginPopup( jQuery.Event( "click", {
                    clientX : clientX,
                    pageY   : pageY 
                }));
                return;
            }

            subcomment.user = $scope.user;

            $.post( '/participa/api/docs/' + $scope.doc.id + '/' + activity.label + 's/' + activity.id + '/comments', {
                    'comment'   : subcomment
                })
                .success( function ( data ) {
                    activity.comments.push( data );
                    subcomment.text = '';
                    subcomment.user = '';
                    $scope.$apply();

                    feedbackMessage( '<b>¡Gracias!</b> Acabas de agregar un comentario', 'success', '#participate-activity-message' );
                }).error( function ( data ) {
                    console.error( data );
                });
        };
    }]);