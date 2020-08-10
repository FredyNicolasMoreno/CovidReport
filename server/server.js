const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.argv[2]

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/item', (req, res) => {
     console.log("Entra");
     console.log(req.query);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
