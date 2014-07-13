<?php

namespace Rednose\TodoBundle\Model;

interface ProjectInterface
{
    /**
     * Get Id
     *
     * @return integer
     */
    public function getId();

    /**
     * Get the project name
     *
     * @return string
     */
    public function getName();

    /**
     * Set the project name
     *
     * @param string $name
     */
    public function setName($name);

    /**
     * Add a task to the project
     *
     * @param TaskInterface $task
     */
    public function addTask(TaskInterface $task);

    /**
     * Get tasks bound to this project
     *
     * @return ArrayCollection<TaskInterface>
     */
    public function getTasks();

}