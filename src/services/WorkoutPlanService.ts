import { WorkoutPlan } from '../types/WorkoutPlan';
import { Network } from '../utils/network/Network';
import { Exercise } from '../types/Exercise';

const BASE_URL = '/workout-plan';

export const fetchWorkoutPlans = async () => {
    const response = await Network.get<WorkoutPlan[]>(`${BASE_URL}/list`);
    return response.data as WorkoutPlan[];
};

export const createWorkoutPlan = async (workoutPlan: WorkoutPlan) => {
    const response = await Network.post<WorkoutPlan>(BASE_URL, workoutPlan);
    return response.data as WorkoutPlan;
};

export const updateWorkoutPlan = async (workoutPlan: WorkoutPlan) => {
    const response = await Network.patch<WorkoutPlan>(BASE_URL, workoutPlan);
    return response.data as WorkoutPlan;
};

export const deleteWorkoutPlan = async (planId: string) => {
    await Network.delete(`${BASE_URL}/${planId}`);
};

export const fetchExercises = async () => {
    const response = await Network.get<Exercise[]>(`${BASE_URL}/exercises`);
    return response.data as Exercise[];
};
