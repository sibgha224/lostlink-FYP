const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.fieldname === 'audio' || file.mimetype.startsWith('audio/')) {
      return {
        folder: 'lostlink-voice',
        resource_type: 'video',
        allowed_formats: ['webm', 'mp3', 'wav', 'ogg', 'm4a']
      };
    }
    if (file.fieldname === 'file') {
      return {
        folder: 'lostlink-files',
        resource_type: 'raw',
        use_filename: true,
        unique_filename: true
      };
    }
    return {
      folder: 'lostlink-items',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    };
  }
});

module.exports = { cloudinary, storage };