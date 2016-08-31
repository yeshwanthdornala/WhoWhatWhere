function homeController($scope){

}

angular
	.module('wwwApp', ['ui.router'])
	.run(function($stateProvider, $urlRouterProvider){
		console.log('stateProvider', $stateProvider);
	})
	.controller('homeController', function($scope){
		$scope.mammu = "MY";
	})
	;

	homeController.$inject = ['$scope'];