import * as path from 'path';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const dotenv = require('dotenv');
dotenv.config(); // LOAD CONFIG

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
