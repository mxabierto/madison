angular.module( 'madisonApp.services', []);

var messageTimer;
function feedbackMessage( message, type, container ) {
    type            = typeof type !== 'undefined' ? type : 'info';
    container       = typeof container !== 'undefined' ? container : '.message-box';

    var html        = '<div class="alert alert-' + type + '">' + message + '</div>';
    var $container  = $( container ).first();
    $container.fadeIn( "fast" );
    $container.append( html );

    clearTimeout( messageTimer );
    messageTimer    = setTimeout( clearMessages, 6000, container );
}

function clearMessages( container ) {
    var $container  = $( container ).first();
    $container.fadeOut( "slow", function() {
        $container.html( '' );
    });
}