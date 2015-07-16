angular.module( 'madisonApp.services' )
    .factory( 'createLoginPopup', [ '$document', '$timeout', function ( $document, $timeout ) {
        var body            = $document.find( 'body' );
        var html            = $document.find( 'html' );
        var attach_handlers = function () {
            html.on( 'click.popup', function () {
                $( '.popup' ).remove();
                html.off( 'click.popup' );
            });
        };
        var ajaxify_form    = function ( inForm, callback ) {
                var form    = $( inForm );
                form.submit( function ( e ) {
                e.preventDefault();

                $.post( form.attr( 'action' ), form.serialize(), function ( response ) {
                    if ( response.errors && Object.keys( response.errors ).length ) {
                        var error_html = $('<ul></ul>');

                        /*jslint unparam:true*/
                        angular.forEach( response.errors, function ( value, key ) {
                            error_html.append( '<li>' + value + '</li>' );
                        });
                        /*jslint unparam:false*/

                        form.find( '.errors' ).html( error_html );
                    } else {
                        callback( response );
                    }
                });
            });
        };

        return function LoginPopup( event ) {
            console.log( event );
            var popup   = $( '<div class="popup unauthed-popup"><p>Por favor regístrate.</p>' +
                '<input type="button" id="login" value="Ingresar" class="btn btn-primary"/>' +
                '<input type="button" id="signup" value="Registrarse" class="btn btn-primary" /></div>' );


            popup.on( 'click.popup', function ( event ) {
                event.stopPropagation();
            });

            $( '#login', popup ).click( function ( event ) {
                event.stopPropagation();
                event.preventDefault();

                $.get( '/participa/api/user/login/', {}, function ( data ) {
                    data    = $( data );

                    ajaxify_form(data.find('form'), function () {
                        $( 'html' ).trigger( 'click.popup' );
                        location.reload( false );
                    });
                    popup.html( data );
                });
            });
            $( '#signup', popup ).click( function ( event ) {
                event.stopPropagation();
                event.preventDefault();

                $.get( '/participa/api/user/signup/', {}, function ( data ) {
                    data    = $( data );

                    ajaxify_form( data.find( 'form' ), function ( result ) {
                        $( 'html' ).trigger( 'click.popup' );
                        alert( result.message );
                    });

                    popup.html( data );
                });
            });
            body.append(popup);

            var position    = {
                'top'   : event.pageY - popup.height(),
                'left'  : event.clientX
            };
            popup.css(  position).css( 'position', 'absolute' );
            popup.css(  'z-index', '999' );

            $timeout( function () {
                attach_handlers();
            }, 50 );
        };
    }]);