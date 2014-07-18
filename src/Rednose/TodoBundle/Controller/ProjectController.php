<?php

namespace Rednose\TodoBundle\Controller;

use JMS\Serializer\SerializationContext;
use JMS\Serializer\DeserializationContext;

use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\View\View;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ProjectController extends Controller
{
    /**
     * Get all projects
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

    /**
     * Update a project
     *
     * @Post("/project/{id}", name="todo_app_project_update", options={"expose"=true})
     *
     * @return Response
     */
    function updateProjectActions($id)
    {
        $em = $this->getDoctrine()->getManager();
        $serializer = $this->get('serializer');

        $context = new DeserializationContext();
        $context->setGroups(array('details'));

        $project = $serializer->deserialize(
            $this->getRequest()->getContent(),
            'Rednose\TodoBundle\Entity\Project',
            'json', $context
        );

        $em->persist($project);
        $em->flush();

        return new Response(json_encode(array('id' => $project->getId())));
    }
}