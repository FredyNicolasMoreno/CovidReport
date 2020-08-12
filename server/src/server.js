const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');
const port = process.argv[2];
const indexRoutes = require('./routes/index');
const fetch = require('node-fetch');
const redis = require('redis');
var imgName = "";

//Creación cliente de redis en el puerto por defecto(6379)
const client = redis.createClient(6379);

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

//Ruta para consumir valores
app.get('/repos/:username', cache, getRepos);

//Request a Github para datos
async function getRepos(req, res, next){
    try {
        console.log('Fetching Data...');
        //Sacamos username de la url del app.get
        const { username } = req.params

        //Hacer la peticion (en este caso a la api de github. Retorna informacion del username que se ingrese)
        const response = await fetch(`https://api.github.com/users/${username}`);
        
        //Almacena la información en formato JSON
        const data = await response.json();

        //Pide información en especifico(en este caso los valores que estén bajo la etiqueta public_repos) del JSON
        const repos = data.public_repos;

        //Ponemos al información en redis
        //params: 
        //key: nusername o lo que entre en la URL
        //3600 Expiración en segundos
        //repos: información
        client.setex(username, 3600, repos);

        res.send(setResponse(username,repos));
    } catch (error) {
        console.error(error);
        res.status(500);
    }
}

function setResponse(username,repos){
    return `<h2>${username} tiene ${repos} repositorios en Github</h2>`;
}

//Caché
function cache(req, res, next){
    const { username } = req.params;


    client.get(username, (err, data) => {
        if(err) throw err;

        if(data != null){
            res.send(setResponse(username, data));
        }else{
            next();
        }
    })
}

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
