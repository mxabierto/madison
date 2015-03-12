{{--
<div class="row">
	<div class="md-col-12">
		<h1>Login</h1>
	</div>
</div>
--}}

<div class="row">
	<div class="col-md-10 col-md-offset-1">
		{{ Form::open(array('url'=>URL::route('api/user/login'), 'method'=>'post')) }}
		<div class="errors"></div>
		<!-- Email -->
		<div class="form-group">
			{{ Form::label('email', Lang::get('messages.email')) . Form::text('email', Input::old('email'), array('placeholder'=>Lang::get('messages.email'), 'class'=>'form-control')) }}
		</div>
		<!-- Password -->
		<div class="form-group">
			{{ Form::label('password', Lang::get('messages.password')) . Form::password('password', array('placeholder'=>Lang::get('messages.password'), 'class'=>'form-control')) }}
		</div>
		<!-- Submit -->
		{{ Form::submit(Lang::get('messages.login'), array('class'=>'btn btn-default')) }}
		<a class="forgot-password" href="{{ URL::route('password/remind') }}">{{ trans('messages.forgotpassword') }}</a>
		{{ Form::token() . Form::close() }}
	</div>
</div>
<div class="row">
	<div class="col-md-12 social-login-wrapper">
	  <div class="row">
	    <div class="col-md-12">
	      <a href="/participa/user/facebook-login" class="btn social-login-btn facebook-login-btn">
	        <img src="/participa-assets/img/icon-facebook.png" alt="facebook icon" />
	        {{ trans('messages.loginwith') }} Facebook
	      </a>
	    </div>
	    <div class="col-md-12">
	      <a href="/participa/user/twitter-login" class="btn social-login-btn twitter-login-btn">
	        <img src="/participa-assets/img/icon-twitter.png" alt="twitter icon" />
	        {{ trans('messages.loginwith') }} Twitter
	      </a>
	    </div>
	    <div class="col-md-12">
	      <a href="/participa/user/linkedin-login" class="btn social-login-btn linkedin-login-btn">
	        <img src="/participa-assets/img/icon-linkedin.png" alt="linkedin icon" />
	        {{ trans('messages.loginwith') }} LinkedIn
	      </a>
	    </div>
	  </div>
	</div>
</div>
