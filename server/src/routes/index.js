const express = require('express');
const dbConnection = require('../db/dbConnection');
const connection = dbConnection();
const router = express.Router();


router.get('/', (req, res) => res.send('Hello World!'));

router.post('/data', (req, res) => {
     console.log("Entra");
     console.log(req.body);
});

module.exports = router;