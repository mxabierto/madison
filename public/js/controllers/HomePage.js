angular.module( 'madisonApp.controllers' )
    .controller( 'HomePageController', [ '$scope', '$location', '$http', '$filter', '$cookies', 'Doc', function ( $scope, $location, $http, $filter, $cookies, Doc ) {
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
                }, function ( data ) {
                    $scope.totalDocs  = data.pagination.count;
                    $scope.perPage    = data.pagination.per_page;
                    $scope.page       = data.pagination.page;
                    $scope.updating   = false;
                    $scope.parseDocs( data.results );
                }).$promise.catch( function ( data ) {
                    console.error( "Unable to get documents: %o", data );
                });
            };

        $scope.docs             = [];
        $scope.categories       = [];
        $scope.sponsors         = [];
        $scope.statuses         = [];
        $scope.dates            = [];
        $scope.dateSort         = '';
        $scope.select2          = '';
        $scope.docSearch        = '';
        $scope.docSort          = "created_at";
        $scope.reverse          = true;
        $scope.startStep        = 0;
        $scope.updating         = false;
        $scope.docSearch        = docSearch;
        $scope.select2Config    = {
            multiple    : true,
            allowClear  : true,
            placeholder : "Categoría, autor o estatus"
        };
        $scope.dateSortConfig   = {
            allowClear  : true,
            placeholder : "Fecha"
        };

        $scope.paginate     = function () {
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
        $scope.search       = function () {
            if ( $scope.docSearch ) {
              $location.search( "q", $scope.docSearch );
            } else {
              $location.search( "q", null );
            }

            docSearch = $scope.docSearch;
            query();
        };
        $scope.parseDocs    = function ( docs ) {
            angular.forEach( docs, function ( doc ) {
                $scope.docs.unshift( doc );

                $scope.parseDocMeta( doc.categories, 'categories' );
                $scope.parseDocMeta( doc.sponsor, 'sponsors' );
                $scope.parseDocMeta( doc.statuses, 'statuses' );

                angular.forEach( doc.dates, function ( date ) {
                    date.date = Date.parse( date.date );
                });
            });
        };
        $scope.parseDocMeta = function ( collection, name ) {
            if ( collection.length === 0 ) {
              return;
            }

            angular.forEach( collection, function ( item ) {
              var found = $filter( 'getById' )( $scope[name], item.id );

              if ( found === null ) {
                switch ( name ) {
                    case 'categories':
                        $scope.categories.push( item );
                        break;
                    case 'sponsors':
                        $scope.sponsors.push( item );
                        break;
                    case 'statuses':
                        $scope.statuses.push( item );
                        break;
                    default:
                        console.error( 'Unknown meta name: ' + name );
                }
              }
            });
        };
        $scope.docFilter    = function ( doc ) {
            var show    = false;

            if ( $scope.select2 !== undefined && $scope.select2 !== '' ) {
                var cont    = true;
                var select2 = $scope.select2.split( '_' );
                var type    = select2[0];
                var value   = parseInt( select2[1], 10 );

                switch ( type ) {
                    case 'category':
                        angular.forEach( doc.categories, function ( category ) {
                            if ( +category.id === value && cont ) {
                                show    = true;
                                cont    = false;
                            }
                        });
                        break;
                    case 'sponsor':
                        angular.forEach( doc.sponsor, function ( sponsor ) {
                            if ( +sponsor.id === value && cont ) {
                                show    = true;
                                cont    = false;
                            }
                        });
                        break;
                    case 'status':
                        angular.forEach( doc.statuses, function ( status ) {
                            if ( +status.id === value && cont ) {
                                show    = true;
                                cont    = false;
                            }
                        });
                        break;
                }
            } else {
                show    = true;
            }

            return show;
        };

        query();
    }]);