<?php

namespace Rednose\TodoBundle\Controller;

use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;

use JMS\Serializer\DeserializationContext;

use Symfony\Component\HttpFoundation\Response;

use Rednose\TodoBundle\Common\Controller;

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

        return $this->getView('json', array('details'), $projects);
    }

    /**
     * Export all projects
     *
     * @Get("/projects/export", name="todo_app_projects_export", options={"expose"=true})
     *
     * @return Response
     */
    function exportProjectsActions()
    {
        $em = $this->getDoctrine()->getManager();

        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml');
        $response->headers->set('Content-Disposition', 'attachment;filename=export.xml');

        $projects = $em->getRepository('Rednose\TodoBundle\Entity\Project')->findAll();

        $domExport = new \DOMDocument('1.0', 'UTF-8');
        $domExport->loadXml('<projects />');

        foreach ($projects as $project) {
            $domProject = new \DOMDocument('1.0', 'UTF-8');
            $domProject->loadXml(
                $this->getView('xml', array('file'), $project)->getContent()
            );

            $projectNode = $domExport->importNode($domProject->getElementsByTagName('project')->item(0), true);

            $domExport->getElementsByTagName('projects')->item(0)->appendChild(
                $projectNode
            );
        }

        $response->setContent(
            $domExport->saveXML()
        );

        return $response;
    }

    /**
     * Update a project
     *
     * @Post("/project", name="todo_app_project_update", options={"expose"=true})
     *
     * @return Response
     */
    function updateProjectActions()
    {
        $em = $this->getDoctrine()->getManager();
        $serializer = $this->get('jms_serializer');

        $context = new DeserializationContext();
        $context->setGroups(array('details'));

        $project = $serializer->deserialize(
            $this->getRequest()->getContent(),
            'Rednose\TodoBundle\Entity\Project',
            'json', $context
        );

        $em->persist($project);
        $em->flush();

        return $this->getView('json', array('details'), $project);
    }
}