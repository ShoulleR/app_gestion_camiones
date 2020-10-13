const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const multer = require('multer');







//iniciamos express
const app = express();


//MIDDLEWARES



//parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json()); //MIDDLEWARES : TODAS LAS PETICIONES PASARAN POR AQUI.

//session 

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}));





//habilitamos la carpeta public aca
const publicPath = path.resolve(__dirname, './public');
//que use el public
app.use(express.static(publicPath));




//EXPRESS HBS ENGINE
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');



app.use(require('./routes/index'));





//PUERTO
const port = process.env.PORT || 3000;




app.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});




module.exports = app;