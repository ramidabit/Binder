const express = require('express');

app = express();

app.get('/', (req, res) => {
    res.send('<h1>Waddup World!</h1>')
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);