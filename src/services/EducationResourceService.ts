import { EducationCategory } from "../types/EducationCategory";
import { EducationResource } from "../types/EducationResource";
import { Network } from '../utils/network/Network';

export const fetchEducationResources = async () => {
    const response = await Network.get<EducationResource[]>("/education-post/list");
    return response.data as EducationResource[];
}

export const createEducationResource = async (educationResource: EducationResource) => {
    const response = await Network.post<EducationResource>("/education-post", educationResource);
    return response.data as EducationResource;
}

export const updateEducationResource = async (educationResource: EducationResource) => {
    const response = await Network.patch<EducationResource>("/education-post", educationResource);
    return response.data as EducationResource;
}

export const deleteEducationResource = async (postId: string)  => {
    await Network.delete<EducationResource>(`/education-post/${postId}`);
}

export const fetchEducationCategories = async () => {
    const response = await Network.get<EducationCategory[]>(`/education-post/categories`);
    return response.data as EducationCategory[];
}