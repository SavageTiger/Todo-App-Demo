<?php

namespace Rednose\DocgenBundle\DataFixtures\ORM;

use DOMDocument;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Doctrine\Common\Persistence\ObjectManager;

use JMS\Serializer\DeserializationContext;

class Tasks extends AbstractFixture implements ContainerAwareInterface
{
    /**
     * @var JMS\Serializer\SerializerInterface
     */
    var $serializer = null;

    /**
     * {@inheritdoc}
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->serializer = $container->get('serializer');
    }

    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $em)
    {
        $class = 'Rednose\TodoBundle\Entity\Project';

        $domDocument = new DOMDocument('1.0', 'UTF-8');
        $domDocument->loadXml(file_get_contents(__DIR__ . '/../XML/Skeleton.xml'));

        foreach ($domDocument->getElementsByTagName('project') as $projectNode) {
            $context = new DeserializationContext();
            $context->setGroups(array('file'));

            $projectXml = $domDocument->saveXML($projectNode);
            $projectEntity = $this->serializer->deserialize($projectXml, $class, 'xml', $context);

            $em->persist($projectEntity);
        }

        $em->flush();
    }
}
