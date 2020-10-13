const express = require('express');
const sql = require('../database');
const util = require('util');
const app = express();



// config promesa database
const query = util.promisify(sql.query).bind(sql);


//CONTACTOS DE AGENCIA
app.get('/contactagencia/:id', async(req, res) => {

    let id = req.params.id;

    let contactos = await query(`SELECT *,agencias.nombre AS n_agencia FROM contacto_agencias 
    INNER JOIN agencias ON contacto_agencias.id_agencia=agencias.id_agencia
    WHERE contacto_agencias.id_agencia=${id}`);

    if (contactos.length < 1) {
        res.render('contact_agencias', { id });
    } else {
        let nombre = contactos[0].n_agencia;
        res.render('contact_agencias', { contactos, nombre, id });
    }


});


//renderizamos el edit del contacto de agencias

app.get('/editcontactoagencia/:id', async(req, res) => {
    let id = req.params.id;
    let data = await query(`SELECT * FROM contacto_agencias WHERE id_contacto_agencia=${id}`);

    let contacto = data[0];

    res.render('edit_contacto_agencia', {
        contacto
    });

});

//aqui le damos update al nombre y contacto
app.post('/guardar/:id', async(req, res) => {

    let id = req.params.id;
    let body = req.body;


    if (body.nombre == "" || body.contacto == "") {
        res.send('vacio');
    } else {
        await query(`UPDATE contacto_agencias SET nombre_contacto='${body.nombre}', email_contacto='${body.contacto}' WHERE id_contacto_agencia=${id}`);

        res.send('Success');
    }

});


//BORRAMOS CONTACTO AGENCIA
app.post('/bcagencia', async(req, res) => {
    let id = req.body.id;

    await query(`UPDATE contacto_agencias SET estado_contacto_agencia=0 WHERE id_contacto_agencia=${id}`);

    res.send('Borrado');
});

//ACTIVAMOS CONTACTO AGENCIA
app.post('/activacontactoagencia', async(req, res) => {

    let id = req.body.id;

    await query(`UPDATE contacto_agencias SET estado_contacto_agencia=1 WHERE id_contacto_agencia=${id}`);

    res.send('Activado');

});




//CREAMOS UN CONTACTO DE AGENCIA NUEVO

app.get('/creacontactoagencia/:id', (req, res) => {
    let id = req.params.id;

    res.render('crea_contacto_agencia', { id })

})


app.post('/creacontactoagencia', async(req, res) => {


    let body = req.body;
    if (body.nombre == "" || body.contacto == "" || body.id_agencia == "") {
        res.send('vacio');
    } else {
        await query(`INSERT INTO contacto_agencias (nombre_contacto,email_contacto,id_agencia,estado_contacto_agencia) VALUES ('${body.nombre}','${body.contacto}','${body.id_agencia}',1)`);

        res.send('Success');

    }

})




//AQUI EMPEZAMOS LOS CONTACTOS DE EL EXPORTADOR


app.get('/contactoexportador/:id', async(req, res) => {
    let id = req.params.id;
    let contactos = await query(`SELECT * FROM contacto_exportadores WHERE id_exportador=${id}`)

    console.log(contactos);
    res.render('contacto_exportador', { contactos, id });
});




//RENDERIZAMOS PARA CREAR EL CONTACTO DE EXPORTADOR Y LO GUARDAMOS EN DB

app.get('/creacontactoexportador/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    res.render('crea_contacto_exportador', { id });

})


app.post('/creacontactoexportador', async(req, res) => {


    let body = req.body;
    if (body.nombre == "" || body.contacto == "" || body.id_agencia == "") {
        res.send('vacio');
    } else {
        await query(`INSERT INTO contacto_exportadores (nombre_contacto_ex,email_contacto_ex,id_exportador,estado_contacto_exportador) VALUES ('${body.nombre}','${body.contacto}','${body.id_exportador}',1)`);

        res.send('Success');

    }

});




//renderizamos el edit del contacto del exportador

app.get('/editcontactoexportador/:id', async(req, res) => {
    let id = req.params.id;
    let data = await query(`SELECT * FROM contacto_exportadores WHERE id_contacto_exportador=${id}`);

    let contacto = data[0];

    res.render('edit_contacto_exportador', {
        contacto
    });

});

//aqui le damos update al nombre y contacto
app.post('/guardarex/:id', async(req, res) => {

    let id = req.params.id;
    let body = req.body;


    if (body.nombre == "" || body.contacto == "") {
        res.send('vacio');
    } else {
        await query(`UPDATE contacto_exportadores SET nombre_contacto_ex='${body.nombre}', email_contacto_ex='${body.contacto}' WHERE id_contacto_exportador=${id}`);

        res.send('Success');
    }

});







//BORRAMOS CONTACTO EXPORTADOR
app.post('/bcexportador', async(req, res) => {
    let id = req.body.id;

    await query(`UPDATE contacto_exportadores SET estado_contacto_exportador=0 WHERE id_contacto_exportador=${id}`);

    res.send('Borrado');
});

//ACTIVAMOS CONTACTO EXPORTADOR
app.post('/activacontactoexportador', async(req, res) => {

    let id = req.body.id;

    await query(`UPDATE contacto_exportadores SET estado_contacto_exportador=1 WHERE id_contacto_exportador=${id}`);

    res.send('Activado');

});














module.exports = app;