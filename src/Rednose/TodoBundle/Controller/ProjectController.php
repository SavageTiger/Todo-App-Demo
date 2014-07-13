<?php

namespace Rednose\TodoBundle\Controller;

use JMS\Serializer\SerializationContext;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\View\View;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ProjectController extends Controller
{
    /**
     * Render the base template bootstrapping the SPA.
     *
     * @Get("/projects", name="todo_app_projects_read", options={"expose"=true})
     *
     * @return JsonResponse
     */
    function readProjectsActions()
    {
        $em = $this->getDoctrine()->getManager();

        $projects = $em->getRepository('Rednose\TodoBundle\Entity\Project')->findAll(
            array(), array('name' => 'ASC')
        );

        $handler = $this->get('fos_rest.view_handler');

        $view    = new View();
        $context = new SerializationContext();
        $context->setGroups(array('details'));

        $view->setSerializationContext($context);
        $view->setData($projects);
        $view->setFormat('json');

        return $handler->handle($view);
    }
}