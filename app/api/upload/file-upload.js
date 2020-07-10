const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const config = require('../../server.configs');

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS,
  accessKeyId: config.AWS_ACCESS_KEY,
  region: 'eu-west-3'
});

const s3 = new aws.S3();

const deleteFile =  (params,cb) => {

  s3.deleteObject(params, function (err, data) {
    if (err) cb(err,null);  // error
    else cb(null,data);
  })
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
  }
}

const uploadPosts = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: 'memories-fr/posts',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TESTING_META_DATA!' });
    },
    key: function (req, file, cb) {
      cb(null, "posts-" + Date.now().toString() + "." + file.mimetype.split('/')[1])
    }
  })
})

const uploadUsers = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: 'memories-fr/users',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TESTING_META_DATA!' });
    },
    key: function (req, file, cb) {
      cb(null, "posts-" + Date.now().toString() + "." + file.mimetype.split('/')[1])
    }
  })
})

module.exports = { uploadPosts, uploadUsers, deleteFile };