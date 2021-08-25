import * as AWS from 'aws-sdk';
import { config } from '../../../config';
import {
    ProfileImageData,
    ProfileImageUploader,
} from '../../../domain/aggregates/account/ProfileImageUploader';
import { ProfileUrl } from '../../../domain/aggregates/account/Account';

export class S3ImageUploader implements ProfileImageUploader {
    private readonly s3Client: AWS.S3;
    constructor() {
        this.s3Client = new AWS.S3({
            secretAccessKey: config.aws.secretKey,
            accessKeyId: config.aws.accessKey,
            region: config.aws.region,
        });
    }

    async uploadProfileImage(data: ProfileImageData): Promise<ProfileUrl> {
        const { filename, body } = data;
        const param: AWS.S3.PutObjectRequest = {
            'Bucket': config.aws.bucket,
            'Key': filename,
            'Body': body,
        };
        const { Location } = await this.s3Client.upload(param).promise();
        return Location;
    }
}
