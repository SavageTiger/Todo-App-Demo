<?php

namespace Rednose\TodoBundle\Common;

use JMS\Serializer\SerializationContext;
use FOS\RestBundle\View\View;
use Symfony\Bundle\FrameworkBundle\Controller\Controller as BaseController;

class Controller extends BaseController
{
    /**
     * Create a xml or json view based on given entity
     *
     * @param string $format
     * @param array $groups
     * @param mixed $data
     * @return Response
     */
    function getView($format, $groups, $entity)
    {
        $handler = $this->get('fos_rest.view_handler');

        $view    = new View();
        $context = new SerializationContext();
        $context->setGroups($groups);

        $view->setSerializationContext($context);
        $view->setData($entity);
        $view->setFormat($format);

        return $handler->handle($view);
    }
}