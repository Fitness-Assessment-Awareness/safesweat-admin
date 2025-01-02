import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import {
    createWorkoutPlan,
    deleteWorkoutPlan as deletePlan,
    updateWorkoutPlan as updatePlan,
} from '../services/WorkoutPlanService';
import { WorkoutPlan } from '../types/WorkoutPlan';
import { deleteFileInBucket, uploadFileToBucket } from './SupabaseUtils';

export const WORKOUT_PLAN_FORM_KEY = {
    TITLE_EN: 'titleEn',
    TITLE_MS: 'titleMs',
    ESTIMATED_TIME_MINUTE: 'estimatedTimeMinute',
    INTRODUCTION_EN: 'introductionEn',
    INTRODUCTION_MS: 'introductionMs',
    DIFFICULTY: 'difficulty',
    EXERCISE_LIST: 'exerciseList',
    EXERCISE_ID: 'exerciseId',
    ESTIMATED_TIME_SECOND: 'estimatedTimeSecond',
    REP_COUNT: 'repCount',
    IMAGE_FILE: 'imageFile',
};

export const NEW_EXERCISE = {
    planId: '',
    exerciseId: '',
    estimatedTimeSecond: null,
    repCount: null,
};

export enum WorkoutDifficulty {
    Beginner = 'Beginner',
    Intermediate = 'Intermediate',
    Advanced = 'Advanced',
}

export const WORKOUT_PLAN_BUCKET = 'workout-plan';

export type WorkoutPlanFormType = {
    planId?: string;
    titleEn: string;
    titleMs: string;
    estimatedTimeMinute: number;
    introductionEn: string;
    introductionMs: string;
    difficulty: WorkoutDifficulty;
    exerciseList: {
        id: string;
        planId?: string;
        exerciseId: string;
        estimatedTimeSecond?: number | null;
        repCount?: number | null;
    }[];
    imageFile: File | null;
};

export const getWorkoutPlanForm = (initialValue?: WorkoutPlanFormType) => {
    const form = useForm<WorkoutPlanFormType>({
        mode: 'uncontrolled',
        initialValues: initialValue
            ? { ...initialValue }
            : {
                  titleEn: '',
                  titleMs: '',
                  estimatedTimeMinute: 1,
                  introductionEn: '',
                  introductionMs: '',
                  difficulty: WorkoutDifficulty.Beginner,
                  exerciseList: [{ id: randomId(), ...NEW_EXERCISE }],
                  imageFile: null,
              },
        validate: {
            imageFile: (value) => (value ? null : 'Please upload an image'),
            exerciseList: (value) => {
                if (value.length === 0) {
                    return 'Please add at least one exercise';
                }
                for (let i = 0; i < value.length; i++) {
                    if (!value[i].exerciseId) {
                        return `Exercise ${i + 1} has no selected exercise`;
                    }
                }
                return null;
            },
        },
    });
    return form;
};

export const createNewWorkoutPlan = async (formValue: WorkoutPlanFormType) => {
    if (!formValue.imageFile) {
        return null;
    }
    const uploadedUrl = await uploadFileToBucket(WORKOUT_PLAN_BUCKET, formValue.imageFile as File);
    if (uploadedUrl) {
        const workoutPlan: WorkoutPlan = {
            titleEn: formValue.titleEn,
            titleMs: formValue.titleMs,
            estimatedTimeMinute: formValue.estimatedTimeMinute,
            imageUrl: uploadedUrl,
            introductionEn: formValue.introductionEn,
            introductionMs: formValue.introductionMs,
            difficulty: formValue.difficulty,
            workoutPlanExerciseDtos: formValue.exerciseList,
        };
        return await createWorkoutPlan(workoutPlan);
    }
};

export const updateWorkoutPlan = async (formValue: WorkoutPlanFormType, oldImgReplaced: boolean, oldImgUrl: string) => {
    if (!formValue.imageFile) {
        return null;
    }
    const workoutPlan: WorkoutPlan = {
        planId: formValue.planId,
        titleEn: formValue.titleEn,
        titleMs: formValue.titleMs,
        estimatedTimeMinute: formValue.estimatedTimeMinute,
        imageUrl: oldImgUrl,
        introductionEn: formValue.introductionEn,
        introductionMs: formValue.introductionMs,
        difficulty: formValue.difficulty,
        workoutPlanExerciseDtos: formValue.exerciseList,
    };
    if (oldImgReplaced) {
        deleteFileInBucket(WORKOUT_PLAN_BUCKET, oldImgUrl.split(`${WORKOUT_PLAN_BUCKET}/`)[1]);
        const newUrl = await uploadFileToBucket(WORKOUT_PLAN_BUCKET, formValue.imageFile as File);
        if (newUrl) {
            workoutPlan.imageUrl = newUrl;
        }
    }
    return await updatePlan(workoutPlan);
};

export const deleteWorkoutPlan = async (workoutPlan: WorkoutPlan) => {
    if (workoutPlan.planId) {
        const path = workoutPlan.imageUrl.split(`${WORKOUT_PLAN_BUCKET}/`)[1];
        deleteFileInBucket(WORKOUT_PLAN_BUCKET, path);
        await deletePlan(workoutPlan.planId);
    }
};
