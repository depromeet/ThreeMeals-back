import { Stream } from 'stream';
import * as aws from 'aws-sdk';
import { config } from '../../config';


const s3 = new aws.S3();

// 수정 필요
aws.config.update({
    secretAccessKey: config.aws.AWS_SECRET_KEY,
    accessKeyId: config.aws.AWS_ACCESS_KEY,
    region: config.aws.AWS_REGION,
});

export const uploadFileToS3 = (s3: any, path: any, type: any) => {
    const pass = new Stream.PassThrough();
    const params = { Bucket: process.env.AWS_BUCKET, Key: path, Body: pass, ContentType: type };
    s3.upload(params, function(err: any, data: any) {
        if (err) console.log(err, data);
    });
    return pass;
};
