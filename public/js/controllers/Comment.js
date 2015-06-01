angular.module( 'madisonApp.controllers' )
    .controller( 'CommentController', [ '$scope', '$sce', '$http', 'annotationService', 'createLoginPopup', 'growl', '$location', '$filter', '$timeout', function ( $scope, $sce, $http, annotationService, createLoginPopup, growl, $location, $filter, $timeout ) {
        $scope.comments             = [];
        $scope.supported            = null;
        $scope.opposed              = false;
        $scope.collapsed_comment    = {};

      // Parse comment/subcomment direct links
        var hash            = $location.hash();
        var subCommentId    = hash.match( /(sub)?comment_([0-9]+)$/ );
        if ( subCommentId ) {
            $scope.subCommentId = subCommentId[2];
        }

        $scope.init             = function ( docId, disableAuthor, disableCommentAction ) {
            $scope.getDocComments( docId );
            $scope.user                 = user;
            $scope.doc                  = doc;
            $scope.disableAuthor        = ( typeof disableAuthor !== 'undefined' );
            $scope.disableCommentAction = ( typeof disableCommentAction !== 'undefined' );
            $scope.getLayoutTexts();
        };
        $scope.isSponsor        = function ( userId ) {
            var currentId   = userId || $scope.user.id;
            var sponsored   = false;

            angular.forEach( $scope.doc.sponsor, function ( sponsor ) {
                if ( currentId === sponsor.id ) {
                    sponsored = true;
                }
            });

            return sponsored;
        };
        $scope.notifyAuthor     = function ( activity ) {
            // If the current user is a sponsor and the activity hasn't been seen yet,
            // post to API route depending on comment/annotation label
            $http.post( '/api/docs/' + doc.id + '/' + 'comments/' + activity.id + '/' + 'seen' )
                .success( function ( data ) {
                    activity.seen = data.seen;
                }).error( function ( data ) {
                    console.error( "Unable to mark activity as seen: %o", data );
                });
        };
        $scope.getLayoutTexts   = function() {
            var texts = {
                    common  : {
                        header                      : '',
                        callToAction                : '',
                        commentLabel                : 'Agrega un comentario:',
                        commentPlaceholder          : 'Agregar un comentario',
                        subCommentPlaceholder       : 'Agregar un comentario',
                        commentfeedbackMessage      : '<b>¡Gracias!</b> Acabas de agregar un comentario',
                        subCommentfeedbackMessage   : '<b>¡Gracias!</b> Acabas de agregar un comentario',
                        privateComment              : 'Comentario privado',
                        sendComment                 : 'Enviar'
                    },
                    ieda    : {
                        header                      : 'Categorías de Datos Abiertos propuestos',
                        callToAction                : 'Vota por los conjuntos de datos que te interesan',
                        commentLabel                : 'Sugiere otra categoría:',
                        commentPlaceholder          : 'Sugiere otra categoría',
                        subCommentPlaceholder       : 'Sugiere otro conjunto',
                        commentfeedbackMessage      : '<b>¡Gracias!</b> Acabas de sugerir una categoría',
                        subCommentfeedbackMessage   : '<b>¡Gracias!</b> Acabas de sugerir un conjunto de datos',
                        privateComment              : 'Categoría privada',
                        sendComment                 : 'Enviar'
                    },
                    planAGA : {
                        header                      : 'Temas para el Tercer Plan de Acción de la Alianza para el Gobierno Abierto',
                        callToAction                : 'Vota y comenta los temas que más te interesan.',
                        commentLabel                : 'Sugiere otro tema:',
                        commentPlaceholder          : 'Sugiere otro tema',
                        subCommentPlaceholder       : 'Sugiere otro subtema',
                        commentfeedbackMessage      : '<b>¡Gracias!</b> Acabas de sugerir un tema',
                        subCommentfeedbackMessage   : '<b>¡Gracias!</b> Acabas de sugerir un subtema',
                        privateComment              : 'Tema privado',
                        sendComment                 : 'Enviar'
                    },
                    cofemer : {
                        header                      : '',
                        callToAction                : '',
                        commentLabel                : 'Agrega tu comentario:',
                        commentPlaceholder          : 'Agrega tu comentario',
                        subCommentPlaceholder       : 'Agrega tu comentario',
                        commentfeedbackMessage      : '<b>¡Gracias!</b> Acabas de agregar un comentario',
                        subCommentfeedbackMessage   : '<b>¡Gracias!</b> Acabas de agregar un comentario',
                        privateComment              : 'Comentario privado',
                        sendComment                 : 'Enviar'
                    }
                };

            $scope.layoutTexts  = texts.common;
            angular.forEach( $scope.doc.categories, function ( category ) {
                if ( texts[category.name] !== undefined )
                    $scope.layoutTexts  = texts[category.name];
            });
        };
        $scope.getDocComments   = function ( docId ) {
            // Get all doc comments, regardless of nesting level
            $http({
                method  : 'GET',
                url     : '/api/docs/' + docId + '/comments'
            })
                .success( function ( data ) {
                    // Build child-parent relationships for each comment
                    angular.forEach( data, function ( comment ) {
                        // If this isn't a parent comment, we need to find the parent and push this comment there
                        if ( comment.parent_id !== null ) {
                            var parent  = $scope.parentSearch( data, comment.parent_id );
                            comment.parentpointer   = data[parent];
                            data[parent].comments.push( comment );
                        }

                        // If this is the comment being linked to, save it
                        if ( comment.id == $scope.subCommentId ) {
                            $scope.collapsed_comment = comment;
                        }

                        comment.commentsCollapsed   = true;
                        comment.label               = 'comment';
                        comment.link                = 'comment_' + comment.id;

                        // We only want to push top-level comments, they will include subcomments in their comments array(s)
                        if ( comment.parent_id === null ) {
                            $scope.comments.push( comment );
                        }
                    });

                    // If we are linking directly to a comment, we need to expand comments
                    if ( $scope.subCommentId ) {
                        var not_parent = true;
                        // Expand comments, moving up towards the parent, until all are expanded
                        do {
                            $scope.collapsed_comment.commentsCollapsed  = false;
                            if ( $scope.collapsed_comment.parent_id !== null ) {
                                $scope.collapsed_comment    = $scope.collapsed_comment.parentpointer;
                            } else {
                                // We have reached the first sublevel of comments, so set the top level
                                // parent to expand and exit
                                not_parent  = false;
                            }
                        } while ( not_parent === true );
                    }
                }).error( function ( data ) {
                    console.error( "Error loading comments: %o", data );
                });
        };
        $scope.parentSearch     = function ( arr, val ) {
            for ( var i = 0; i < arr.length; i++ )
                if ( arr[i].id === val )
                    return i;
                return false;
        };
        $scope.commentSubmit    = function () {
            var comment     = angular.copy( $scope.comment );
            comment.user    = $scope.user;
            comment.doc     = $scope.doc;

            $http.post('/api/docs/' + comment.doc.id + '/comments', {
                'comment': comment
            })
                .success( function ( data ) {
                    data[0].label   = 'comment';
                    $scope.comments.push( data[0] );
                    $scope.comment.text = '';

                    feedbackMessage( $scope.layoutTexts.commentfeedbackMessage, 'success', '#participate-comment-message' );
                })
                .error( function ( data ) {
                    console.error( "Error posting comment: %o", data );
                });
        };
        $scope.activityOrder    = function ( activity ) {
            var popularity  = activity.likes - activity.dislikes;

            return popularity;
        };
        $scope.addAction        = function ( activity, action, $event ) {
            if ( $scope.user.id !== '' ) {
                $http.post( '/api/docs/' + $scope.doc.id + '/' + activity.label + 's/' + activity.id + '/' + action )
                    .success( function ( data ) {
                        activity.likes  = data.likes;
                        activity.dislikes   = data.dislikes;
                        activity.flags      = data.flags;
                        activity.deleted_at = data.deleted_at;
                    }).error( function ( data ) {
                        console.error( data );
                    });
            } else {
              createLoginPopup($event);
            }
        };
        $scope.collapseComments = function ( activity ) {
            activity.commentsCollapsed = !activity.commentsCollapsed;
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
                'comment': subcomment
            })
                .success( function ( data ) {
                    data.comments   = [];
                    data.label      = 'comment';
                    activity.comments.push( data );
                    subcomment.text = '';
                    subcomment.user = '';
                    $scope.$apply();

                    feedbackMessage( $scope.layoutTexts.subCommentfeedbackMessage, 'success', '#participate-comment-message' );
            }).error( function ( data ) {
                console.error( data );
            });
        };
    }]);