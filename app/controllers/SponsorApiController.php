<?php


class SponsorApiController extends ApiController
{
    public function __construct()
    {
        parent::__construct();

        $this->beforeFilter('auth', [
            'on' => ['post', 'put', 'delete'],
        ]);
    }

    public function getAllSponsors()
    {
        $results = Doc::getAllValidSponsors();

        return Response::json($results);
    }
}
