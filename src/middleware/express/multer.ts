import * as path from 'path';
import * as aws from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as dotenv from 'dotenv';

dotenv.config();
const s3 = new aws.S3();

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION,
});


const upload = multer({

    // 이미지 파일이 아니면 짜른다
    fileFilter: function( _, file, callback) {
        const ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('허용되지 않는 파일형식 저장'));
        }
        callback(null, true);
    },

    storage: multerS3({
        s3: s3,
        bucket: 'bucketname',
        key: function(req, file, cb) {
            cb(null, Math.floor(Math.random() * 1000).toString() + Date.now() + '.' + file.originalname.split('.').pop());
        },
        acl: 'public-read',
    }),

});

export default upload;
