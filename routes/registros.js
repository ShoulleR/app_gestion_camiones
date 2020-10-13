const express = require('express');
const sql = require('../database');
const util = require('util');
const app = express();
const multer = require('multer');
const fileUpload = require('express-fileupload');








//middleware de multer
app.use(fileUpload({ useTempFiles: true }));

// config promesa database
const query = util.promisify(sql.query).bind(sql);





app.get('/crearegistro', async(req, res) => {

    let usuario = req.session.my_usuario;
    let exportador = await query(`SELECT * FROM exportador`);
    let agencias = await query(`SELECT * FROM agencias`);

    res.render('crea_registro', {
        usuario,
        exportador,
        agencias
    });


});


app.post('/plusregistro', async(req, res) => {
    let body = req.body;

    var ahora = new Date();
    var hora = ahora.getFullYear() + "-" + ahora.getMonth() + "-" + ahora.getDate();


    let data = await query(`INSERT INTO registros (id_agencia,id_exportador,patente,awb,fecha_creacion) VALUES ('${body.agencia}','${body.exportador}','${body.patente}','${body.awb}','${hora}')`)

    let id_registro = data.insertId;

    res.send(`${id_registro}`);


});


app.get('/cimagenes/:id', async(req, res) => {

    let id_registro = req.params.id;
    let etapas = await query(`SELECT * FROM etapas`);
    let imagenes = await query(`SELECT * FROM imagenes`);


    res.render('cimagenes', {
        id_registro,
        etapas,
        imagenes
    })
});


app.post('/plusimagenes', async(req, res) => {

    let body = req.body;

    if (body) {
        await query(`INSERT INTO imagenes (imagen,id_etapa,id_registro) VALUES ('${body.imagen}','${body.id_etapa}','${body.id_registro}')`);
        res.send('Success');
    } else {
        res.send('vacio')
    }
});


app.post('/check/:id', (req, res) => {
    let id_registro = req.params.id;
    let file = req.files;
    console.log(id_registro);
    console.log(file);

    if (!file) {
        res.send('vacio')
    }

    //aqui tomamos la info del file
    let archivo1 = req.files.etapa1;
    let archivo2 = req.files.etapa2;
    let archivo3 = req.files.etapa3;
    let archivo4 = req.files.etapa4;
    let archivo5 = req.files.etapa5;

    guardar(archivo1, id_registro, 1);
    guardar(archivo2, id_registro, 2);
    guardar(archivo3, id_registro, 3);
    guardar(archivo4, id_registro, 4);
    guardar(archivo5, id_registro, 5);

    res.send('Success');

})




app.get('/cregistros', async(req, res) => {

    let registros = await query(`SELECT *,agencias.nombre AS n_agencias,exportador.nombre AS n_exportador FROM registros 
    INNER JOIN agencias ON registros.id_agencia=agencias.id_agencia 
    INNER JOIN exportador ON registros.id_exportador=exportador.id_exportador`);

    res.render('cregistros', {
        registros
    })

});


app.get('/renderimagen/:id', async(req, res) => {

    let id = req.params.id;

    let imagenes = await query(`SELECT * FROM imagenes 
    INNER JOIN etapas ON imagenes.id_etapa=etapas.id_etapa 
    WHERE id_registro=${id} 
    ORDER BY imagenes.id_etapa`);

    console.log(imagenes);

    res.render('imagenes', { imagenes })


})




function guardar(str, id, id_etapa) {

    if (str === undefined) {
        return;
    } else {
        str.mv(`public/assets/img/${id}-${str.name}`, (err) => { //este metodo se usa para decirle que guarde el archivo en el path seleccionado
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            query(`INSERT INTO imagenes (imagen,id_registro,id_etapa) VALUES ('${id}-${str.name}','${id}','${id_etapa}')`);

        })

    }



}













module.exports = app;