<?php

namespace Rednose\TodoBundle\Controller;

use FOS\RestBundle\Controller\Annotations\Get;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AppController extends Controller
{
    /**
     * Render the base template bootstrapping the SPA.
     *
     * @Get("/", name="todo_app_home")
     *
     * @return Response
     */
    function homeAction()
    {
        return $this->render('RednoseTodoBundle::app.html.twig');
    }
}