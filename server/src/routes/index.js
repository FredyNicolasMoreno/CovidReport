const express = require('express');
const dbConnection = require('../db/dbConnection');
const connection = dbConnection();
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => res.send('Hello World!'));

router.post('/data', (req, res) => {
     console.log("Entra");
     console.log(req.body);
     res.sendFile(path.join(__dirname, '../../../client', 'index.html'));
});

router.get('/path', (req, res) => res.sendFile(path.join(__dirname+'../../../client/index.html')));

module.exports = router;