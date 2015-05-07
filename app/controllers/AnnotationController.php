<?php
/**
 * 	Controller for note actions.
 */
class AnnotationController extends BaseController
{
    public function __construct()
    {
        parent::__construct();

        //Require the user to be signed in to create, update notes
        $this->beforeFilter('auth', ['on' => ['post', 'put']]);

        //Run CSRF filter before all POSTS
        $this->beforeFilter('csrf', ['on' => 'post']);
    }

    /**
     * 	GET note view.
     */
    public function getIndex($id = null)
    {
        //Return 404 if no id is passed
        if ($id == null) {
            App::abort(404, trans('messages.noteidnotfound'));
        }

        //Invalid note id
        $annotation = Annotation::find($id);
        $user = $annotation->user()->first();

        if (!isset($annotation)) {
            App::abort(404, ucfirst(strtolower(trans('messages.unable').' '.trans('messages.toretrieve').' '.trans('messages.the').' '.trans('messages.note'))));
        }

        //Retrieve note information

        $data = [
            'page_id'             => 'Annotation',
            'page_title'          => 'View Annotation',
            'annotation'          => $annotation,
            'user'                => $user,
        ];

        //Render view and return to user
        return View::make('annotation.index', $data);
    }
}
