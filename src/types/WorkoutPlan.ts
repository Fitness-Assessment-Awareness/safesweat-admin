
import { WorkoutDifficulty } from '../utils/WorkoutPlanUtils';
import { WorkoutPlanExercise } from './WorkoutPlanExercise';

export type WorkoutPlan = {
    planId?: string;
    titleEn: string;
    titleMs: string;
    estimatedTimeMinute: number;
    imageUrl: string;
    introductionEn: string;
    introductionMs: string;
    difficulty: WorkoutDifficulty;
    workoutPlanExerciseDtos: WorkoutPlanExercise[];
};
