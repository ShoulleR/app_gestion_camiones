const express = require('express');
const sql = require('../database');
const bcrypt = require('bcrypt');
const util = require('util');
const app = express();




// config promesa database
const query = util.promisify(sql.query).bind(sql);


//AQUI MOSTRAMOS LAS AGENCIAS
app.get('/cagencias', async(req, res) => {

    let data = await query(`SELECT * FROM agencias`);

    res.render('cagencias', {
        data,
        anio: new Date().getFullYear()
    });
});


//AQUI CREAMOS LA AGENCIA
app.post('/plusagencia', async(req, res) => {
    let body = req.body

    if (body.nombre == "" || body.email == "") {
        res.send('vacio');
    } else {

        await query(`INSERT INTO agencias (nombre,contacto,estado) VALUES ('${body.nombre}','${body.email}',1)`)

        res.send('Success');

    }
});


app.get('/creaagencia', (req, res) => {
    res.render('creaagencia', {
        anio: new Date().getFullYear()
    })
});



//AQUI MODIFICAMOS LOS DATOS DE LA AGENCIA
app.get('/modiagencia/:id', async(req, res) => {

    let id = req.params.id

    let data = await query(`SELECT * FROM agencias WHERE id_agencia= ?`, id);

    data = data[0];

    res.render('editagencia', {
        data,
        anio: new Date().getFullYear()
    });

});

app.post('/modi/:id', async(req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (body.nombre == "" || body.contacto == "") {
        res.send('vacio');
    } else {
        await query(`UPDATE agencias SET nombre='${body.nombre}', contacto='${body.contacto}' WHERE id_agencia=${id}`);


        res.send('Success');
    }





});


//AQUI BORRAMOS O ACTIVAMOS AL USUARIO
app.post('/borragencia', async(req, res) => {
    let id = req.body.id;

    await query(`UPDATE agencias SET estado=0 WHERE id_agencia=${id}`);

    res.send('Borrado');
});

app.post('/activagencia', async(req, res) => {

    let id = req.body.id;

    await query(`UPDATE agencias SET estado=1 WHERE id_agencia=${id}`);

    res.send('Activado');

});




















module.exports = app;