<?php

class DocumentsController extends Controller
{
    public function listDocuments()
    {
        if (!Auth::check()) {
            return Redirect::to('/')->with('error', trans('messages.needlogin'));
        }

        $raw_docs = Doc::allOwnedBy(Auth::user()->id);

        // Get all user groups and create array from their names
        $groups = Auth::user()->groups()->get();
        $group_names = [];
        foreach ($groups as $group) {
            array_push($group_names, $group->getDisplayName());
        }

        // Create master documents array and prefill group subarray
        $documents = ['independent' => [], 'group' => []];
        $documents['group'] = array_fill_keys($group_names, []);

        // Copy document to appropriate array
        foreach ($raw_docs as $doc) {
            if ($doc->userSponsor()->exists()) {
                array_push($documents['independent'], $doc);
            } elseif ($doc->groupSponsor()->exists()) {
                array_push($documents['group'][$doc->sponsor()->first()->getDisplayName()], $doc);
            }
        }

        return View::make('documents.list', ['doc_count' => count($raw_docs), 'documents' => $documents]);
    }

    public function saveDocumentEdits($documentId)
    {
        if (!Auth::check()) {
            return Redirect::route('documents')->with('error', trans('messages.needlogin'));
        }

        $content = Input::get('content');
        $contentId = Input::get('content_id');

        if (empty($content)) {
            return Redirect::route('documents')->with('error', "Debe incluír contenido para guardar");
        }

        if (!empty($contentId)) {
            $docContent = DocContent::find($contentId);
        } else {
            $docContent = new DocContent();
        }

        if (!$docContent instanceof DocContent) {
            return Redirect::route('documents')->with('error', 'No se pudo localizar el documento para guardar');
        }

        $document = Doc::find($documentId);

        if (!$document instanceof Doc) {
            return Redirect::route('documents')->with('error', "No se pudo localizar el documento");
        }

        if (!$document->canUserEdit(Auth::user())) {
            return Redirect::route('documents')->with('error', ucfirst(strtolower(trans('messages.notauthorized').' '.trans('messages.tosave').' '.trans('messages.document'))));
        }

        $docContent->doc_id = $documentId;
        $docContent->content = $content;

        try {
            DB::transaction(function () use ($docContent, $content, $documentId, $document) {
                $docContent->save();
            });
        } catch (\Exception $e) {
            return Redirect::route('documents')->with('error', "Ocurrió un error al guardar el documento: {$e->getMessage()}");
        }

        //Fire document edited event for admin notifications
        $doc = Doc::find($docContent->doc_id);
        Event::fire(MadisonEvent::DOC_EDITED, $doc);

        try {
            $document->indexContent($docContent);
        } catch (\Exception $e) {
            return Redirect::route('documents')->with('error', "Documento guardado, pero ha ocurrido un error con Elasticsearch: {$e->getMessage()}");
        }

        return Redirect::route('documents')->with('success_message', trans('messages.saveddoc'));
    }

    public function editDocument($documentId)
    {
        if (!Auth::check()) {
            return Redirect::route('home')->with('error', trans('messages.needlogin'));
        }

        $doc = Doc::find($documentId);

        if (is_null($doc)) {
            return Redirect::route('documents')->with('error', 'Documento no encontrado.');
        }

        if (!$doc->canUserEdit(Auth::user())) {
            return Redirect::route('documents')->with('error', ucfirst(strtolower(trans('messages.notauthorized').' '.trans('messages.toviewdocument'))));
        }

        return View::make('documents.edit', [
            'page_id'     => 'edit_doc',
            'page_title'  => "Editing {$doc->title}",
            'doc'         => $doc,
            'contentItem' => $doc->content()->where('parent_id')->first(),
        ]);
    }

    public function createDocument()
    {
        if (!Auth::check()) {
            return Redirect::route('home')->with('error', trans('messages.needlogin'));
        }

        $input = Input::all();

        $rules = [
            'title' => 'required',
        ];

        $validator = Validator::make($input, $rules);

        if ($validator->fails()) {
            return Redirect::route('documents')->withInput()->withErrors($validator);
        }

        try {
            $docOptions = [
                'title' => $input['title'],
            ];

            $user = Auth::user();

            $activeGroup = Session::get('activeGroupId');

            if ($activeGroup > 0) {
                $group = Group::where('id', '=', $activeGroup)->first();

                if (!$group) {
                    return Redirect::route('documents')->withInput()->with('error', 'Grupo inválido');
                }

                if (!$group->userHasRole($user, Group::ROLE_EDITOR) && !$group->userHasRole($user, Group::ROLE_OWNER)) {
                    return Redirect::route('documents')->withInput()->with('error', ucfirst(strtolower(trans('messages.nopermission').' '.trans('messages.tocreate').' '.trans('messages.document').' '.trans('messages.forgroup'))));
                }

                $docOptions['sponsor'] = $activeGroup;
                $docOptions['sponsorType'] = Doc::SPONSOR_TYPE_GROUP;
            } else {
                if (!$user->hasRole(Role::ROLE_INDEPENDENT_SPONSOR)) {
                    return Redirect::route('documents')->withInput()->with('error', ucfirst(strtolower(trans('messages.nopermission').' '.trans('messages.tocreate').' '.trans('messages.document').' '.trans('messages.asindividual'))));
                }

                $docOptions['sponsor'] = Auth::user()->id;
                $docOptions['sponsorType'] = Doc::SPONSOR_TYPE_INDIVIDUAL;
            }

            $document = Doc::createEmptyDocument($docOptions);

            if ($activeGroup > 0) {
                Event::fire(MadisonEvent::NEW_GROUP_DOCUMENT, ['document' => $document, 'group' => $group]);
            }

            return Redirect::to("documents/edit/{$document->id}")->with('success_message', trans('messages.saveddoc'));
        } catch (\Exception $e) {
            return Redirect::to("documents")->withInput()->with('error', "Disculpa, ocurrió un error procesando tu solicitud - {$e->getMessage()}");
        }
    }
}
