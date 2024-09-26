import { EducationCategory } from './EducationCategory';
import { EducationPostLike } from './EducationPostLike';

export type EducationResource = {
    postId?: string;
    titleEn: string;
    titleMs: string;
    contentEn: string;
    contentMs: string;
    categoryId: string;
    imageUrl: string;
    createdDate?: Date;
    createdBy: string;
    lastUpdatedDate?: Date;
    lastUpdatedBy?: string;
    categoryDto?: EducationCategory;
    educationPostLikeDtos?: EducationPostLike[];
    educationPostBookmarkDtos?: EducationPostLike[];
};
