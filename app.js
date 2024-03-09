angular.module('app',[])
    .controller('appController',['$scope', 'appFactory' , function($scope, appFactory) {
        $scope.navInicio = true;
        $scope.formulario = {};
        $scope.showMensaje = {};
        $scope.leer = function (){
            appFactory.obtenerDatos().then(function(response) {
                $scope.datos = response.data;
                /*$scope.resultado =  _.countBy(response.data, response.data.seleccion);
                console.log($scope.resultado);*/
            }).catch(function(error) {
                $scope.showMensaje.mensaje = 'Error al obtener datos: '+error.data.mensaje;
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
        $scope.countBySeleccion = function(seleccion) {
            var filteredData = _.filter($scope.datos, { seleccion: seleccion });
            return filteredData.length;
        };
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