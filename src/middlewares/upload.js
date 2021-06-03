import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp'
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Image upload settings
const storageImg = multer.diskStorage({
    destination: function(req, file, cb){
        const folderPath = path.join(__dirname, '../static_content/i')
        if(folderPath) {
            if (!fs.existsSync(folderPath)) {
                mkdirp(folderPath).then(made => {
                    console.log('Made directory, starting with ', made);
                    return cb(null, folderPath) //Image destination for images           
                })
            }
            return cb(null, folderPath) //Image destination for images

        } else {
            return cb(new Error('Invalid Type'));
        }
    }, 
    filename: (req, file, cb) => {
        return cb(null, uuidv4() + path.extname(file.originalname).toLowerCase()); ; //Uploaded file name for images
    }
});

//Middleware to upload image
export const uploadImg = multer({
    storage: storageImg, //Storage settings
    fileFilter: (req, file, cb) => {
        //image filters
        const filetypes = /jpeg|jpg|png|gif/; //image filters
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        return cb(new Error("Error: El archivo debe ser una imagen valida"));
    }
}).single("image"); //nombre del formulario