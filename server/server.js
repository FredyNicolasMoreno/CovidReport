const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/item', (req, res) => {
     console.log("Entra");
     console.log(req.query);
     res.redirect('http://127.0.0.1:5500/client/index.html');
});

app.listen(port, () => console.log(`Example app listening on port port!`))