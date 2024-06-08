import { Button, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { fetchEducationResources } from '../../services/EducationResourceService';
import { EducationResource } from '../../types/EducationResource';
import { EducationResourceForm } from './EducationResourceForm';
import { EducationResourcePaper } from './EducationResourcePaper';

export const EducationResourceContext = React.createContext<{
    existingEducationResources: EducationResource[];
    setExistingEducationResources: React.Dispatch<React.SetStateAction<EducationResource[]>>;
}>({
    existingEducationResources: [],
    setExistingEducationResources: () => {},
});

export function EducationalResourceWrapper() {
    const [existingEducationResources, setExistingEducationResources] = useState<EducationResource[]>([]);

    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

    useEffect(() => {
        fetchEducationResources().then((educationResources) => setExistingEducationResources(educationResources));
    }, []);

    return (
        <EducationResourceContext.Provider
            value={{
                existingEducationResources,
                setExistingEducationResources,
            }}
        >
            <Group
                m={'md'}
                pb={'md'}
                justify="flex-end"
            >
                <Button
                    leftSection={<IconPlus />}
                    onClick={openModal}
                    variant="filled"
                    color={'blue'}
                >
                    Create New
                </Button>
            </Group>

            {existingEducationResources.length > 0 ? (
                existingEducationResources.map((resource) => (
                    <EducationResourcePaper
                        key={resource.postId}
                        educationResource={resource}
                    />
                ))
            ) : (
                <Text
                    size="xl"
                    fw={700}
                    ta="center"
                >
                    Uh oh, your education resources list is empty!
                </Text>
            )}

            <Modal
                opened={modalOpened}
                onClose={closeModal}
                title="New Educational Resource"
                centered
                size={'xl'}
                radius={'md'}
            >
                <EducationResourceForm close={closeModal} />
            </Modal>
        </EducationResourceContext.Provider>
    );
}
