import { Stream } from 'stream';
import * as aws from 'aws-sdk';
import { config } from '../../../config';


const s3 = new aws.S3();

// 수정 필요
aws.config.update({
    secretAccessKey: config.aws.secretKey,
    accessKeyId: config.aws.accessKey,
    region: config.aws.region,
});

export const uploadFileToS3 = (s3: any, path: any, type: any) => {
    const pass = new Stream.PassThrough();
    const params = { Bucket: config.aws.bucket, Key: path, Body: pass, ContentType: type };
    s3.upload(params, function(err: any, data: any) {
        if (err) console.log(err, data);
    });
    return pass;
};
