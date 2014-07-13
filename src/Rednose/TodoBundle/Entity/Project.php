<?php

namespace Rednose\TodoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;

use Rednose\TodoBundle\Model\Project as BaseProject;

/**
 * @ORM\Entity
 * @ORM\Table(name="todo_project")
 */
class Project extends BaseProject
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255)
     *
     * @Serializer\Groups({"details"})
     */
    protected $name;
}