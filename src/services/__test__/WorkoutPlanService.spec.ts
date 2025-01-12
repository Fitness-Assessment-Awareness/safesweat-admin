import { afterEach, describe, expect, it, Mock, vi } from 'vitest';
import { Exercise } from '../../types/Exercise';
import { WorkoutPlan } from '../../types/WorkoutPlan';
import { Network } from '../../utils/network/Network';
import { WorkoutDifficulty } from '../../utils/WorkoutPlanUtils';
import {
    createWorkoutPlan,
    deleteWorkoutPlan,
    fetchExercises,
    fetchWorkoutPlans,
    updateWorkoutPlan,
} from '../WorkoutPlanService';

vi.mock('../../utils/network/Network');

describe('WorkoutPlanService', () => {
    const mockWorkoutPlan: WorkoutPlan = {
        planId: '1',
        titleEn: 'Plan 1',
        titleMs: 'Pelan 1',
        estimatedTimeMinute: 30,
        imageUrl: 'http://example.com/image.jpg',
        introductionEn: 'Introduction in English',
        introductionMs: 'Pengenalan dalam Bahasa Malaysia',
        difficulty: WorkoutDifficulty.Beginner,
        workoutPlanExerciseDtos: [],
    };
    const mockExercise: Exercise = { exerciseId: '1', name: 'Exercise 1' };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('fetchWorkoutPlans should return workout plans', async () => {
        (Network.get as Mock).mockResolvedValue({ data: [mockWorkoutPlan] });
        const result = await fetchWorkoutPlans();
        expect(result).toEqual([mockWorkoutPlan]);
        expect(Network.get).toHaveBeenCalledWith('/workout-plan/list');
    });

    it('createWorkoutPlan should create a new workout plan', async () => {
        (Network.post as Mock).mockResolvedValue({ data: mockWorkoutPlan });
        const result = await createWorkoutPlan(mockWorkoutPlan);
        expect(result).toEqual(mockWorkoutPlan);
        expect(Network.post).toHaveBeenCalledWith('/workout-plan', mockWorkoutPlan);
    });

    it('updateWorkoutPlan should update an existing workout plan', async () => {
        (Network.patch as Mock).mockResolvedValue({ data: mockWorkoutPlan });
        const result = await updateWorkoutPlan(mockWorkoutPlan);
        expect(result).toEqual(mockWorkoutPlan);
        expect(Network.patch).toHaveBeenCalledWith('/workout-plan', mockWorkoutPlan);
    });

    it('deleteWorkoutPlan should delete a workout plan', async () => {
        (Network.delete as Mock).mockResolvedValue({});
        await deleteWorkoutPlan('1');
        expect(Network.delete).toHaveBeenCalledWith('/workout-plan/1');
    });

    it('fetchExercises should return exercises', async () => {
        (Network.get as Mock).mockResolvedValue({ data: [mockExercise] });
        const result = await fetchExercises();
        expect(result).toEqual([mockExercise]);
        expect(Network.get).toHaveBeenCalledWith('/workout-plan/exercises');
    });

    it('fetchWorkoutPlans should handle errors', async () => {
        Network.get.mockRejectedValue(new Error('Network Error'));
        await expect(fetchWorkoutPlans()).rejects.toThrow('Network Error');
    });

    it('createWorkoutPlan should handle errors', async () => {
        Network.post.mockRejectedValue(new Error('Network Error'));
        await expect(createWorkoutPlan(mockWorkoutPlan)).rejects.toThrow('Network Error');
    });

    it('updateWorkoutPlan should handle errors', async () => {
        Network.patch.mockRejectedValue(new Error('Network Error'));
        await expect(updateWorkoutPlan(mockWorkoutPlan)).rejects.toThrow('Network Error');
    });

    it('deleteWorkoutPlan should handle errors', async () => {
        Network.delete.mockRejectedValue(new Error('Network Error'));
        await expect(deleteWorkoutPlan('1')).rejects.toThrow('Network Error');
    });

    it('fetchExercises should handle errors', async () => {
        Network.get.mockRejectedValue(new Error('Network Error'));
        await expect(fetchExercises()).rejects.toThrow('Network Error');
    });
});
