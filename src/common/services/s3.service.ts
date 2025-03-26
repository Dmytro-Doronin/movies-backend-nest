import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
    private readonly s3: S3Client;
    private readonly bucketName: string;
    private readonly region: string;

    constructor() {
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        const region = process.env.AWS_REGION;
        const bucketName = process.env.AWS_BUCKET_NAME;

        if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
            throw new InternalServerErrorException('AWS credentials are not set properly in env');
        }

        this.bucketName = bucketName;
        this.region = region;

        this.s3 = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
    }

    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const key = `${folder}/${Date.now()}_${uuidv4()}_${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3.send(command);
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        await this.s3.send(command);
    }
}