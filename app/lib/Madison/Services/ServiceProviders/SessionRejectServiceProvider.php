<?php

namespace Madison\Services\ServiceProviders;

use Illuminate\Support\ServiceProvider;

//use \Illuminate\Http\Request;

class SessionRejectServiceProvider extends ServiceProvider
{
  public function register()
  {
      $me = $this;
      $this->app->bind('session.reject',
      function ($app) use ($me) {
        return function ($request) use ($me) {
          return call_user_func_array([$me, 'reject'], [$request]);
        };
      }
    );
  }

    protected function reject($request)
    {
        return ($request->isMethod('get') && $request->is('api/docs'));
    }
}
