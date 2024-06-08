import { ActionIcon, Badge, Box, Group, Image, Menu, Modal, Paper, ScrollArea, Stack, Text, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconClock, IconDots, IconEdit, IconTargetArrow, IconTrash } from '@tabler/icons-react';
import { useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { WorkoutPlan } from '../../types/WorkoutPlan';
import { convertSupabaseBucketUrlToFile } from '../../utils/FileUtils';
import {
    WORKOUT_PLAN_BUCKET,
    WorkoutPlanFormType,
    deleteWorkoutPlan as deletePlan,
} from '../../utils/WorkoutPlanUtils';
import { WorkoutPlanForm } from './WorkoutPlanForm';
import { WorkoutPlanContext } from './WorkoutPlanWrapper';

type ComponentProps = {
    workoutPlan: WorkoutPlan;
};

export function WorkoutPlanPaper({ workoutPlan }: ComponentProps) {
    const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

    const { existingWorkoutPlans, setExistingWorkoutPlans } = useContext(WorkoutPlanContext);

    const [initialFormValue, setInitialFormValue] = useState<WorkoutPlanFormType | null>(null);

    const editWorkoutPlan = async () => {
        const imageFile = await convertSupabaseBucketUrlToFile(WORKOUT_PLAN_BUCKET, workoutPlan.imageUrl);
        setInitialFormValue({
            planId: workoutPlan.planId,
            imageFile,
            titleEn: workoutPlan.titleEn,
            titleMs: workoutPlan.titleMs,
            estimatedTimeMinute: workoutPlan.estimatedTimeMinute,
            introductionEn: workoutPlan.introductionEn,
            introductionMs: workoutPlan.introductionMs,
            difficulty: workoutPlan.difficulty,
            exerciseList: workoutPlan.workoutPlanExerciseDtos.map((exercise) => ({
                ...exercise,
                id: uuid(),
            })),
        });
        openEditModal();
    };

    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: 'Delete workout plan',
            centered: true,
            children: (
                <Text size="sm">Are you sure you want to delete? This action is destructive and irreversible.</Text>
            ),
            labels: { confirm: 'Delete', cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onCancel: () => {},
            onConfirm: deleteWorkoutPlan,
        });

    const deleteWorkoutPlan = async () => {
        await deletePlan(workoutPlan);
        setExistingWorkoutPlans(existingWorkoutPlans.filter((plan) => plan.planId !== workoutPlan.planId));
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
                        src={workoutPlan.imageUrl}
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
                                {workoutPlan.titleEn}
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
                                {workoutPlan.titleMs}
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
                            <Text>{workoutPlan.introductionEn}</Text>
                            <Badge
                                color="orange"
                                variant="outline"
                                mt={20}
                            >
                                Malay Content
                            </Badge>
                            <Text>{workoutPlan.introductionMs}</Text>
                        </ScrollArea>
                        <Group gap={'xs'}>
                            <IconClock />
                            <Text fs="italic">{workoutPlan.estimatedTimeMinute} mins</Text>
                            <IconTargetArrow />
                            <Text fs="italic">
                                {workoutPlan.difficulty.slice(0, 1) + workoutPlan.difficulty.slice(1).toLowerCase()}
                            </Text>
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
                            onClick={editWorkoutPlan}
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
                title="Edit Workout Plan"
                centered
                size={'xl'}
                radius={'md'}
            >
                {initialFormValue && (
                    <WorkoutPlanForm
                        close={closeEditModal}
                        initialFormValue={initialFormValue}
                        initialImageUrl={workoutPlan.imageUrl}
                    />
                )}
            </Modal>
        </Paper>
    );
}
