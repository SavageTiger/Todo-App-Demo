<?php

namespace Rednose\TodoBundle\Model;

/**
 * Project containing tasks
 */
class Project implements ProjectInterface
{
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
}