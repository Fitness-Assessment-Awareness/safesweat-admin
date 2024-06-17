import { Button, Group, Modal, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch } from '@tabler/icons-react';
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

    const [searchValue, setSearchValue] = useState('');

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
                justify="space-between"
            >
                <TextInput
                    size="lg"
                    leftSection={<IconSearch />}
                    placeholder="Search by title or category"
                    radius={'md'}
                    w={'80%'}
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.currentTarget.value)}
                />

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
                existingEducationResources
                    .filter((resource) => {
                        if (searchValue === '') {
                            return resource;
                        } else if (
                            resource.titleEn.toLowerCase().includes(searchValue.toLowerCase()) ||
                            resource.titleMs.toLowerCase().includes(searchValue.toLowerCase()) ||
                            resource.categoryDto?.name.toLowerCase().includes(searchValue.toLowerCase())
                        ) {
                            return resource;
                        }
                    })
                    .map((resource) => (
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
