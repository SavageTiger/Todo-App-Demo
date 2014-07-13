<?php

namespace Rednose\TodoBundle\Model;

/**
 * Task model
 */
class Task implements TaskInterface
{
    /**
     * @see TaskInterface
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @see TaskInterface
     */
    public function getDesciption()
    {
        return $this->description;
    }

    /**
     * @see TaskInterface
     */
    public function setDesciption($description)
    {
        $this->description = $description;
    }

    /**
     * @see TaskInterface
     */
    public function getReady()
    {
        return $this->description;
    }

    /**
     * @see TaskInterface
     */
    public function setReady($state)
    {
        $this->ready = state;
    }
}