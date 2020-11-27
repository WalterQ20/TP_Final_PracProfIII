const socket = io('http://localhost:3005');
            Highcharts.chart('container', {
                chart: {
                    type: 'line',
                    animation: Highcharts.svg, 
                    marginRight: 10,
                    events: {
                        load: function () {
                        //DATOS NECESARIO PARA DAR INICIO AL GAFICO
                        //se construye la serie es decir la linea de tiempo
                        var series = this.series[0];
                        
                        //en este caso estamos recibiendo datos de un random
                        socket.on('cpu', function(random){
                            //antes de dibujar un punto en el grafico obtenemos el tiempo actual para plasmarlo en el eje X
                            var x = (new Date()).getTime();
                            //procedemos a graficar el punto especificando tiempo y el valor random
                            series.addPoint([x, random], true, true);
                        }); 
                        }
                    }
                },
    
                time: {
                    useUTC: false
                },
    
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                },
                yAxis: {
                    title: {
                        text: 'Uso CPU porcentual (%)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 100,
                        color: '#ffffff'
                    }]
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br/>',
                    pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}%'
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: 'Datos Recibidos',
                    data: (function () {
            
                        var data = [],
    
                        time = (new Date()).getTime(),
                        i;
    
                        //se inicia ciclo para agregar datos y graficar puntos en tiempo real
                        for (i = -19; i <= 0; i += 1) {
                        var y = null;
                        //en este caso simplemente estamos recibiendo un dato
                        socket.on('cpu', function(num){
                            y = num;
                        })
                        data.push({
                            x: time + i * 1000,
                            y: y
                        });
                        }
                        return data;
                    }())
                }]
            }); //Fin Script Grafico-->