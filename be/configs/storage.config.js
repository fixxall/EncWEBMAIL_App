const multer = require('multer');
const path = require('path');


const uploadDirectory = path.join(__dirname, '../../uploads');

module.exports = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(uploadDirectory)); // The directory where files will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});