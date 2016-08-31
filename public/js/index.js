function homeController($scope){

}

angular
	.module('wwwApp', ['ui.router', 'ngMaterial'])
	.run(function(){
	})
	.config(function($stateProvider, $urlRouterProvider){
	})
	.controller('homeController', function($scope){
		$scope.m = "mathletics"
	})
	;

	homeController.$inject = ['$scope'];