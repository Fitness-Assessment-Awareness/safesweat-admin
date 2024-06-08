import { useForm } from '@mantine/form';
import {
    createEducationResource,
    deleteEducationResource as deleteEduResource,
    updateEducationResource as updateEduResource,
} from '../services/EducationResourceService';
import { EducationResource } from '../types/EducationResource';
import { deleteFileInBucket, uploadFileToBucket } from './SupabaseUtils';

export const EDUCATION_RESOURCE_FORM_KEY = {
    TITLE_EN: 'titleEn',
    TITLE_MS: 'titleMs',
    CONTENT_EN: 'contentEn',
    CONTENT_MS: 'contentMs',
    CATEGORY_ID: 'categoryId',
    CREATED_BY: 'createdBy',
    IMAGE_FILE: 'imageFile',
    LAST_UPDATED_BY: 'lastUpdatedBy',
};

export const EDUCATION_RESOURCE_BUCKET = 'education-resource';

export type EducationResourceFormType = {
    postId?: string;
    titleEn: string;
    titleMs: string;
    contentEn: string;
    contentMs: string;
    createdBy: string;
    categoryId: string | null;
    imageFile: File | null;
    lastUpdatedBy?: string;
};

export const getEducationResourceForm = (initialValue?: EducationResourceFormType) => {
    const form = useForm<EducationResourceFormType>({
        mode: 'uncontrolled',
        initialValues: initialValue
            ? { ...initialValue }
            : {
                  titleEn: '',
                  titleMs: '',
                  contentEn: '',
                  contentMs: '',
                  createdBy: '',
                  categoryId: '',
                  imageFile: null,
              },
        validate: {
            imageFile: (value) => (value ? null : 'Please upload an image'),
            categoryId: (value) => (value ? null : 'Please select a category'),
        },
    });
    return form;
};

export const createNewEducationResource = async (formValue: EducationResourceFormType) => {
    if (!formValue.imageFile) {
        return null;
    }
    const uploadedUrl = await uploadFileToBucket(EDUCATION_RESOURCE_BUCKET, formValue.imageFile as File);
    if (uploadedUrl) {
        const educationResource: EducationResource = {
            titleEn: formValue.titleEn,
            titleMs: formValue.titleMs,
            contentEn: formValue.contentEn,
            contentMs: formValue.contentMs,
            imageUrl: uploadedUrl,
            createdBy: formValue.createdBy,
            categoryId: formValue.categoryId as string,
        };
        return await createEducationResource(educationResource);
    }
};

export const updateEducationResource = async (
    formValue: EducationResourceFormType,
    oldImgReplaced: boolean,
    oldImgUrl: string,
) => {
    if (!formValue.imageFile) {
        return null;
    }
    const educationResource: EducationResource = {
        postId: formValue.postId,
        titleEn: formValue.titleEn,
        titleMs: formValue.titleMs,
        contentEn: formValue.contentEn,
        contentMs: formValue.contentMs,
        imageUrl: oldImgUrl,
        createdBy: formValue.createdBy,
        categoryId: formValue.categoryId as string,
        lastUpdatedBy: formValue.lastUpdatedBy,
    };
    if (oldImgReplaced) {
        deleteFileInBucket(EDUCATION_RESOURCE_BUCKET, oldImgUrl.split(`${EDUCATION_RESOURCE_BUCKET}/`)[1]);
        const newUrl = await uploadFileToBucket(EDUCATION_RESOURCE_BUCKET, formValue.imageFile as File);
        if (newUrl) {
            educationResource.imageUrl = newUrl;
        }
    }
    return await updateEduResource(educationResource);
};

export const deleteEducationResource = async (educationResource: EducationResource) => {
    if (educationResource.postId) {
        const path = educationResource.imageUrl.split(`${EDUCATION_RESOURCE_BUCKET}/`)[1];
        deleteFileInBucket(EDUCATION_RESOURCE_BUCKET, path);
        await deleteEduResource(educationResource.postId);
    }
};
