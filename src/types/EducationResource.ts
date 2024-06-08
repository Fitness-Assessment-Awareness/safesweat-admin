import { EducationCategory } from "./EducationCategory";

export type EducationResource = {
    postId?: string;
    titleEn: string;
    titleMs: string;
    contentEn: string;
    contentMs: string;
    categoryId: string;
    imageUrl: string;
    likeCount?: number;
    createdDate?: Date;
    createdBy: string;
    lastUpdatedDate?: Date;
    lastUpdatedBy?: string;
    categoryDto?: EducationCategory;
};
