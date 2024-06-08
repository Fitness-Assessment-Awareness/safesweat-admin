import { CheckIcon, CloseButton, Group, NumberInput, Paper, Radio, Select, rem } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconChevronDown } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Exercise } from '../../types/Exercise';
import { WORKOUT_PLAN_FORM_KEY, WorkoutPlanFormType } from '../../utils/WorkoutPlanUtils';

type ComponentProps = {
    index: number;
    FORM: UseFormReturnType<WorkoutPlanFormType>;
    dbExercises: Exercise[];
};

export function ExercisePaper({ index, FORM, dbExercises }: ComponentProps) {
    const { EXERCISE_LIST, EXERCISE_ID, ESTIMATED_TIME_SECOND, REP_COUNT } = WORKOUT_PLAN_FORM_KEY;

    const exercise = FORM.getValues().exerciseList[index];

    const [radioValue, setRadioValue] = useState<string>(
        exercise.estimatedTimeSecond ? ESTIMATED_TIME_SECOND : REP_COUNT,
    );

    const [exerciseIdSelect, setExerciseIdSelect] = useState<string | null>(exercise.exerciseId ? exercise.exerciseId : null);

    useEffect(() => {
        radioValue !== REP_COUNT
            ? FORM.setFieldValue(`${EXERCISE_LIST}.${index}.${REP_COUNT}`, null)
            : FORM.setFieldValue(`${EXERCISE_LIST}.${index}.${ESTIMATED_TIME_SECOND}`, null);
    }, [radioValue]);

    return (
        <Paper
            shadow="sm"
            p={'lg'}
            radius="md"
            withBorder
        >
            <Group
                justify="space-between"
                align="flex-start"
            >
                <Select
                    required
                    rightSection={<IconChevronDown style={{ width: rem(16), height: rem(16) }} />}
                    w={'90%'}
                    label="Exercise"
                    searchable
                    value={exerciseIdSelect}
                    key={FORM.key(`${EXERCISE_LIST}.${index}.${EXERCISE_ID}`)}
                    {...FORM.getInputProps(`${EXERCISE_LIST}.${index}.${EXERCISE_ID}`)}
                    onChange={(value) => {
                        setExerciseIdSelect(value);
                        FORM.setFieldValue(`${EXERCISE_LIST}.${index}.${EXERCISE_ID}`, value);
                    }}
                    data={dbExercises.map((exercise) => ({
                        label: exercise.name,
                        value: exercise.exerciseId,
                    }))}
                />
                <CloseButton onClick={() => FORM.removeListItem(EXERCISE_LIST, index)} />
            </Group>

            <Radio.Group
                w={'90%'}
                required
                onChange={setRadioValue}
                value={radioValue}
            >
                <Group mt="xs">
                    <Radio
                        value={REP_COUNT}
                        label="Repeat Count"
                        icon={CheckIcon}
                    />

                    <NumberInput
                        w={'15%'}
                        placeholder="count"
                        allowDecimal={false}
                        clampBehavior="strict"
                        min={1}
                        max={500}
                        prefix="x "
                        hideControls={true}
                        value={exercise.repCount}
                        required={radioValue === REP_COUNT}
                        disabled={!(radioValue === REP_COUNT)}
                        key={radioValue === REP_COUNT ? FORM.key(`${EXERCISE_LIST}.${index}.${REP_COUNT}`) : ''}
                        {...FORM.getInputProps(`${EXERCISE_LIST}.${index}.${REP_COUNT}`, {
                            withFocus: false,
                        })}
                    />
                    <Radio
                        value={ESTIMATED_TIME_SECOND}
                        label="Estimated Done Time (Seconds)"
                        icon={CheckIcon}
                    />

                    <NumberInput
                        w={'15%'}
                        allowDecimal={false}
                        clampBehavior="strict"
                        min={1}
                        max={500}
                        placeholder="second"
                        suffix=" s"
                        hideControls={true}
                        value={exercise.estimatedTimeSecond}
                        required={radioValue === ESTIMATED_TIME_SECOND}
                        disabled={!(radioValue === ESTIMATED_TIME_SECOND)}
                        key={
                            radioValue === ESTIMATED_TIME_SECOND
                                ? FORM.key(`${EXERCISE_LIST}.${index}.${ESTIMATED_TIME_SECOND}`)
                                : ''
                        }
                        {...FORM.getInputProps(`${EXERCISE_LIST}.${index}.${ESTIMATED_TIME_SECOND}`, {
                            withFocus: false,
                        })}
                    />
                </Group>
            </Radio.Group>
        </Paper>
    );
}
