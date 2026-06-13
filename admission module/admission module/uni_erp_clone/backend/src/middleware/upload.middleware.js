const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Allow only PDF, JPG, JPEG, PNG
const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Secure storage access
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Randomized filenames to prevent directory traversal / overwrite
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomName}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Validate MIME type and File extension
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    // Block EXE, JS, PHP, Executable files
    cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed.'), false);
  }
};

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = uploadMiddleware;
