angular.module('app',[])
    .controller('appController',['$scope', 'appFactory' , function($scope, appFactory) {
        $scope.navInicio = true;
        $scope.formulario = {};
        $scope.showMensaje = {};
        $scope.valoresSeleccion = [];
        $scope.resultado = [];
        $scope.contadores = {}
        $scope.leer = function (){
            appFactory.obtenerDatos().then(function(response) {
                $scope.valoresSeleccion = [];
                $scope.resultado = [];
                $scope.contadores = {}
                $scope.datos = response.data;
                $scope.crearDatos();
            }).catch(function(error) {
                $scope.showMensaje.mensaje = 'Error al obtener datos';
                $scope.showMensaje.visible = true;
            });
        }
        $scope.guardar = function (formulario){
            appFactory.guardarDatos(formulario).then(function(response) {
                $scope.showMensaje.mensaje = 'Exito: '+response.data.mensaje;
                $scope.showMensaje.visible = true;
                $scope.navPag('resultados');
            }).catch(function(error) {
                $scope.showMensaje.mensaje = 'Error al obtener datos: '+error.data.mensaje;
                $scope.showMensaje.visible = true;
            });
        }
        $scope.crearDatos = function() {
            _.forEach($scope.datos,function (value){
                $scope.valoresSeleccion.push(value.seleccion);
            });
            $scope.valoresSeleccion.forEach(function(genero) {
                if ($scope.contadores[genero]) {
                    $scope.contadores[genero]++;
                } else {
                    $scope.contadores[genero] = 1;
                }
            });
            $scope.resultado = Object.entries($scope.contadores).map(function([genero, cantidad]) {
                return [genero, cantidad];
            });
            bb.gere
            $scope.crearGrafico();
        };

        $scope.crearGrafico = function (){
            bb.generate({
                bindto: "#chart",
                data: {
                    columns: $scope.resultado,
                    type: "bar",
                    bar: {
                        width: {
                            ratio: 0.5
                        }
                    }
                }
            });
        }
        $scope.navPag = function (pagActual){
            switch (pagActual){
                case 'encuesta':
                    $scope.navInicio = false;
                    $scope.navEncuesta = true;
                    $scope.navResultados=false;
                    break;
                case 'resultados':
                    $scope.navInicio = false;
                    $scope.navEncuesta = false;
                    $scope.navResultados= true;
                    $scope.leer();
                    break;
                default:
                    $scope.navInicio = true;
                    $scope.navEncuesta = false;
                    $scope.navResultados= false;
                    $scope.showMensaje = {};
                    break;
            }
        }
}]).factory('appFactory',['$http',function ($http){
    var factory = {};
    var path = 'http://localhost:8001';

    factory.obtenerDatos = function() {
        return $http.get(path);
    };

    factory.guardarDatos = function(form) {
        return $http.post(path,form);
    };

    return factory;
}]);