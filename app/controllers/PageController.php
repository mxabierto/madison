<?php

class PageController extends BaseController
{
    public $restful = true;

    /**
     * Home Page.
     */
    public function home()
    {
        $data = [
            'page_id'        => 'home',
            'page_title'     => 'gob.mx/participa',
        ];

        return View::make('page.index', $data);
    }

    /**
     * About Page.
     */
    public function getAbout()
    {
        $data = [
            'page_id'        => 'about',
            'page_title'     => 'gob.mx/participa - Acerca de',
        ];

        return View::make('page.index', $data);
    }

    /**
     * FAQ Page.
     */
    public function faq()
    {
        $data = [
            'page_id'        => 'faq',
            'page_title'     => 'gob.mx/participa - Pregunstas Frecuentes',
        ];

        return View::make('page.index', $data);
    }

    public function privacyPolicy()
    {
        $data = [
            'page_id'       => 'privacy',
            'page_title'    => 'gob.mx/participa - Privacidad',
        ];

        return View::make('page.index', $data);
    }

    public function terms()
    {
        $data = [
            'page_id'       => 'terms',
            'page_title'    => 'gob.mx/participa - Términos y condiciones',
        ];

        return View::make('page.index', $data);
    }

    public function copyright()
    {
        $data = [
            'page_id'    => 'copyright',
            'page_title' => 'gob.mx/participa - Licencia',
        ];

        return View::make('page.index', $data);
    }
}
