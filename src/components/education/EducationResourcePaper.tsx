import {
    ActionIcon,
    Badge,
    Box,
    Group,
    Image,
    Menu,
    Modal,
    Paper,
    ScrollArea,
    Stack,
    Text,
    Tooltip,
    rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconCategory, IconDots, IconEdit, IconThumbUp, IconTrash, IconUser } from '@tabler/icons-react';
import { useContext, useState } from 'react';
import { EducationResource } from '../../types/EducationResource';
import {
    EDUCATION_RESOURCE_BUCKET,
    EducationResourceFormType,
    deleteEducationResource as deleteEduResource,
} from '../../utils/EducationResourceUtils';
import { convertSupabaseBucketUrlToFile } from '../../utils/FileUtils';
import { EducationResourceForm } from './EducationResourceForm';
import { EducationResourceContext } from './EducationalResourceWrapper';

type ComponentProps = {
    educationResource: EducationResource;
};

export function EducationResourcePaper({ educationResource }: ComponentProps) {
    const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

    const { existingEducationResources, setExistingEducationResources } = useContext(EducationResourceContext);

    const [initialFormValue, setInitialFormValue] = useState<EducationResourceFormType | null>(null);

    const editEducationResource = async () => {
        const imageFile = await convertSupabaseBucketUrlToFile(EDUCATION_RESOURCE_BUCKET, educationResource.imageUrl);
        setInitialFormValue({
            postId: educationResource.postId,
            titleEn: educationResource.titleEn,
            titleMs: educationResource.titleMs,
            contentEn: educationResource.contentEn,
            contentMs: educationResource.contentMs,
            imageFile: imageFile,
            createdBy: educationResource.createdBy,
            categoryId: educationResource.categoryId,
            lastUpdatedBy: '',
        });
        openEditModal();
    };

    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: 'Delete education resource',
            centered: true,
            children: (
                <Text size="sm">Are you sure you want to delete? This action is destructive and irreversible.</Text>
            ),
            labels: { confirm: 'Delete', cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onCancel: () => {},
            onConfirm: deleteEducationResource,
        });

    const deleteEducationResource = async () => {
        await deleteEduResource(educationResource);
        setExistingEducationResources(
            existingEducationResources.filter((resource) => resource.postId !== educationResource.postId),
        );
    };

    return (
        <Paper
            shadow="sm"
            m="md"
            p="md"
            radius={'md'}
            withBorder
        >
            <Group
                align="space-between"
                gap={'xs'}
            >
                <Group
                    align="flex-start"
                    w={'95%'}
                >
                    <Image
                        radius="md"
                        w={'45%'}
                        h={250}
                        fit="contain"
                        src={educationResource.imageUrl}
                    />
                    <Stack
                        w={'55%'}
                        h={250}
                        align="stretch"
                        justify="space-between"
                        gap="lg"
                    >
                        <Box>
                            <Text
                                span
                                fw={700}
                                size="lg"
                            >
                                {educationResource.titleEn}
                            </Text>
                            <Badge
                                color="grape"
                                variant="outline"
                                mx={10}
                            >
                                En
                            </Badge>
                            <Text
                                span
                                fw={700}
                                size="lg"
                            >
                                {educationResource.titleMs}
                            </Text>
                            <Badge
                                color="orange"
                                variant="outline"
                                mx={10}
                            >
                                Ms
                            </Badge>
                        </Box>
                        <ScrollArea
                            h={'55%'}
                            scrollHideDelay={300}
                        >
                            <Badge
                                color="grape"
                                variant="outline"
                            >
                                English Content
                            </Badge>
                            <Text>{educationResource.contentEn}</Text>
                            <Badge
                                color="orange"
                                variant="outline"
                                mt={20}
                            >
                                Malay Content
                            </Badge>
                            <Text>{educationResource.contentMs}</Text>
                        </ScrollArea>
                        <Group gap={'md'}>
                            <Group gap={'xs'}>
                                <IconCategory />
                                <Text fs="italic">{educationResource.categoryDto?.name}</Text>
                                <IconThumbUp />
                                <Text fs="italic">{educationResource.educationPostLikeDtos?.length}</Text>
                                <IconUser />
                                <Tooltip
                                    label={new Date(educationResource.createdDate as Date)?.toLocaleDateString(
                                        'en-US',
                                        {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        },
                                    )}
                                    color="gray"
                                >
                                    <Text fs="italic">Created by {educationResource.createdBy}</Text>
                                </Tooltip>
                                {educationResource.lastUpdatedBy && (
                                    <>
                                        <IconEdit />
                                        <Tooltip
                                            label={new Date(
                                                educationResource.lastUpdatedDate as Date,
                                            )?.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                            color="gray"
                                        >
                                            <Text fs="italic"> Last Updated by {educationResource.lastUpdatedBy}</Text>
                                        </Tooltip>
                                    </>
                                )}
                            </Group>
                        </Group>
                    </Stack>
                </Group>
                <Menu
                    withinPortal
                    position="bottom-end"
                    shadow="sm"
                    trigger="hover"
                >
                    <Menu.Target>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                        >
                            <IconDots style={{ width: rem(16), height: rem(16) }} />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            onClick={editEducationResource}
                            leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                        >
                            Edit Detail
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                            color="red"
                            onClick={openDeleteModal}
                        >
                            Delete
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>

            <Modal
                opened={editModalOpened}
                onClose={closeEditModal}
                title="Edit Education Resource"
                centered
                size={'xl'}
                radius={'md'}
            >
                {initialFormValue && (
                    <EducationResourceForm
                        close={closeEditModal}
                        initialFormValue={initialFormValue}
                        initialImageUrl={educationResource.imageUrl}
                    />
                )}
            </Modal>
        </Paper>
    );
}
