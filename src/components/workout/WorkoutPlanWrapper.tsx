import { Button, Group, Modal, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { fetchWorkoutPlans } from '../../services/WorkoutPlanService';
import { WorkoutPlan } from '../../types/WorkoutPlan';
import { WorkoutPlanForm } from './WorkoutPlanForm';
import { WorkoutPlanPaper } from './WorkoutPlanPaper';

export const WorkoutPlanContext = React.createContext<{
    existingWorkoutPlans: WorkoutPlan[];
    setExistingWorkoutPlans: React.Dispatch<React.SetStateAction<WorkoutPlan[]>>;
}>({
    existingWorkoutPlans: [],
    setExistingWorkoutPlans: () => {},
});

export function WorkoutPlanWrapper() {
    const [existingWorkoutPlans, setExistingWorkoutPlans] = useState<WorkoutPlan[]>([]);

    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        fetchWorkoutPlans().then((plans) => setExistingWorkoutPlans(plans));
    }, []);

    return (
        <WorkoutPlanContext.Provider value={{ existingWorkoutPlans, setExistingWorkoutPlans }}>
            <Group
                m={'md'}
                pb={'md'}
                justify="space-between"
            >
                <TextInput
                    size="lg"
                    leftSection={<IconSearch />}
                    placeholder="Search by title or difficulty level"
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

            {existingWorkoutPlans.length > 0 ? (
                existingWorkoutPlans
                    .filter((plan) => {
                        if (searchValue === '') {
                            return plan;
                        } else if (
                            plan.titleEn.toLowerCase().includes(searchValue.toLowerCase()) ||
                            plan.titleMs.toLowerCase().includes(searchValue.toLowerCase()) ||
                            plan.difficulty.toLowerCase().includes(searchValue.toLowerCase())
                        ) {
                            return plan;
                        }
                    })
                    .map((plan) => (
                        <WorkoutPlanPaper
                            key={plan.planId}
                            workoutPlan={plan}
                        />
                    ))
            ) : (
                <Text
                    size="xl"
                    fw={700}
                    ta="center"
                >
                    Uh oh, your workout plan list is empty!
                </Text>
            )}

            <Modal
                opened={modalOpened}
                onClose={closeModal}
                title="New Workout Plan"
                centered
                size={'xl'}
                radius={'md'}
            >
                <WorkoutPlanForm close={closeModal} />
            </Modal>
        </WorkoutPlanContext.Provider>
    );
}
