/*global user*/
/*global doc*/

var presentePlural = function(howMany) { return howMany == 1 ? '' : 'n'; };
var howManySupport = function(howMany, doesSupport) {
  var verb = doesSupport ? ' apoya' : ' se opone';
  return howMany + verb + presentePlural(howMany);
};

angular.module('madisonApp.controllers', [])
  /**
  * Global controller, attached to the <body> tag
  *
  * Handles global scope variables
  */
  .controller('AppController', ['$rootScope', '$scope', 'ipCookie', 'UserService',
    function ($rootScope, $scope, ipCookie, UserService) {
      //Update page title
      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
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

      $scope.currentStep = ipCookie('myTour') || 0;

      $scope.stepComplete = function () {
        ipCookie('myTour', $scope.currentStep, {path: '/', expires: 10*365});
      };

      $scope.tourComplete = function () {
        ipCookie('myTour', 99, {path: '/', expires: 10*365});
      };

    }])
  .controller('UserNotificationsController', ['$scope', '$http', 'UserService', function ($scope, $http, UserService) {

    //Wait for AppController controller to load user
    UserService.exists.then(function () {
      $http.get('/api/user/' + $scope.user.id + '/notifications')
        .success(function (data) {
          $scope.notifications = data;
        }).error(function (data) {
          console.error("Error loading notifications: %o", data);
        });
    });

    //Watch for notification changes
    $scope.$watch('notifications', function (newValue, oldValue) {
      if (oldValue !== undefined) {
        //Save notifications
        $http.put('/api/user/' + $scope.user.id + '/notifications', {notifications: newValue})
          .success(function (data) {
            //Do nothing?
          }).error(function (data) {
            console.error("Error updating notification settings: %o", data);
          });
      }
    }, true);

  }])
  .controller('HomePageController', ['$scope', '$location', '$http', '$filter', '$cookies', 'Doc',
    function ($scope, $location, $http, $filter, $cookies, Doc) {
      var refEl     = $( '.main-banner' ),
          search    = $location.search(),
          page      = ( search.page ) ? search.page : 1,
          limit     = ( search.limit ) ? search.limit : 20,
          docSearch = ( search.q ) ? search.q : '',
          query     = function () {
            $scope.docs       = Array();
            $scope.updating   = true;
            Doc.query({
              q         : docSearch,
              page      : page,
              per_page  : limit
            }, function (data) {
              $scope.totalDocs  = data.pagination.count;
              $scope.perPage    = data.pagination.per_page;
              $scope.page       = data.pagination.page;
              $scope.updating   = false;
              $scope.parseDocs(data.results);
            }).$promise.catch(function (data) {
              console.error("Unable to get documents: %o", data);
            });
          };

      $scope.docs = [];
      $scope.categories = [];
      $scope.sponsors = [];
      $scope.statuses = [];
      $scope.dates = [];
      $scope.dateSort = '';
      $scope.select2 = '';
      $scope.docSearch = '';
      $scope.docSort = "created_at";
      $scope.reverse = true;
      $scope.startStep = 0;
      $scope.updating = false;
      $scope.docSearch = docSearch;

      $scope.select2Config = {
        multiple: true,
        allowClear: true,
        placeholder: "Categoría, autor o estatus"
      };

      $scope.dateSortConfig = {
        allowClear: true,
        placeholder: "Fecha"
      };

      $scope.paginate = function () {
        if ( $scope.page > 1 ) {
          $location.search( "page", $scope.page );
        } else {
          $location.search( "page", null );
        }

        page    = $scope.page;

        // Scroll to the top of the list
        $( 'html, body' ).animate({
          scrollTop : refEl.offset().top + refEl.height()
        }, 500 );

        query();
      };

      $scope.search = function () {
        if ( $scope.docSearch ) {
          $location.search( "q", $scope.docSearch );
        } else {
          $location.search( "q", null );
        }

        docSearch = $scope.docSearch;
        query();
      };

      $scope.parseDocs = function (docs) {
        angular.forEach(docs, function (doc) {
          $scope.docs.unshift(doc);

          $scope.parseDocMeta(doc.categories, 'categories');
          $scope.parseDocMeta(doc.sponsor, 'sponsors');
          $scope.parseDocMeta(doc.statuses, 'statuses');

          angular.forEach(doc.dates, function (date) {
            date.date = Date.parse(date.date);
          });
        });
      };

      $scope.parseDocMeta = function (collection, name) {
        if (collection.length === 0) {
          return;
        }

        angular.forEach(collection, function (item) {
          var found = $filter('getById')($scope[name], item.id);

          if (found === null) {
            switch (name) {
            case 'categories':
              $scope.categories.push(item);
              break;
            case 'sponsors':
              $scope.sponsors.push(item);
              break;
            case 'statuses':
              $scope.statuses.push(item);
              break;
            default:
              console.error('Unknown meta name: ' + name);
            }
          }
        });
      };

      $scope.docFilter = function (doc) {

        var show = false;

        if ($scope.select2 !== undefined && $scope.select2 !== '') {
          var cont = true;

          var select2 = $scope.select2.split('_');
          var type = select2[0];
          var value = parseInt(select2[1], 10);

          switch (type) {
          case 'category':
            angular.forEach(doc.categories, function (category) {
              if (+category.id === value && cont) {
                show = true;
                cont = false;
              }
            });
            break;
          case 'sponsor':
            angular.forEach(doc.sponsor, function (sponsor) {
              if (+sponsor.id === value && cont) {
                show = true;
                cont = false;
              }
            });
            break;
          case 'status':
            angular.forEach(doc.statuses, function (status) {
              if (+status.id === value && cont) {
                show = true;
                cont = false;
              }
            });
            break;
          }
        } else {
          show = true;
        }

        return show;
      };

      query();
    }
    ])
  .controller('DocumentPageController', ['$scope', '$cookies', '$location', 'Doc', '$sce',
    function ($scope, $cookies, $location, Doc, $sce) {
      $scope.hideIntro = $cookies.hideIntro;

      // Check which tab needs to be active - if the location hash
      // is #annsubcomment or there is no hash, the annotation/bill tab needs to be active
      // Otherwise, the hash is #subcomment/#comment and the discussion tab should be active
      var annotationHash = $location.hash().match(/^annsubcomment_([0-9]+)$/);
      $scope.secondtab = false;
      if (!annotationHash && ($location.hash())) {
        $scope.secondtab = true;
      }

      $scope.hideHowToAnnotate = function () {
        $cookies.hideIntro = true;
        $scope.hideIntro = true;
      };

      $scope.doc = Doc.get({id: doc.id}, function () {

        //If intro text exists, convert & trust the markdown content
        if(undefined !== $scope.doc.introtext[0]){
          var converter = new Markdown.Converter();

          $scope.introtext = $sce.trustAsHtml(converter.makeHtml($scope.doc.introtext[0].meta_value));
        }
      });
    }
    ])
  .controller('ReaderController', ['$scope', '$http', 'annotationService', 'createLoginPopup', '$timeout', '$anchorScroll',
    function ($scope, $http, annotationService, createLoginPopup, $timeout, $anchorScroll) {
      $scope.annotations = [];

      $scope.$on('annotationsUpdated', function () {
        $scope.annotations = annotationService.annotations;
        $scope.$apply();

        $timeout(function () {
          $anchorScroll();
        }, 0);
      });

      $scope.init = function () {
        $scope.user = user;
        $scope.doc = doc;
        $scope.setSponsor();
        $scope.getSupported();

        // Dates do not arrive in proper ISO 8601 format, e.g. 2015-01-14 03:27:04
        // But by adding the T we get timezone +00:00, same as in the HomeController
        // Then we parse it to get "seconds since epoch" which is needed by the date filter
        $scope.doc.created_at = Date.parse($scope.doc.created_at.replace(' ', 'T'));
        $scope.doc.updated_at = Date.parse($scope.doc.updated_at.replace(' ', 'T'));
      };

      $scope.setSponsor = function () {
        try{
          if ($scope.doc.group_sponsor.length !== 0) {
            $scope.doc.sponsor = $scope.doc.group_sponsor;
          } else {
            $scope.doc.sponsor = $scope.doc.user_sponsor;
            $scope.doc.sponsor[0].display_name = $scope.doc.sponsor[0].fname + ' ' + $scope.doc.sponsor[0].lname;
          }
        } catch (err) {
          console.error(err);
        }
      };

      $scope.getSupported = function () {
        if ($scope.user.id !== '') {
          $http.get('/api/users/' + $scope.user.id + '/support/' + $scope.doc.id)
            .success(function (data) {
              switch (data.support) {
              case "1":
                $scope.supported = true;
                break;
              case "":
                $scope.opposed = true;
                break;
              default:
                $scope.supported = null;
                $scope.opposed = null;
              }

              if ($scope.supported !== null && $scope.opposed !== null) {
                $('#doc-support').text(howManySupport(data.supports, true));
                $('#doc-oppose').text(howManySupport(data.opposes, false));
              }
            }).error(function () {
              console.error("Unable to get support info for user %o and doc %o", $scope.user, $scope.doc);
            });
        }
      };

      $scope.support = function (supported, $event) {

        if ($scope.user.id === '') {
          createLoginPopup($event);
        } else {
          $http.post('/api/docs/' + $scope.doc.id + '/support', {
            'support': supported
          })
            .success(function (data) {
              //Parse data to see what user's action is currently
              if (data.support === null) {
                $scope.supported = false;
                $scope.opposed = false;
              } else {
                $scope.supported = data.support;
                $scope.opposed = !data.support;
              }

              var button = $($event.target);
              var otherButton = $($event.target).siblings('a.btn');

              if (button.hasClass('doc-support')) {
                button.text(howManySupport(data.supports, true));
                otherButton.text(howManySupport(data.opposes, false));
              } else {
                button.text(howManySupport(data.opposes, false));
                otherButton.text(howManySupport(data.supports, true));
              }

            })
            .error(function (data) {
              console.error("Error posting support: %o", data);
            });
        }
      };
    }])
  .controller('AnnotationController', ['$scope', '$sce', '$http', 'annotationService', 'createLoginPopup', 'growl', '$location', '$filter', '$timeout',
    function ($scope, $sce, $http, annotationService, createLoginPopup, growl, $location, $filter, $timeout) {
      $scope.annotations = [];
      $scope.supported = null;
      $scope.opposed = false;

      //Parse sub-comment hash if there is one
      var hash = $location.hash();
      var subCommentId = hash.match(/^annsubcomment_([0-9]+)$/);
      if (subCommentId) {
        $scope.subCommentId = subCommentId[1];
      }

      $scope.init = function (docId) {
        $scope.user = user;
        $scope.doc = doc;
      };

      //Watch for annotationsUpdated broadcast
      $scope.$on('annotationsUpdated', function () {
        angular.forEach(annotationService.annotations, function (annotation) {
          if ($.inArray(annotation, $scope.annotations) < 0) {
            var collapsed = true;
            if ($scope.subCommentId) {
              angular.forEach(annotation.comments, function (subcomment) {
                if (subcomment.id == $scope.subCommentId) {
                  collapsed = false;
                }
              });
            }

            annotation.label = 'annotation';
            annotation.commentsCollapsed = collapsed;
            $scope.annotations.push(annotation);
          }
        });

        $scope.$apply();
      });

      $scope.isSponsor = function () {
        var currentId = $scope.user.id;
        var sponsored = false;

        angular.forEach($scope.doc.sponsor, function (sponsor) {
          if (currentId === sponsor.id) {
            sponsored = true;
          }
        });

        return sponsored;
      };

      $scope.notifyAuthor = function (annotation) {

        $http.post('/api/docs/' + doc.id + '/annotations/' + annotation.id + '/' + 'seen')
          .success(function (data) {
            annotation.seen = data.seen;
          }).error(function (data) {
            console.error("Unable to mark activity as seen: %o", data);
          });
      };


      $scope.getDocComments = function (docId) {
        $http({
          method: 'GET',
          url: '/api/docs/' + docId + '/comments'
        })
          .success(function (data) {
            angular.forEach(data, function (comment) {
              var collapsed = false;
              if ($scope.subCommentId) {
                angular.forEach(comment.comments, function (subcomment) {
                  if (subcomment.id == $scope.subCommentId) {
                    collapsed = false;
                  }
                });
              }
              comment.commentsCollapsed = collapsed;
              comment.label = 'comment';
              comment.link = 'comment_' + comment.id;
              $scope.annotations.push(comment);
            });
          })
          .error(function (data) {
            console.error("Error loading comments: %o", data);
          });
      };

      $scope.commentSubmit = function () {

        var comment = angular.copy($scope.comment);
        comment.user = $scope.user;
        comment.doc = $scope.doc;

        $http.post('/api/docs/' + comment.doc.id + '/comments', {
          'comment': comment
        })
          .success(function () {
            comment.label = 'comment';
            comment.user.fname = comment.user.name;
            $scope.stream.push(comment);
            $scope.comment.text = '';

            feedbackMessage('<b>¡Gracias!</b> Acabas de agregar un comentario', 'success', '#participate-activity-message');
          })
          .error(function (data) {
            console.error("Error posting comment: %o", data);
          });
      };

      $scope.activityOrder = function (activity) {
        var popularity = activity.likes - activity.dislikes;

        return popularity;
      };

      $scope.addAction = function (activity, action, $event) {
        if ($scope.user.id !== '') {
          $http.post('/api/docs/' + $scope.doc.id + '/' + activity.label + 's/' + activity.id + '/' + action)
            .success(function (data) {
              activity.likes = data.likes;
              activity.dislikes = data.dislikes;
              activity.flags = data.flags;
            }).error(function (data) {
              console.error(data);
            });
        } else {
          createLoginPopup($event);
        }

      };

      $scope.collapseComments = function (activity) {
        activity.commentsCollapsed = !activity.commentsCollapsed;
      };

      $scope.subcommentSubmit = function (activity, subcomment) {

        if ($scope.user.id === '') {
          var focused = document.activeElement;

          if (document.activeElement == document.body) {
            pageY = $(window).scrollTop() + 300;
            clientX = $(window).width() / 2 - 100;
          }else{
            pageY = $(focused).offset().top;
            clientX = $(focused).offset().left;
          }

          createLoginPopup(jQuery.Event( "click", { clientX: clientX, pageY: pageY } ));
          return;
        }

        subcomment.user = $scope.user;

        $.post('/participa/api/docs/' + $scope.doc.id + '/' + activity.label + 's/' + activity.id + '/comments', {
          'comment': subcomment
        })
          .success(function (data) {
            activity.comments.push(data);
            subcomment.text = '';
            subcomment.user = '';
            $scope.$apply();

            feedbackMessage('<b>¡Gracias!</b> Acabas de agregar un comentario', 'success', '#participate-activity-message');
          }).error(function (data) {
            console.error(data);
          });
      };
    }
    ])
  .controller('CommentController', ['$scope', '$sce', '$http', 'annotationService', 'createLoginPopup', 'growl', '$location', '$filter', '$timeout',
    function ($scope, $sce, $http, annotationService, createLoginPopup, growl, $location, $filter, $timeout) {
      $scope.comments = [];
      $scope.supported = null;
      $scope.opposed = false;
      $scope.collapsed_comment = {};

      // Parse comment/subcomment direct links
      var hash = $location.hash();
      var subCommentId = hash.match(/(sub)?comment_([0-9]+)$/);
      if (subCommentId) {
        $scope.subCommentId = subCommentId[2];
      }

      $scope.init = function (docId, disableAuthor, disableCommentAction) {
        $scope.getDocComments(docId);
        $scope.user = user;
        $scope.doc = doc;
        $scope.disableAuthor = (typeof disableAuthor !== 'undefined');
        $scope.disableCommentAction = (typeof disableCommentAction !== 'undefined');
        $scope.getLayoutTexts();
      };

      $scope.isSponsor = function (userId) {
        var currentId = userId || $scope.user.id;
        var sponsored = false;

        angular.forEach($scope.doc.sponsor, function (sponsor) {
          if (currentId === sponsor.id) {
            sponsored = true;
          }
        });

        return sponsored;
      };

      $scope.notifyAuthor = function (activity) {

        // If the current user is a sponsor and the activity hasn't been seen yet,
        // post to API route depending on comment/annotation label
        $http.post('/api/docs/' + doc.id + '/' + 'comments/' + activity.id + '/' + 'seen')
          .success(function (data) {
            activity.seen = data.seen;
          }).error(function (data) {
            console.error("Unable to mark activity as seen: %o", data);
          });
      };

      $scope.getLayoutTexts = function() {
        var texts = {
          common: {
            header: '',
            callToAction: '',
            commentLabel: 'Agrega un comentario:',
            commentPlaceholder: 'Agregar un comentario',
            subCommentPlaceholder: 'Agregar un comentario',
            commentfeedbackMessage: '<b>¡Gracias!</b> Acabas de agregar un comentario',
            subCommentfeedbackMessage: '<b>¡Gracias!</b> Acabas de agregar un comentario',
            privateComment: 'Comentario privado',
            sendComment: 'Enviar'
          },
          ieda: {
            header: 'Categorías de Datos Abiertos propuestos',
            callToAction: 'Vota por los conjuntos de datos que te interesan',
            commentLabel: 'Sugiere otra categoría:',
            commentPlaceholder: 'Sugiere otra categoría',
            subCommentPlaceholder: 'Sugiere otro conjunto',
            commentfeedbackMessage: '<b>¡Gracias!</b> Acabas de sugerir una categoría',
            subCommentfeedbackMessage: '<b>¡Gracias!</b> Acabas de sugerir un conjunto de datos',
            privateComment: 'Categoría privada',
            sendComment: 'Enviar'
          },
          planAGA: {
            header: 'Temas para el Tercer Plan de Acción de la Alianza para el Gobierno Abierto',
            callToAction: 'Vota y comenta los temas que más te interesan.',
            commentLabel: 'Sugiere otro tema:',
            commentPlaceholder: 'Sugiere otro tema',
            subCommentPlaceholder: 'Sugiere otro subtema',
            commentfeedbackMessage: '<b>¡Gracias!</b> Acabas de sugerir un tema',
            subCommentfeedbackMessage: '<b>¡Gracias!</b> Acabas de sugerir un subtema',
            privateComment: 'Tema privado',
            sendComment: 'Enviar'
          },
          cofemer: {
            header: '',
            callToAction: '',
            commentLabel: 'Agrega tu comentario:',
            commentPlaceholder: 'Agrega tu comentario',
            subCommentPlaceholder: 'Agrega tu comentario',
            commentfeedbackMessage: '<b>¡Gracias!</b> Acabas de agregar un comentario',
            subCommentfeedbackMessage: '<b>¡Gracias!</b> Acabas de agregar un comentario',
            privateComment: 'Comentario privado',
            sendComment: 'Enviar'
          },
        };
        $scope.layoutTexts = texts.common;
        angular.forEach($scope.doc.categories, function (category) {
          if (texts[category.name] !== undefined)
            $scope.layoutTexts = texts[category.name];
        });
      };

      $scope.getDocComments = function (docId) {

        // Get all doc comments, regardless of nesting level
        $http({
          method: 'GET',
          url: '/api/docs/' + docId + '/comments'
        })
          .success(function (data) {

            // Build child-parent relationships for each comment
            angular.forEach(data, function (comment) {

              // If this isn't a parent comment, we need to find the parent and push this comment there
              if (comment.parent_id !== null) {
                var parent = $scope.parentSearch(data, comment.parent_id);
                comment.parentpointer = data[parent];
                data[parent].comments.push(comment);
              }

              // If this is the comment being linked to, save it
              if (comment.id == $scope.subCommentId) {
                $scope.collapsed_comment = comment;
              }

              comment.commentsCollapsed = true;
              comment.label = 'comment';
              comment.link = 'comment_' + comment.id;

              // We only want to push top-level comments, they will include
              // subcomments in their comments array(s)
              if (comment.parent_id === null) {
                $scope.comments.push(comment);
              }
            });

            // If we are linking directly to a comment, we need to expand comments
            if ($scope.subCommentId) {
              var not_parent = true;
              // Expand comments, moving up towards the parent, until all are expanded
              do {
                $scope.collapsed_comment.commentsCollapsed = false;
                if ($scope.collapsed_comment.parent_id !== null) {
                  $scope.collapsed_comment = $scope.collapsed_comment.parentpointer;
                } else {
                  // We have reached the first sublevel of comments, so set the top level
                  // parent to expand and exit
                  not_parent = false;
                }
              } while (not_parent === true);
            }
          })
          .error(function (data) {
            console.error("Error loading comments: %o", data);
          });

      };

      $scope.parentSearch = function (arr, val) {
        for (var i=0; i<arr.length; i++)
          if (arr[i].id === val)
            return i;
        return false;
      };

      $scope.commentSubmit = function () {

        var comment = angular.copy($scope.comment);
        comment.user = $scope.user;
        comment.doc = $scope.doc;

        $http.post('/api/docs/' + comment.doc.id + '/comments', {
          'comment': comment
        })
          .success(function (data) {
            data[0].label = 'comment';
            $scope.comments.push(data[0]);
            $scope.comment.text = '';

            feedbackMessage($scope.layoutTexts.commentfeedbackMessage, 'success', '#participate-comment-message');
          })
          .error(function (data) {
            console.error("Error posting comment: %o", data);
          });
      };

      $scope.activityOrder = function (activity) {
        var popularity = activity.likes - activity.dislikes;

        return popularity;
      };

      $scope.addAction = function (activity, action, $event) {
        if ($scope.user.id !== '') {
          $http.post('/api/docs/' + $scope.doc.id + '/' + activity.label + 's/' + activity.id + '/' + action)
            .success(function (data) {
              activity.likes = data.likes;
              activity.dislikes = data.dislikes;
              activity.flags = data.flags;
              activity.deleted_at = data.deleted_at;
            }).error(function (data) {
              console.error(data);
            });
        } else {
          createLoginPopup($event);
        }

      };

      $scope.collapseComments = function (activity) {
        activity.commentsCollapsed = !activity.commentsCollapsed;
      };

      $scope.subcommentSubmit = function (activity, subcomment) {

        if ($scope.user.id === '') {
          var focused = document.activeElement;

          if (document.activeElement == document.body) {
            pageY = $(window).scrollTop() + 300;
            clientX = $(window).width() / 2 - 100;
          }else{
            pageY = $(focused).offset().top;
            clientX = $(focused).offset().left;
          }

          createLoginPopup(jQuery.Event( "click", { clientX: clientX, pageY: pageY } ));
          return;
        }

        subcomment.user = $scope.user;

        $.post('/participa/api/docs/' + $scope.doc.id + '/' + activity.label + 's/' + activity.id + '/comments', {
          'comment': subcomment
        })
          .success(function (data) {
            data.comments = [];
            data.label = 'comment';
            activity.comments.push(data);
            subcomment.text = '';
            subcomment.user = '';
            $scope.$apply();

            feedbackMessage($scope.layoutTexts.subCommentfeedbackMessage, 'success', '#participate-comment-message');

          }).error(function (data) {
            console.error(data);
          });
      };
    }
    ])
  .controller('UserPageController', ['$scope', '$http', '$location',
    function ($scope, $http, $location) {
      $scope.user = {};
      $scope.meta = '';
      $scope.docs = [];
      $scope.activities = [];
      $scope.verified = false;

      $scope.init = function () {
        $scope.getUser();
      };

      $scope.getUser = function () {
        var abs = $location.absUrl();
        var id = abs.match(/.*\/(\d+)$/);
        id = id[1];

        $http.get('/api/user/' + id)
          .success(function (data) {
            $scope.user = angular.copy(data);
            $scope.meta = angular.copy(data.user_meta);

            angular.forEach(data.docs, function (doc) {
              $scope.docs.push(doc);
            });

            angular.forEach(data.comments, function (comment) {
              comment.label = 'comment';
              $scope.activities.push(comment);
            });

            angular.forEach(data.annotations, function (annotation) {
              annotation.label = 'annotation';
              $scope.activities.push(annotation);
            });

            angular.forEach($scope.user.user_meta, function (meta) {
              var cont = true;

              if (meta.meta_key === 'verify' && meta.meta_value === 'verified' && cont) {
                $scope.verified = true;
                cont = false;
              }
            });

          }).error(function (data) {
            console.error("Unable to retrieve user: %o", data);
          });
      };

      $scope.showVerified = function () {
        if ($scope.user.docs && $scope.user.docs.length > 0) {
          return true;
        }

        return false;
      };

      $scope.activityOrder = function (activity) {
        return Date.parse(activity.created_at);
      };

    }
    ])
    .controller('DocumentTocController', ['$scope',
      function ($scope) {
        $scope.headings = [];
        // For now, we use the simplest possible method to render the TOC -
        // just scraping the content.  We could use a real API callback here
        // later if need be.  A huge stack of jQuery follows.
        var headings = $('#doc_content').find('h1,h2,h3,h4,h5,h6');

        if(headings.length > 0) {

          headings.each(function(i, elm) {
            elm = $(elm);
            // Set an arbitrary id.
            // TODO: use a better identifier here - preferably a title-based slug
            if(!elm.attr('id'))
            {
              elm.attr('id', 'heading-' + i);
            }
            elm.addClass('anchor');
            $scope.headings.push({'title': elm.text(), 'tag': elm.prop('tagName'), 'link': elm.attr('id')});
          });
        }
        else {
          $('#toc-column').remove();
          var container = $('#content').parent();
          container.removeClass('col-md-6');
          container.addClass('col-md-9');
        }

      }
    ]);
