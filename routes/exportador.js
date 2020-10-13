const express = require('express');
const sql = require('../database');
const bcrypt = require('bcrypt');
const util = require('util');
const app = express();




// config promesa database
const query = util.promisify(sql.query).bind(sql);


//AQUI MOSTRAMOS LAS AGENCIAS
app.get('/cexportador', async(req, res) => {

    let data = await query(`SELECT * FROM exportador`);

    res.render('cexportadores', {
        data,
        anio: new Date().getFullYear()
    });
});


//AQUI CREAMOS LA AGENCIA
app.post('/plusexportador', async(req, res) => {
    let body = req.body

    if (body.nombre == "" || body.contacto == "") {
        res.send('vacio');
    } else {

        await query(`INSERT INTO exportador (nombre,contacto,estado) VALUES ('${body.nombre}','${body.contacto}',1)`)

        res.send('Success');

    }
});


app.get('/creaexportador', (req, res) => {
    res.render('creaexportador', {
        anio: new Date().getFullYear()
    })
});



//AQUI MODIFICAMOS LOS DATOS DE LA AGENCIA
app.get('/modiexportador/:id', async(req, res) => {

    let id = req.params.id

    let data = await query(`SELECT * FROM exportador WHERE id_exportador= ?`, id);

    data = data[0];

    res.render('editaexportador', {
        data,
        anio: new Date().getFullYear()
    });

});

app.post('/mod/:id', async(req, res) => {
    let id = req.params.id;
    let body = req.body;


    if (body.nombre == "" || body.contacto == "") {
        res.send('vacio');
    } else {
        await query(`UPDATE exportador SET nombre='${body.nombre}', contacto='${body.contacto}' WHERE id_exportador=${id}`);


        res.send('Success');
    }


});



//AQUI BORRAMOS O ACTIVAMOS AL USUARIO
app.post('/borraexportador', async(req, res) => {
    let id = req.body.id;

    await query(`UPDATE exportador SET estado=0 WHERE id_exportador=${id}`);

    res.send('Borrado');
});

app.post('/activaexportador', async(req, res) => {

    let id = req.body.id;

    await query(`UPDATE exportador SET estado=1 WHERE id_exportador=${id}`);

    res.send('Activado');

});




















module.exports = app;