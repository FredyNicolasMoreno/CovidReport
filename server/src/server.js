const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');
const port = process.argv[2];
const indexRoutes = require('./routes/index');
var imgName = "";

const storage = multer.diskStorage({
     destination: path.join(__dirname, '/public'),
     filename: (req, file, cb) => {
          imgName = file.originalname;
         cb(null, uuid.v4() + path.extname(file.originalname).toLowerCase());
     }
 });


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

app.use(multer({
     storage,
     fileFilter: (req, file, cb) => {
         const filetypes = /jpeg|jpg|PNG|png/
         const mimetype = filetypes.test(file.mimetype);
         const extname = filetypes.test(path.extname(file.originalname));
         if(mimetype && extname){
             return cb(null, true);
         }
         cb("Error: Archivo debe ser una imagen valida");
     }
 }).single('image'));


app.use('/', indexRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
