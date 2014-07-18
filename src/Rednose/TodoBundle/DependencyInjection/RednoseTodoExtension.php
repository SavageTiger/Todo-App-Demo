<?php

namespace Rednose\TodoBundle\DependencyInjection;

use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;

/**
 * Loads the configuration files and injects them to the service container.
 */
class RednoseTodoExtension extends Extension
{
    /**
     * Build the extension services.
     *
     * @param array            $configs   An array of configurations.
     * @param ContainerBuilder $container The Containerbuilder.
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new XmlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));

        $serviceFiles = array('serializer');

        foreach ($serviceFiles as $basename) {
            $loader->load(sprintf('%s.xml', $basename));
        }
    }
}