<?php

use Illuminate\Database\Seeder;

class DocumentsTableSeeder extends Seeder
{
	public function run()
	{
		$adminEmail = Config::get('madison.seeder.admin_email');
		$adminPassword = Config::get('madison.seeder.admin_password');

    // Login as admin to create docs
		$credentials = array('email' => $adminEmail, 'password' => $adminPassword);
    Auth::attempt($credentials);
    $admin = Auth::user();
    $mx_a = Group::where('id', '=', 1)->first();

    // Create first doc

    $docSeedPath = app_path() . '/database/seeds/the_last_question.md';
    if(file_exists($docSeedPath)) {
      $content = file_get_contents($docSeedPath);
    }
    $docOptions = array(
      'title'       => 'The Last Question',
      'content'     => $content,
      'sponsor'     => $mx_a->id,
      'sponsorType' => Doc::SPONSOR_TYPE_GROUP
    );
    $document = Doc::createEmptyDocument($docOptions);

    Input::replace($input = ['content' => $content]);
    App::make('DocumentsController')->saveDocumentEdits($document->id);

    // Create second doc

    $docSeedPath = app_path() . '/database/seeds/log_reg.md';
    if(file_exists($docSeedPath)) {
      $content = file_get_contents($docSeedPath);
    }

    $docOptions = array(
      'title'       => 'Logistic Regression',
      'sponsor'     => $mx_a->id,
      'sponsorType' => Doc::SPONSOR_TYPE_GROUP
    );
    $document = Doc::createEmptyDocument($docOptions);

		DB::table('doc_contents')->insert(array(
      'doc_id'      => $document->id,
      'content'     => $content,
		));
	}
}
