const express = require('express');
const app = express();


app.get('/', (req, res) => {

    res.render('main', {
        anio: new Date().getFullYear()
    });
});




app.use(require('./usuario'));
app.use(require('./agencias'));
app.use(require('./exportador'));
app.use(require('./registros'));
app.use(require('./contactos'));










module.exports = app;