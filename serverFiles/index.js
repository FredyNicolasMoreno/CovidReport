const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const bodyparser = require('body-parser');
const fs = require('fs');
const du = require('du');
const { Console } = require('console');
const port = 8081;

app.get('/', (req, res) => {
     res.send('Servidor activo');
});

const storage = multer.diskStorage({
     destination: path.join(__dirname, 'public/uploads'),
     filename: (req, file, cb) => {
          cb(null, file.originalname);
     }
});

app.use(multer({
     storage,
     dest: path.join(__dirname, 'public/uploads')
 }).single('image'))

app.use(express.static(__dirname + '/public/uploads'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.post("/", async (request, response) => {
     console.log('--------------Server has heard---------------');
     console.log(request.file );
     response.send("image storaged");
 });

 app.get("/sizeFolder", async (req, res) => {
     let size = await du(__dirname + '/public/uploads');
     console.log("Size is: " +size);
     res.send("" +size);
 });

app.listen(port, function(){
     console.log('Servidor funcionando en el puerto ' +port);
});