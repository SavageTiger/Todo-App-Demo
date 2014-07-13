<?php

namespace Rednose\TodoBundle\Model;

use Doctrine\Common\Collections\ArrayCollection;

/**
 * Project containing tasks
 */
class Project implements ProjectInterface
{
    /**
     * Constructor
     */
    function __construct()
    {
        $this->tasks = new ArrayCollection;
    }

    /**
     * @see ProjectInterface
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @see ProjectInterface
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @see ProjectInterface
     */
    public function setName($name)
    {
        $this->name= $name;
    }

    /**
     * @see ProjectInterface
     */
    public function addTask(TaskInterface $task) {
        $this->tasks->add($task);
    }

    /**
     * @see ProjectInterface
     */
    public function getTasks() {
        return $this->tasks;
    }
}