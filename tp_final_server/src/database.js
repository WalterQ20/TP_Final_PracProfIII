const mysql = require('mysql');
const db = mysql.createConnection({ // creo la conexion con la BBDD
    host:'localhost', // o bien ip del servidor remoto
    user:'root', //usuario de la bbdd
    password:'', //clave en caso de tenerla
    database:'tp_final' //BBDD
});

db.connect();
console.log("La conexión con la BBDD ha sido exitosa, la misma se encuentra online"); //Muestro por pantalla de terminal
module.exports = db;