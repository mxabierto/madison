<?php

Route::group(['prefix' => 'participa'], function () {

/*
*   Include all partials in app/routes/
*/
foreach (File::allFiles(__DIR__.'/routes') as $partial) {
    require_once $partial->getPathname();
}

/*
*   Global Route Patterns
*/

Route::pattern('annotation', '[0-9a-zA-Z_-]+');
Route::pattern('comment', '[0-9a-zA-Z_-]+');
Route::pattern('doc', '[0-9]+');
Route::pattern('user', '[0-9]+');
Route::pattern('date', '[0-9]+');

/*
*   Route - Model bindings
*/
Route::model('user', 'User');
Route::model('user/edit', 'User');

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

Route::get('/dev/event/test', 'DevController@testEvent');

// Modal Routes
Route::get('modals/annotation_thanks', [
    'uses'   => 'ModalController@getAnnotationThanksModal',
    'before' => 'disable profiler',
]);

Route::post('modals/annotation_thanks', 'ModalController@seenAnnotationThanksModal');

Route::get('groups', ['as' => 'groups', 'uses' => 'GroupsController@getIndex']);
Route::put('groups/edit', 'GroupsController@putEdit');
Route::get('groups/edit/{groupId?}', 'GroupsController@getEdit');
Route::get('groups/members/{groupId}', 'GroupsController@getMembers');
Route::get('groups/member/{memberId}/delete', 'GroupsController@removeMember');
Route::post('groups/member/{memberId}/role', 'GroupsController@changeMemberRole');
Route::get('groups/invite/{groupId}', 'GroupsController@inviteMember');
Route::put('groups/invite/{groupId}', 'GroupsController@processMemberInvite');
Route::get('groups/active/{groupId}', 'GroupsController@setActiveGroup');

//Static Pages
Route::get('about', ['as' => 'about', 'uses' => 'PageController@getAbout']);
Route::get('faq', 'PageController@faq');
Route::get('privacy-policy', 'PageController@privacyPolicy');
Route::get('terms-and-conditions', 'PageController@terms');
Route::get('copyright', 'PageController@copyright');
Route::get('/', ['as' => 'home', 'uses' => 'PageController@home']);

//Document Routes
Route::get('docs', ['as' => 'docs', 'uses' => 'DocController@index']);
Route::get('docs/{slug}', 'DocController@index');
Route::get('docs/embed/{slug}', 'DocController@getEmbedded');
Route::get('docs/{slug}/feed', 'DocController@getFeed');
Route::get('documents/search', 'DocumentsController@getSearch');
Route::get('documents', ['as' => 'documents', 'uses' => 'DocumentsController@listDocuments']);
Route::get('documents/view/{documentId}', 'DocumentsController@viewDocument');
Route::get('documents/edit/{documentId}', 'DocumentsController@editDocument');
Route::put('documents/edit/{documentId}', ['as' => 'saveDocumentEdits', 'uses' => 'DocumentsController@saveDocumentEdits']);
Route::post('documents/create', ['as' => 'documents/create', 'uses' => 'DocumentsController@createDocument']);
Route::post('documents/save', 'DocumentsController@saveDocument');
Route::delete('/documents/delete/{slug}', 'DocumentsController@deleteDocument');
Route::get('/documents/sponsor/request', ['as' => 'sponsorRequest', 'uses' => 'SponsorController@getRequest']);
Route::post('/documents/sponsor/request', ['as' => 'sponsorRequest', 'uses' => 'SponsorController@postRequest']);

//User Routes
Route::get('user/{user}', 'UserController@getIndex');
Route::get('user/edit/{user}', ['as' => 'editUser', 'uses' => 'UserController@getEdit']);
Route::put('user/edit/{user}', ['as' => 'editUser', 'uses' => 'UserController@putEdit']);
Route::get('user/edit/{user}/notifications', ['as' => 'editNotifications', 'uses' => 'UserController@editNotifications']);
Route::controller('user', 'UserController');
Route::get('user/login', ['as' => 'user/login', 'uses' => 'UserController@getLogin']);
Route::get('user/signup', ['as' => 'user/signup', 'uses' => 'UserController@getSignup']);
Route::post('user/login', ['as' => 'user/login', 'uses' => 'UserController@postLogin']);
Route::post('user/signup', ['as' => 'user/signup', 'uses' => 'UserController@postSignup']);

//Password Routes
Route::get('password/remind', ['as' => 'password/remind', 'uses' => 'RemindersController@getRemind']);
Route::post('password/remind', 'RemindersController@postRemind');
Route::get('password/reset/{token}',  'RemindersController@getReset');
Route::post('password/reset',  'RemindersController@postReset');

// Confirmation email resend
Route::get('verification/remind',  ['as' => 'verification/remind', 'uses' => 'RemindersController@getConfirmation']);
Route::post('verification/remind', ['as' => 'verification/remind', 'uses' => 'RemindersController@postConfirmation']);

//Annotation Routes
Route::get('annotation/{annotation}', 'AnnotationController@getIndex');

//Dashboard Routes
Route::controller('dashboard', 'DashboardController');
Route::get('dashboard', ['as' => 'dashboard', 'uses' => 'DashboardController@getIndex']);

//Dashboard's Doc Routes
Route::get('dashboard/docs', ['as' => 'dashboard/docs', 'uses' => 'DashboardController@getDocs']);
Route::post('dashboard/docs', ['as' => 'dashboard/docs', 'uses' => 'DashboardController@postDocs']);
Route::get('dashboard/docs/{doc}', ['as' => 'dashboardShowsDoc', 'uses' => 'DashboardController@getDocs']);

//Api Routes
    // Document API Routes
    Route::get('api/user/sponsors/all', 'DocumentApiController@getAllSponsorsForUser');
    Route::get('api/sponsors/all', 'SponsorApiController@getAllSponsors');

    //Annotation Action Routes
    Route::post('api/docs/{doc}/annotations/{annotation}/likes', 'AnnotationApiController@postLikes');
    Route::post('api/docs/{doc}/annotations/{annotation}/dislikes', 'AnnotationApiController@postDislikes');
    Route::post('api/docs/{doc}/annotations/{annotation}/flags', 'AnnotationApiController@postFlags');
    Route::post('api/docs/{doc}/annotations/{annotation}/seen', 'AnnotationApiController@postSeen');
    Route::get('api/docs/{doc}/annotations/{annotation}/likes', 'AnnotationApiController@getLikes');
    Route::get('api/docs/{doc}/annotations/{annotation}/dislikes', 'AnnotationApiController@getDislikes');
    Route::get('api/docs/{doc}/annotations/{annotation}/flags', 'AnnotationApiController@getFlags');

    //Annotation Comment Routes
    Route::get('api/docs/{doc}/annotations/{annotation}/comments', 'AnnotationApiController@getComments');
    Route::post('api/docs/{doc}/annotations/{annotation}/comments', 'AnnotationApiController@postComments');
    Route::get('api/docs/{doc}/annotations/{annotation}/comments/{comment}', 'AnnotationApiController@getComments');

    //Annotation Routes
    Route::get('api/annotations/search', 'AnnotationApiController@getSearch');
    Route::get('api/docs/{doc}/annotations/{annotation?}', ['as' => 'getAnnotation', 'uses' => 'AnnotationApiController@getIndex']);
    Route::post('api/docs/{doc}/annotations', 'AnnotationApiController@postIndex');
    Route::put('api/docs/{doc}/annotations/{annotation}', 'AnnotationApiController@putIndex');
    Route::delete('api/docs/{doc}/annotations/{annotation}', 'AnnotationApiController@deleteIndex');

    //Document Comment Routes
    Route::post('api/docs/{doc}/comments', 'CommentApiController@postIndex');
    Route::get('api/docs/{doc}/comments', 'CommentApiController@getIndex');
    Route::get('api/docs/{doc}/comments/{comment?}', 'CommentApiController@getIndex');
    Route::post('api/docs/{doc}/comments/{comment}/likes', 'CommentApiController@postLikes');
    Route::post('api/docs/{doc}/comments/{comment}/dislikes', 'CommentApiController@postDislikes');
    Route::post('api/docs/{doc}/comments/{comment}/flags', 'CommentApiController@postFlags');
    Route::post('api/docs/{doc}/comments/{comment}/comments', 'CommentApiController@postComments');
    Route::post('api/docs/{doc}/comments/{comment}/seen', 'CommentApiController@postSeen');
    Route::post('api/docs/{doc}/comments/{comment}/hide',
        [
            'as' => 'comment/hide',
            'uses' => 'CommentApiController@destroy'
        ]);
    Route::delete('api/docs/{doc}/comments/{comment}/delete',
        [
            'as' => 'comment/delete',
            'uses' => 'CommentApiController@destroy'
        ]);

    //Document Support / Oppose routes
    Route::post('api/docs/{doc}/support/', 'DocController@postSupport');
    Route::get('api/users/{user}/support/{doc}', 'UserApiController@getSupport');

    //Document Api Routes
    Route::get('api/docs/recent/{query?}', 'DocumentApiController@getRecent')->where('query', '[0-9]+');
    Route::get('api/docs/categories', 'DocumentApiController@getCategories');
    Route::get('api/docs/statuses', 'DocumentApiController@getAllStatuses');
    Route::get('api/docs/sponsors', 'DocumentApiController@getAllSponsors');
    Route::get('api/docs/{doc}/categories', 'DocumentApiController@getCategories');
    Route::post('api/docs/{doc}/categories', 'DocumentApiController@postCategories');
    Route::get('api/docs/{doc}/introtext', 'DocumentApiController@getIntroText');
    Route::post('api/docs/{doc}/introtext', 'DocumentApiController@postIntroText');
    Route::get('api/docs/{doc}/sponsor/{sponsor}', 'DocumentApiController@hasSponsor');
    Route::get('api/docs/{doc}/sponsor', 'DocumentApiController@getSponsor');
    Route::post('api/docs/{doc}/sponsor', 'DocumentApiController@postSponsor');
    Route::get('api/docs/{doc}/status', 'DocumentApiController@getStatus');
    Route::post('api/docs/{doc}/status', 'DocumentApiController@postStatus');
    Route::get('api/docs/{doc}/dates', 'DocumentApiController@getDates');
    Route::post('api/docs/{doc}/dates', 'DocumentApiController@postDate');
    Route::put('api/dates/{date}', 'DocumentApiController@putDate');
    Route::delete('api/docs/{doc}/dates/{date}', 'DocumentApiController@deleteDate');
    Route::get('api/docs/{doc}', 'DocumentApiController@getDoc');
    Route::post('api/docs/{doc}/title', 'DocumentApiController@postTitle');
    Route::post('api/docs/{doc}/slug', 'DocumentApiController@postSlug');
    Route::post('api/docs/{doc}/content', 'DocumentApiController@postContent');
    Route::get('api/docs/', 'DocumentApiController@getDocs');

    //User Routes
    Route::get('api/user/{user}', 'UserApiController@getUser');
    Route::get('api/user/verify/', 'UserApiController@getVerify');
    Route::post('api/user/verify/', 'UserApiController@postVerify');
    Route::get('api/user/admin/', 'UserApiController@getAdmins');
    Route::post('api/user/admin/', 'UserApiController@postAdmin');
    Route::get('api/user/independent/verify/', 'UserApiController@getIndependentVerify');
    Route::post('api/user/independent/verify/', 'UserApiController@postIndependentVerify');
    Route::get('api/user/current', 'UserController@getCurrent');
    Route::put('api/user/{user}/edit/email', 'UserController@editEmail');
    Route::get('api/user/{user}/notifications', 'UserController@getNotifications');
    Route::put('api/user/{user}/notifications', 'UserController@putNotifications');

    // Group Routes
    Route::get('api/groups/verify/', 'GroupsApiController@getVerify');
    Route::post('api/groups/verify/', 'GroupsApiController@postVerify');

    // User Login / Signup AJAX requests
    Route::get('api/user/login', ['as' => 'api/user/login', 'uses' => 'UserManageApiController@getLogin']);
    Route::post('api/user/login', ['as' => 'api/user/login', 'uses' => 'UserManageApiController@postLogin']);
    Route::get('api/user/signup', ['as' => 'api/user/signup', 'uses' => 'UserManageApiController@getSignup']);
    Route::post('api/user/signup', ['as' => 'api/user/signup', 'uses' => 'UserManageApiController@postSignup']);

//Logout Route
Route::get('logout', ['as' => 'logout', function () {
    Auth::logout();    //Logout the current user
    Session::flush(); //delete the session
    return Redirect::route('home')->with('message', 'Has salido exitosamente.');
}]);

});
