const express = require('express');
const sql = require('../database');
const bcrypt = require('bcrypt');
const util = require('util');
const app = express();




// config promesa
const query = util.promisify(sql.query).bind(sql);



//Aqui se verifican los datos del login y se crea la sesion
app.post('/usuario', async(req, res) => {

    let body = req.body
    let password = bcrypt.hashSync(body.pwd, 10);
    let email = body.email;



    let data = await query(`SELECT * FROM usuarios WHERE email= ?`, email);



    if (data.length === 0) {
        res.send('Vacio');

    } else {
        if (!bcrypt.compareSync(body.pwd, data[0].password)) {
            //aqui mostramos mensaje contraseña incorrecta
            res.send('Error');
        } else {
            //Aqui enviamos si la contraseña y usuario existen
            if (data[0].estado === 1) {
                req.session.my_usuario = {
                    id: data[0].id,
                    email: data[0].email,
                    role: data[0].role,
                    nombre: data[0].nombre,
                    estado: data[0].estado
                };
                res.send('Success');

            } else {
                res.send('Inactivo');
            }
        }
    }

});



//AQUI es cuando el usuario se logea correctamente
app.get('/dashboard', (req, res) => {

    if (req.session.my_usuario.role === "ADMIN_ROLE") {

        res.render('main2', {
            anio: new Date().getFullYear(),
            nombre: req.session.my_usuario.nombre,
            role: true
        });

    } else {
        res.render('main2', {
            anio: new Date().getFullYear(),
            nombre: req.session.my_usuario.nombre,
        });
    }

});



app.get('/cusuarios', async(req, res) => {

    let data = await query(`SELECT * FROM usuarios`);

    res.render('cusuarios', {
        data,
        anio: new Date().getFullYear()
    });
});


//AQUI CREAMOS EL USUARIO

app.post('/crear', async(req, res) => {
    let body = req.body

    if (body.nombre == "" || body.email == "" || body.pwd == "" || body.role == undefined) {
        res.send('vacio');
    } else {
        let password = bcrypt.hashSync(body.pwd, 10);


        await query(`INSERT INTO usuarios (nombre, email, password, role, estado) VALUES ('${body.nombre}','${body.email}','${password}','${body.role}',1)`)

        res.send('Success');

    }



});


app.get('/creacion', (req, res) => {

    res.render('crear', {
        anio: new Date().getFullYear()
    })
});




//AQUI BORRAMOS O ACTIVAMOS AL USUARIO
app.post('/borrar', async(req, res) => {
    let id = req.body.id;

    await query(`UPDATE usuarios SET estado=0 WHERE id=${id}`);

    res.send('Borrado');
});

app.post('/activar', async(req, res) => {

    let id = req.body.id;

    await query(`UPDATE usuarios SET estado=1 WHERE id=${id}`);

    res.send('Activado');

});


//AQUI RECIBIMOS EL ID DEL USUARIO Y RENDERIZAMOS LA INFORMACION QUE VA A SER MODIFICADA POSTERIORMENTE
app.get('/edit/:id', async(req, res) => {

    let id = req.params.id

    let data = await query(`SELECT * FROM usuarios WHERE id= ?`, id);

    data = data[0];

    res.render('editar', {
        data,
        anio: new Date().getFullYear()
    });

});


//AQUI SE MODIFICAN LOS DATOS DEL USUARIO SELECCIONADO, SOLO UN ADMIN PUEDE
app.post('/modificar/:id', async(req, res) => {

    let id = req.params.id;
    let body = req.body;

    console.log(body);

    if (body.nombre == "" || body.email == "" || body.role == undefined) {
        console.log('Entre AQUI');
        res.send('vacio');
    } else {

        await query(`UPDATE usuarios SET nombre='${body.nombre}', email='${body.email}',role='${body.role}' WHERE id=${id}`);


        res.send('Success');

    }




});
















module.exports = app;