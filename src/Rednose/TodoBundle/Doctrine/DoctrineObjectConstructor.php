<?php

namespace Rednose\TodoBundle\Doctrine;

use JMS\Serializer\Construction\ObjectConstructorInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use JMS\Serializer\VisitorInterface;
use JMS\Serializer\Metadata\ClassMetadata;
use JMS\Serializer\DeserializationContext;

/**
 * Doctrine object constructor for new (or existing) objects during deserialization.
 */
class DoctrineObjectConstructor implements ObjectConstructorInterface
{
    private $managerRegistry;
    private $fallbackConstructor;

    /**
     * Constructor.
     *
     * @param ManagerRegistry            $managerRegistry     Manager registry
     * @param ObjectConstructorInterface $fallbackConstructor Fallback object constructor
     */
    public function __construct(ManagerRegistry $managerRegistry, ObjectConstructorInterface $fallbackConstructor)
    {
        $this->managerRegistry     = $managerRegistry;
        $this->fallbackConstructor = $fallbackConstructor;
    }

    /**
     * {@inheritdoc}
     */
    public function construct(VisitorInterface $visitor, ClassMetadata $metadata, $data, array $type, DeserializationContext $context)
    {
        // Locate possible ObjectManager
        $objectManager = $this->managerRegistry->getManagerForClass($metadata->name);

        if (!$objectManager) {
            // No ObjectManager found, proceed with normal deserialization
            return $this->fallbackConstructor->construct($visitor, $metadata, $data, $type, $context);
        }

        // Locate possible ClassMetadata
        $classMetadataFactory = $objectManager->getMetadataFactory();

        if ($classMetadataFactory->isTransient($metadata->name)) {
            // No ClassMetadata found, proceed with normal deserialization
            return $this->fallbackConstructor->construct($visitor, $metadata, $data, $type, $context);
        }

        // Managed entity, check for proxy load
        if (!is_array($data) && !($data instanceOf \SimpleXMLElement)) {
            // Single identifier, load proxy
            return $objectManager->getReference($metadata->name, $data);
        }

        // Fallback to default constructor if missing identifier(s)
        $classMetadata  = $objectManager->getClassMetadata($metadata->name);
        $identifierList = array();

        foreach ($classMetadata->getIdentifierFieldNames() as $name) {
            if ($data instanceOf \SimpleXMLElement) {
                // Data format source is XML
                $children = $data->children();

                if ($id = $data->xpath('./@' . $name)) {
                    $id = (string) reset($id);

                    $identifierList[$name] = $id;
                } elseif (property_exists($children, $name)) {
                    $identifierList[$name] = (string)$children->{$name};
                } else {
                    return $this->fallbackConstructor->construct($visitor, $metadata, $data, $type, $context);
                }

            } else {
                // Data format source is JSON
                if ( ! array_key_exists($name, $data)) {
                    return $this->fallbackConstructor->construct($visitor, $metadata, $data, $type, $context);
                }

                $identifierList[$name] = $data[$name];
            }
        }

        // Entity update, load it from database
        $object = $objectManager->find($metadata->name, $identifierList);

        $objectManager->initializeObject($object);

        return $object;
    }
}
