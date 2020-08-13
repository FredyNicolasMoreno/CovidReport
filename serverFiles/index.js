const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const bodyparser = require('body-parser');
const fs = require('fs');
const du = require('du');
const fetch = require('node-fetch');
const axios = require('axios');
const redis = require('redis');
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


const client = redis.createClient(6379);

app.get('/chart', cache, getRepos);

async function getRepos(req, res, next){
    
    axios.get('http://192.168.100.36/chart').
      then(response => {
          let result = "";
          var separation = "";

          for (let x = 0; x < response.data.length; x++){
              separation = (x < response.data.length-1)?",":"";
              result += response.data[x].location +"-" +response.data[x].cant +separation;
          }
	  
        client.setex("cases_covid", 600, result);
        res.send(result);
      }); 
}

//Caché
function cache(req, res, next){
    client.get("cases_covid", (err, data) => {
        if(err) throw err;
        if(data != null){
            res.send(data);
        }else{
            next();
        }
    })
}


app.listen(port, function(){
     console.log('Servidor funcionando en el puerto ' +port);
});
