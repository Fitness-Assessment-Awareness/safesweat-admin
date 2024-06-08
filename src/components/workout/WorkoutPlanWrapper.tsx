import { Button, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
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

    useEffect(() => {
        fetchWorkoutPlans().then((plans) => setExistingWorkoutPlans(plans));
    }, []);

    return (
        <WorkoutPlanContext.Provider value={{ existingWorkoutPlans, setExistingWorkoutPlans }}>
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

            {existingWorkoutPlans.length > 0 ? (
                existingWorkoutPlans.map((plan) => (
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
