import {
    Button,
    FileInput,
    Group,
    Image,
    Loader,
    NativeSelect,
    NumberInput,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Textarea,
    rem,
} from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import { fetchExercises } from '../../services/WorkoutPlanService';
import { Exercise } from '../../types/Exercise';
import { convertFileToUrl } from '../../utils/FileUtils';
import {
    NEW_EXERCISE,
    WORKOUT_PLAN_FORM_KEY,
    WorkoutDifficulty,
    WorkoutPlanFormType,
    createNewWorkoutPlan,
    getWorkoutPlanForm,
    updateWorkoutPlan,
} from '../../utils/WorkoutPlanUtils';
import { ExercisePaper } from '../exercise/ExercisePaper';
import { WorkoutPlanContext } from './WorkoutPlanWrapper';

type ComponentProps = {
    close: VoidFunction;
    initialFormValue?: WorkoutPlanFormType;
    initialImageUrl?: string;
};

const {
    TITLE_EN,
    TITLE_MS,
    ESTIMATED_TIME_MINUTE,
    INTRODUCTION_EN,
    INTRODUCTION_MS,
    DIFFICULTY,
    EXERCISE_LIST,
    IMAGE_FILE,
} = WORKOUT_PLAN_FORM_KEY;

export function WorkoutPlanForm({ close, initialFormValue, initialImageUrl }: ComponentProps) {
    const { existingWorkoutPlans, setExistingWorkoutPlans } = useContext(WorkoutPlanContext);

    const [displayImg, setDisplayImg] = useState<string>('');

    const [dbExercises, setDbExercises] = useState<Exercise[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchExercises().then((exercises) => setDbExercises(exercises));
        if (initialImageUrl) {
            setDisplayImg(initialImageUrl);
        }
    }, []);

    const FORM = getWorkoutPlanForm(initialFormValue);

    const handleFormSubmit = async () => {
        if (!FORM.validate().hasErrors) {
            setLoading(true);
            let formValue: WorkoutPlanFormType = FORM.getValues();
            if (formValue) {
                if (!initialFormValue) {
                    const newPlan = await createNewWorkoutPlan(formValue);
                    if (newPlan) {
                        setExistingWorkoutPlans([...existingWorkoutPlans, newPlan]);
                        close();
                    }
                } else {
                    const updatedPlan = await updateWorkoutPlan(
                        formValue,
                        displayImg.includes('data:'),
                        initialImageUrl as string,
                    );
                    if (updatedPlan) {
                        const updatedPlans = existingWorkoutPlans.map((plan) => {
                            if (plan.planId === updatedPlan.planId) {
                                return updatedPlan;
                            }
                            return plan;
                        });
                        setExistingWorkoutPlans(updatedPlans);
                        close();
                    }
                }
            }
        }
    };

    const handleImgChange = async (uploadedFile: File | null) => {
        FORM.setValues({
            imageFile: uploadedFile,
        });
        if (!uploadedFile) {
            setDisplayImg('');
            return;
        }
        const url = await convertFileToUrl(uploadedFile as File);
        setDisplayImg(url);
    };

    return (
        <>
            <form
                style={{ position: 'relative' }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleFormSubmit();
                }}
            >
                <SimpleGrid
                    cols={2}
                    p={'md'}
                    spacing={'md'}
                >
                    <TextInput
                        required
                        label="English Title"
                        placeholder="Enter here..."
                        key={FORM.key(TITLE_EN)}
                        {...FORM.getInputProps(TITLE_EN)}
                    />

                    <TextInput
                        required
                        label="Malay Title"
                        placeholder="Enter here..."
                        key={FORM.key(TITLE_MS)}
                        {...FORM.getInputProps(TITLE_MS)}
                    />

                    <Textarea
                        required
                        label="English Introduction"
                        placeholder="Enter here..."
                        key={FORM.key(INTRODUCTION_EN)}
                        {...FORM.getInputProps(INTRODUCTION_EN)}
                    />

                    <Textarea
                        required
                        label="Malay Introduction"
                        placeholder="Enter here..."
                        key={FORM.key(INTRODUCTION_MS)}
                        {...FORM.getInputProps(INTRODUCTION_MS)}
                    />

                    <NumberInput
                        required
                        label="Estimated Done Time (Minutes)"
                        placeholder="Enter here..."
                        allowDecimal={false}
                        clampBehavior="strict"
                        min={1}
                        max={500}
                        suffix=" mins"
                        hideControls={true}
                        key={FORM.key(ESTIMATED_TIME_MINUTE)}
                        {...FORM.getInputProps(ESTIMATED_TIME_MINUTE)}
                    />

                    <NativeSelect
                        required
                        label="Difficulty Level"
                        rightSection={<IconChevronDown style={{ width: rem(16), height: rem(16) }} />}
                        data={[
                            { label: 'Beginner', value: WorkoutDifficulty.Beginner },
                            { label: 'Intermediate', value: WorkoutDifficulty.Intermediate },
                            { label: 'Advanced', value: WorkoutDifficulty.Advanced },
                        ]}
                        key={FORM.key(DIFFICULTY)}
                        {...FORM.getInputProps(DIFFICULTY)}
                    />
                </SimpleGrid>

                <Stack
                    px={'md'}
                    bg="var(--mantine-color-body)"
                    align="stretch"
                    justify="center"
                    gap="md"
                >
                    <FileInput
                        required
                        clearable
                        label="Image"
                        accept="image/png,image/jpeg"
                        placeholder="Upload workout plan image"
                        key={FORM.key(IMAGE_FILE)}
                        {...FORM.getInputProps(IMAGE_FILE)}
                        onChange={handleImgChange}
                    />
                    {displayImg && (
                        <Image
                            src={displayImg}
                            alt="Uploaded"
                            radius={'md'}
                            h={200}
                            w="auto"
                            fit="contain"
                        />
                    )}
                    <Button
                        variant="outline"
                        color="blue"
                        onClick={() => FORM.insertListItem(EXERCISE_LIST, { ...NEW_EXERCISE, id: randomId() })}
                    >
                        Add Exercise
                    </Button>
                    {FORM.getValues().exerciseList.length > 0 ? (
                        FORM.getValues().exerciseList.map((exercise, index) => (
                            <ExercisePaper
                                key={exercise.id}
                                index={index}
                                FORM={FORM}
                                dbExercises={dbExercises}
                            />
                        ))
                    ) : (
                        <Text c="red">Please add at least one exercise</Text>
                    )}
                </Stack>

                <Group
                    justify="flex-end"
                    mt="md"
                >
                    <Button
                        type="submit"
                        color="blue"
                    >
                        {loading ? (
                            <Loader
                                size={'xs'}
                                color="white"
                            />
                        ) : initialFormValue ? (
                            'Edit'
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </Group>
            </form>
        </>
    );
}
