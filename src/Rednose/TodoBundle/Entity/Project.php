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
     * @Serializer\XmlAttribute
     * @Serializer\Groups({"details", "file"})
     */
    protected $name;

    /**
     * @ORM\OneToMany(
     *   targetEntity="Task",
     *   orphanRemoval=true,
     *   mappedBy="project",
     *   cascade={"persist", "remove"})
     * @ORM\OrderBy({"id" = "ASC"})
     *
     * @Serializer\Groups({"details", "file"})
     * @Serializer\SerializedName("tasks")
     * @Serializer\XmlList(inline = false, entry = "task")
     */
    protected $tasks;

    // -- Transient API properties ---------------------------------------------

    /**
     * @Serializer\PostDeserialize
     */
    public function postDeserialize()
    {
        foreach ($this->tasks as $task) {
            $task->setProject($this);
        }
    }

}