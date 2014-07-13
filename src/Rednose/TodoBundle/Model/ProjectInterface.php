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
}