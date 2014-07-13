<?php

namespace Rednose\TodoBundle\Model;

interface TaskInterface
{
    /**
     * Get Id
     *
     * @return integer
     */
    public function getId();

    /**
     * Get the task description
     *
     * @return string
     */
    public function getDesciption();

    /**
     * Set the task description
     *
     * @param string $description
     */
    public function setDesciption($description);

    /**
     * Get ready state
     *
     * @return boolean
     */
    public function getReady();

    /**
     * Set ready state
     *
     * @param boolean $state
     */
    public function setReady($state);
}