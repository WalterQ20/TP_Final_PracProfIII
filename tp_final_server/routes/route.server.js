const express = require('express');
const router = express.Router(); // para acceder a las rutas, la guardo dentro de la constante

const db = require('../src/database'); //Aca va el DataBase
const inet = require('inet');


router.get('/equipos', async (req,res) => { //Consulta datos de la BBDD Equipos
    
    //res.json('Haciendo la consulta a la BBDD');

    await db.query('select id_host,hostname,inet_ntoa(dir_ip) as dir_ip,fecha_carga,cliente from equipos',(err,rows) => { //selecciona la Tabla

        if(!err){ 
            res.json(rows);
        }else{
            res.json('Error al traer los datos de la tabla equipos');
        }
    });
});

router.get('/clientes', (req,res) => { //Consulta datos de la BBDD Clientes
    
    //res.json('Haciendo la consulta a la BBDD');
    db.query('select * from clientes',(err,rows) => { //selecciona la Tabla

        if(!err){ 
            res.json(rows);
        }else{
            res.json('Error al traer los datos de la tabla equipos');
        }
    });
});

router.delete('/clientes/:iduclient', (req,res)=> { //Elimina datos de la BBDD - /:idufact = se añade a la ruta para que reciba el id del cliente a eliminar
    var idu = req.params.iduclient; //pasa el dato anterior a la variable
    db.query('delete from clientes where id_cliente = ?', [idu]);
    res.json('Se ha eliminado el cliente seleccionado');
    /*db.query('delete from clientes where id_cliente = ?', [idu],(err,rows) =>{
        if (!err) {
            res.json('Se elimino correctamente el Cliente')
        }else{
            res.json('No se puede eliminar el cliente porque esta siendo usado por un equipo')
        }

    });//Para que no elimine al cliente si esta siendo usado por un equipo*/
    
});

router.delete('/equipos/:iduhost', (req,res)=> { //Elimina datos de la BBDD - /:idufact = se añade a la ruta para que reciba el id del equipo a eliminar
    var ide = req.params.iduhost; //pasa el dato anterior a la variable
    db.query('delete from equipos where id_host = ?', [ide]);
    res.json('Se ha eliminado el equipo seleccionado');
});

router.post('/equipos', async (req,res) => { //Guardar un equipo
    const unequipo = {
        hostname: req.body.hostname,
        dir_ip:inet.aton(req.body.dir_ip), //convierte la ip en entero (int)
        fecha_carga:req.body.fecha_carga,
        cliente:req.body.cliente
    }

    const respuesta = await db.query('insert into equipos set ?',[unequipo]);
    res.json('Se cargo correctamente el dato a la BBDD');

});

router.post('/clientes', (req,res) => { // Carga datos a la BBDD
    const unclient = req.body;
    db.query('insert into clientes set ?',[unclient]); //? = para poder insertar datos de la constante 
    res.json('Se cargo correctamente el dato a la BBDD');
});

router.put('/clientes/:codigo', (req,res) => { // Actualiza datos a la BBDD
    const idcl = req.params.codigo;
    const uniclient = req.body;

    db.query('update clientes set ? where id_cliente = ?',[uniclient,idcl]);
    res.json('Se Actualizaron los datos de la BBDD');
});

router.put('/equipos/:cod', (req,res) => { // Actualiza datos a la BBDD
    const ideq = req.params.cod;
    const uniequip = {
        hostname: req.body.hostname,
        dir_ip:inet.aton(req.body.dir_ip), //convierte la ip en entero (int)
        fecha_carga:req.body.fecha_carga,
        cliente:req.body.cliente
    }

    db.query('update equipos set ? where id_host = ?',[uniequip,ideq]);
    res.json('Se Actualizaron los datos de la BBDD');
});

module.exports = router;