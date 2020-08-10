const express = require('express');
const dbConnection = require('../db/dbConnection');
const connection = dbConnection();
const router = express.Router();
const path = require('path');

const formData = require('form-data');
const axios = require('axios');
const fs = require('fs');

router.get('/', (req, res) => res.send('Hello World!'));

router.post('/data', (req, res) => {
     console.log(req.body);
     console.log(req.file.originalname);
     console.log(req.file.filename);
     console.log(req.headers.origin);

     const form = new formData();
     form.append('image', fs.createReadStream(req.file.path));

     axios.post('http://localhost:8081', form, {
          headers: {
               'Content-Type': `multipart/form-data; boundary=${form._boundary}`
          }
     }).then(function (response) {
          console.log('La imagen se ha enviado de forma satisfactoria');
          console.log(response.data);
     }).catch(function (response) {
          console.log(response.data);
     }); 
     fs.unlink(req.file.path, (err) => {
          if(err) throw err;
     });

     connection.query("INSERT INTO covid_reports(name, location, img_original_name, img_code_name, server) VALUES ('"+req.body.name +"','" +req.body.address +"','" +req.file.originalname +"','" +req.file.filename +"','" +req.headers.origin +"')", (err, result) => {
          if(result){
               console.log('Los datos de la imagen se han agregado correctamente');
          }else{
               console.log('Ha ocurrido un problema al insertar el reporte')
               console.log(err);
          }
     });

     res.sendFile(path.join(__dirname, '../../../client', 'index.html'));
});

router.get('/path', (req, res) => res.sendFile(path.join(__dirname+'../../../client/index.html')));

module.exports = router;