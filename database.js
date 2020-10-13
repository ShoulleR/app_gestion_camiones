var mysql = require('mysql');




var conn = mysql.createConnection({
    host: 'localhost',
    user: 'node_user',
    password: '123456',
    database: 'camiones'
});



conn.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('Bases de Datos Online');
});





module.exports = conn;