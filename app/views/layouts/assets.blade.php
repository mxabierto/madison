<!-- Polyfills -->
<!--[if lt IE 9]>
<script src="/polyfills/es5.js"></script>
<script src="/polyfills/eventListener.js"></script>
<script src="/polyfills/html5shiv.js"></script>
<![endif]-->


<!-- Stylesheets -->
<link type="text/css" rel="stylesheet" href="/participa-assets/build/app.css">

<!-- Scripts -->
<script src="/participa-assets/build/app.js"></script>

<?php
$fs = new Illuminate\Filesystem\Filesystem();
?>
{{-- Include site-specific uservoice js file if it exists --}}
@if($fs->exists(public_path() . '/js/uservoice.js'))
	{{ HTML::script('js/uservoice.js') }}
@endif

{{-- Include site-specific addthis js file if it exists --}}
@if($fs->exists(public_path() . '/js/addthis.js'))
	{{ HTML::script('js/addthis.js') }}
@endif

{{-- Include site-specific google analytics js file if it exists --}}
@if($fs->exists(public_path() . '/js/ga.js'))
    {{ HTML::script('js/ga.js') }}
@endif




