export const convertFileToUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            resolve(reader.result as string);
        };

        reader.readAsDataURL(file);
    });
};

export const convertSupabaseBucketUrlToFile = async (bucketName: string, imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const fileName = imageUrl.split(`${bucketName}/`)[1] || 'image.jpg';
    const file = new File([blob], fileName, { type: blob.type });
    return file;
};
