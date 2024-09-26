import {
    Button,
    FileInput,
    Group,
    Image,
    Loader,
    Select,
    SimpleGrid,
    Stack,
    TextInput,
    Textarea,
    rem,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import { fetchEducationCategories } from '../../services/EducationResourceService';
import { EducationCategory } from '../../types/EducationCategory';
import {
    EDUCATION_RESOURCE_FORM_KEY,
    EducationResourceFormType,
    createNewEducationResource,
    getEducationResourceForm,
    updateEducationResource,
} from '../../utils/EducationResourceUtils';
import { convertFileToUrl } from '../../utils/FileUtils';
import { EducationResourceContext } from './EducationalResourceWrapper';

type ComponentProps = {
    close: VoidFunction;
    initialFormValue?: EducationResourceFormType;
    initialImageUrl?: string;
};

const { TITLE_EN, TITLE_MS, CONTENT_EN, CONTENT_MS, CATEGORY_ID, CREATED_BY, IMAGE_FILE, LAST_UPDATED_BY } =
    EDUCATION_RESOURCE_FORM_KEY;

export function EducationResourceForm({ close, initialFormValue, initialImageUrl }: ComponentProps) {
    const { existingEducationResources, setExistingEducationResources } = useContext(EducationResourceContext);

    const [displayImg, setDisplayImg] = useState<string>('');

    const [dbEducationCategories, setDbEducationCategories] = useState<EducationCategory[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const [categoryIdSelect, setCategoryIdSelect] = useState<string | null>(
        initialFormValue?.categoryId ? initialFormValue.categoryId : null,
    );

    useEffect(() => {
        fetchEducationCategories().then((categories) => setDbEducationCategories(categories));
        if (initialImageUrl) {
            setDisplayImg(initialImageUrl);
        }
    }, []);

    const FORM = getEducationResourceForm(initialFormValue);

    const handleFormSubmit = async () => {
        if (!FORM.validate().hasErrors) {
            setLoading(true);
            let formValue: EducationResourceFormType = FORM.getValues();
            if (formValue) {
                if (!initialFormValue) {
                    const newPlan = await createNewEducationResource(formValue);
                    if (newPlan) {
                        newPlan.categoryDto = dbEducationCategories.filter(
                            (category) => category.categoryId === newPlan.categoryId,
                        )[0];
                        newPlan.educationPostLikeDtos = [];
                        setExistingEducationResources([...existingEducationResources, newPlan]);
                        close();
                    }
                } else {
                    const updatedResource = await updateEducationResource(
                        formValue,
                        displayImg.includes('data:'),
                        initialImageUrl as string,
                    );
                    if (updatedResource) {
                        updatedResource.categoryDto = dbEducationCategories.filter(
                            (category) => category.categoryId === updatedResource.categoryId,
                        )[0];
                        const updatedResources = existingEducationResources.map((resource) => {
                            if (resource.postId === updatedResource.postId) {
                                return updatedResource;
                            }
                            return resource;
                        });
                        setExistingEducationResources(updatedResources);
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
                        label="English Content"
                        placeholder="Enter here..."
                        key={FORM.key(CONTENT_EN)}
                        {...FORM.getInputProps(CONTENT_EN)}
                    />

                    <Textarea
                        required
                        label="Malay Introduction"
                        placeholder="Enter here..."
                        key={FORM.key(CONTENT_MS)}
                        {...FORM.getInputProps(CONTENT_MS)}
                    />

                    <Select
                        required
                        rightSection={<IconChevronDown style={{ width: rem(16), height: rem(16) }} />}
                        w={'90%'}
                        label="Category"
                        searchable
                        value={categoryIdSelect}
                        key={FORM.key(CATEGORY_ID)}
                        {...FORM.getInputProps(CATEGORY_ID)}
                        onChange={(value) => {
                            setCategoryIdSelect(value);
                            FORM.setValues({
                                categoryId: value,
                            });
                        }}
                        data={dbEducationCategories.map((category) => ({
                            label: category.name,
                            value: category.categoryId,
                        }))}
                    />

                    <TextInput
                        required
                        label={initialFormValue ? 'Updated by' : 'Created by'}
                        placeholder="Enter here..."
                        key={FORM.key(initialFormValue ? LAST_UPDATED_BY : CREATED_BY)}
                        {...FORM.getInputProps(initialFormValue ? LAST_UPDATED_BY : CREATED_BY)}
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
