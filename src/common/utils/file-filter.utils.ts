import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
): void => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new BadRequestException('Invalid file type. Only images are allowed.'), false);
    }
};