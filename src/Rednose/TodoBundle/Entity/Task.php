<?php

namespace Rednose\TodoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;

use Rednose\TodoBundle\Model\Task as BaseTask;

/**
 * @ORM\Entity
 * @ORM\Table(name="todo_task")
 */
class Task extends BaseTask
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @Serializer\XmlAttribute
     * @Serializer\Groups({"details"})
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255)
     *
     * @Serializer\Groups({"details", "file"})
     */
    protected $description;

    /**
     * @ORM\Column(type="boolean")
     *
     * @Serializer\XmlAttribute
     * @Serializer\Groups({"details", "file"})
     */
    protected $ready = false;

    /**
     * @ORM\ManyToOne(targetEntity="Project")
     *
     * @ORM\JoinColumn(
     *   name="project_id",
     *   nullable=false,
     *   referencedColumnName="id",
     *   onDelete="CASCADE")
     *
     * @Serializer\SerializedName("project")
     * @Serializer\Groups({"details"})
     */
    protected $project;
}