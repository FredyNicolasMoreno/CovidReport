const express = require('express');
const dbConnection = require('../db/dbConnection');
const connection = dbConnection();
const router = express.Router();
const path = require('path');
const PDF = require('pdfkit');

const formData = require('form-data');
const axios = require('axios');
const fs = require('fs');
//var doc = new PDF();
var data = "eje";
//doc.pipe(fs.createWriteStream(__dirname +'/../public/covid_report.pdf'));

router.get('/', (req, res) => res.send('Hello World!'));

router.post('/data', (req, res) => {
     console.log(req.body);
     console.log(req.file.originalname);
     console.log(req.file.filename);
     console.log(req.headers.origin);

     const form = new formData();
     form.append('image', fs.createReadStream(req.file.path));

     axios.post('http://192.168.100.36:8081', form, {
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

     //res.sendFile(path.join(__dirname, '../../../client', 'index.html'));
	res.send('Datos enviados');
});

router.get('/pdf', (req, res) => {
     console.log('Request PDF');
     connection.query("SELECT location, COUNT(id) AS cant FROM covid_reports GROUP BY location", (err, rows)=>{
          if(err) throw err;
          generatePDF(rows, res);
     });
});

function generatePDF(value, res) {
     var doc = new PDF();
     doc.pipe(fs.createWriteStream(__dirname +'/../public/covid_report.pdf'));
     doc.text('CASOS COVID POR CIUDAD', {
          align: 'center'
     });
     doc.text('\n\n\n');
     for(var i=0; i<value.length; i++){
          doc.text("- " +value[i].location +": " +value[i].cant);
          console.log("Ciudad: " +value[i].location +": " +value[i].cant);
     }
     doc.end();
     res.send(value);
}

router.get('/path', (req, res) => res.sendFile(path.join(__dirname+'../../../client/index.html')));

module.exports = router;
