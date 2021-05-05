import { Stream } from 'stream';
import * as aws from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();
const s3 = new aws.S3();

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const uploadFileToS3 = (s3: any, path: any, type: any) => {
    const pass = new Stream.PassThrough();
    const params = { Bucket: process.env.AWS_BUCKET, Key: path, Body: pass, ContentType: type };
    s3.upload(params, function(err: any, data: any) {
        if (err) console.log(err, data);
    });
    return pass;
};
