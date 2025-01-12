import { describe, expect, it, Mock, vi } from 'vitest';
import { EducationCategory, EducationResource } from '../../types';
import { Network } from '../../utils/network/Network';
import {
    createEducationResource,
    deleteEducationResource,
    fetchEducationCategories,
    fetchEducationResources,
    updateEducationResource,
} from '../EducationResourceService';

vi.mock('../../utils/network/Network');

describe('EducationResourceService', () => {
    const mockEducationResource: EducationResource = {
        postId: '1',
        titleEn: 'Test Title EN',
        titleMs: 'Test Title MS',
        contentEn: 'Test Content EN',
        contentMs: 'Test Content MS',
        categoryId: '1',
        imageUrl: 'http://example.com/image.jpg',
        createdBy: 'user1',
        lastUpdatedBy: 'user1',
    };

    const mockEducationCategory: EducationCategory = {
        categoryId: '1',
        name: 'Test Category',
    };

    it('fetchEducationResources should return a list of education resources', async () => {
        (Network.get as Mock).mockResolvedValue({ data: [mockEducationResource] });
        const resources = await fetchEducationResources();
        expect(resources).toEqual([mockEducationResource]);
    });

    it('createEducationResource should create and return the new education resource', async () => {
        (Network.post as Mock).mockResolvedValue({ data: mockEducationResource });
        const resource = await createEducationResource(mockEducationResource);
        expect(resource).toEqual(mockEducationResource);
    });

    it('updateEducationResource should update and return the education resource', async () => {
        (Network.patch as Mock).mockResolvedValue({ data: mockEducationResource });
        const resource = await updateEducationResource(mockEducationResource);
        expect(resource).toEqual(mockEducationResource);
    });

    it('deleteEducationResource should delete the education resource', async () => {
        (Network.delete as Mock).mockResolvedValue({});
        await deleteEducationResource('1');
        expect(Network.delete).toHaveBeenCalledWith('/education-post/1');
    });

    it('fetchEducationCategories should return a list of education categories', async () => {
        (Network.get as Mock).mockResolvedValue({ data: [mockEducationCategory] });
        const categories = await fetchEducationCategories();
        expect(categories).toEqual([mockEducationCategory]);
    });
});
