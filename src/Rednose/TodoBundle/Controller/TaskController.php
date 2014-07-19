<?php

namespace Rednose\TodoBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

use FOS\RestBundle\Controller\Annotations\Post;

class TaskController extends Controller
{
    /**
     * Remove a task
     *
     * @Post("/task/remove/{id}", name="todo_app_task_remove", options={"expose"=true})
     *
     * @return Response
     */
    function removeTaskActions($id)
    {
        $em = $this->getDoctrine()->getManager();

        $task = $em->getRepository('Rednose\TodoBundle\Entity\Task')->findOneById($id);

        $em->remove($task);
        $em->flush();

        return new Response('');
    }
}