//Guardamos en una constante todo nos q ofrece express
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const {cpu, mem, netstat} = require('node-os-utils');

// Se inicializa y guarda funcionalidades express
const server = express();

// Setea o Busca el puerto disponible, sino usa el 3000
server.set('port', process.env.PORT || 3005); 

// el formato de  datos para la recepciòn en formato json
server.use(express.json());

//permite la comunicaciòn entre servidores e/cliente vue y la API
server.use(cors());

//se especifican nuestras rutas
server.use(require('../routes/route.server'));

// Damos arranque en este caso a nuestro servidor local
const servidor = server.listen( server.get('port') );

//websocket requiere un servidor para trabajar
const socket = socketio(servidor);

socket.on('connection', (socket) => {//= a una function{}()
    //emitimos constantemente segundo a segundo
    
        setInterval(() => { //cpu
            cpu.usage()
            .then(info => {
                socket.emit('cpu',info)
            });
        },1000); //fin cpu

        setInterval(() => { //memoria
            mem.used()
            .then(usada =>{
                socket.emit('ram',usada);
            });
        },2000); //fin memoria

        setInterval(() => { //red no soportado en Windows
            netstat.stats()
            .then(info => {
                //console.log(info);
                socket.emit('Entradared',info)
            });
            netstat.stats()
            .then(info => {
                //console.log(info);
                socket.emit('Salidared',info)
            });
        },1000); //fin red */
    });

console.log('Servidor en Macbook saliendo por el puerto', server.get('port')); 