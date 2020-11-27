const app = new Vue({

    el:"#monitoreo",
    data:{
        hostname:'',
        dir_ip:'',
        fecha_carga:'',
        cliente:0,
        list_select:'',
        razon_social:'',
        nombre:'',
        apellido:'',
        telefono:'',
        correo_electronico:'',
        idext:0,
        idext2:0,
        select_srv:localStorage.getItem('Ips'),
        valor_cpu:null,
        estado_cpu:null,
        estado_ram:null,
        ram_io:null,
        estado_red:null,
        red_eth:null,
        red_io_en:null,
        red_io_out:null,
        idelim:0,
        lista_Equipos:[],
        lista_Clientes:[],
    },

    methods:{
        listarDatos(){

            axios.get('http://localhost:3005/equipos').then(resultado => {
                this.lista_Equipos = resultado.data;
            });

            axios.get('http://localhost:3005/clientes').then(resultado => {
                this.lista_Clientes = resultado.data;
            });
        }, //Fin listado
        eliminarClient(elim_Cliente){
            this.idelim = this.id_host
            var advertencia = confirm('¿Esta seguro que desea Eliminar al cliente id: '+elim_Cliente+' asociado al equipo id: '+ this.idelim +'?')
                if (advertencia) { // si el usuario da en aceptar elimina completamente la venta elegida
                    alert("¡El cliente Nro "+elim_Cliente+" fue Eliminado Satisfactoriamente!");
                    axios.delete('http://localhost:3005/clientes/'+elim_Cliente).then(resultado => {})
                }
                else { //sino no se elimina
                    alert("¡Se cancelo la eliminación del Cliente!");
                }
                this.listarDatos();
        }, //Fin eliminacion Cliente

        eliminarEqps(elim_Equip){
            var advertenciaEq = confirm('¿Esta seguro que desea Eliminar el equipo nro: '+elim_Equip+' ?')
                if (advertenciaEq) { // si el usuario da en aceptar elimina completamente la venta elegida
                    alert("¡El equipo Nro "+elim_Equip+" fue eliminado Satisfactoriamente!");
                    axios.delete('http://localhost:3005/equipos/'+elim_Equip).then(resultado => {})
                }
                else { //sino no se elimina
                    alert("¡Se cancelo la eliminación del Cliente!");
                }
                this.listarDatos();
        }, // Fin eliminacion Equipo

        guardarCliente(){
            let unCliente = { //corresponde al body, para luego enviar los datos por axios.post
                razon_social:this.razon_social,
                nombre:this.nombre,
                apellido:this.apellido,
                telefono:this.telefono,
                correo_electronico:this.correo_electronico,
                
            }
            axios.post('http://localhost:3005/clientes',unCliente).then(resultado => {
                alert(resultado.data); //Mostrar alerta (Cartel con mensaje)
                this.listarDatos(); //Refresca la lista
                this.razon_social='';
                this.nombre='';
                this.apellido='';
                this.correo_electronico='';
                this.telefono='';
                //finaliza de vaciar el formulario
            });
        },

        guardarEquipos(){
            let unEquipo = { //corresponde al body, para luego enviar los datos por axios.post
                hostname:this.hostname,
                dir_ip:this.dir_ip,
                fecha_carga:this.fecha_carga,
                cliente:this.list_select
                
            }
            axios.post('http://localhost:3005/equipos',unEquipo).then(resultado => {
                alert(resultado.data); //Mostrar alerta (Cartel con mensaje)
                this.listarDatos(); //Refresca la lista
                this.hostname='';
                this.dir_ip='';
                this.fecha_carga='';
                this.list_select='';
                //finaliza de vaciar el formulario*/
            });
        },

        editarClient(id_cliente,razon_social,nombre,apellido,correo_electronico,telefono){ 
            this.idext = id_cliente;
            this.razon_social = razon_social;
            this.nombre = nombre;
            this.apellido = apellido;
            this.correo_electronico = correo_electronico;
            this.telefono = telefono;
        },

        editarEquipos(id_host,hostname,dir_ip,fecha_carga,list_select){
            this.idext2 = id_host;
            this.hostname = hostname;
            this.dir_ip = dir_ip;
            this.fecha_carga = fecha_carga;
            this.list_select = list_select;
        },

        actualizarClientes(){
            let unClientes = { //corresponde al body, para luego enviar los datos por axios.post
                razon_social:this.razon_social,
                nombre:this.nombre,
                apellido:this.apellido,
                correo_electronico:this.correo_electronico,
                telefono:this.telefono

            }
            axios.put('http://localhost:3005/clientes/'+this.idext,unClientes).then(resultado => {
                alert('Se actualizaron correctamente los datos del cliente'+this.idext);
                this.listarDatos();
                this.razon_social='';
                this.nombre='';
                this.apellido='';
                this.correo_electronico='';
                this.telefono='';
                // Finalizo de vaciar todas los campos
            });
        },

        actualizarEquipos(){
            let unEquipos = { //corresponde al body, para luego enviar los datos por axios.post
                hostname:this.hostname,
                dir_ip:this.dir_ip,
                fecha_carga:this.fecha_carga,
                cliente:this.list_select

            }
            axios.put('http://localhost:3005/equipos/'+this.idext2,unEquipos).then(resultado => {
                alert('Se actualizaron correctamente los datos del equipo nro '+this.idext2);
                this.listarDatos();
                this.hostname='';
                this.dir_ip='';
                this.fecha_carga='';
                this.list_select='';
                // Finalizo de vaciar todas los campos
            });
        },

        // Inicio seleccionar Servidores
        Servers(dir_ip){
            localStorage.setItem('Ips',dir_ip);
            location.reload();

        },

        capturarCPU(){
            
            const socket = io('http://'+localStorage.getItem('Ips')+':3005');
            
            socket.on('cpu',(info) => {
                this.valor_cpu = info;

                if(this.valor_cpu > 50.01){
                    this.estado_cpu = 'Excedido';
                }else{
                    this.estado_cpu = 'Normal';
                }
            });
        }, //Fin Lectura CPU

        capturarRam(){
            
            const socket = io('http://'+localStorage.getItem('Ips')+':3005');
            socket.on('ram',(usada)=>{
                this.ram_io = usada.usedMemMb;

                if(this.ram_io > 2000){
                    this.estado_ram = 'Uso Excedido';
                }else{
                    this.estado_ram = 'Uso normal de Ram';
                }
            });
        }, // Fin lectura Ram

        capturarRed(){
            this.red_io_en='';
            this.red_io_out='';
            const socket = io('http://'+localStorage.getItem('Ips')+':3005');
            socket.on('Entradared',(info)=>{
                this.red_io_en = info;
                
            });

            socket.on('Salidared',(info)=>{
                this.red_io_out = info;
            });

        }// Fin lectura Red*/
    }, 

    created:function(){//
        this.listarDatos();
        this.capturarCPU();
        this.capturarRam();
        this.capturarRed();
    },

    async mounted(){ //montando los tabs y select 
        $('.tabs').tabs();
        $('select').formSelect();
    },

});
