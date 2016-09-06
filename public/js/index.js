function homeController($scope){

}

angular
.module('wwwApp', ['ui.router', 'ngMaterial', 'angular-loading-bar'])

.run(function(){})

.config(function($stateProvider, $urlRouterProvider){})

.controller('homeController', function($scope, $http, $window){
	var map = null;

	$scope.visitSite = function(url){
		$window.open(url);
	}

	function getList(){
		var opt = {
			"term": "cafe",
			"location": "sydney"
		};

		$http.post('/getBusiness', opt).then(function(data){
			console.log(data);
			$scope.venues = data.data.venues;

			setMarkers(map, $scope.venues);
		}, function(err){
			console.log(err);
		});
	}

	getList();

	function setMarkers(map, venues){
		for (var i = 0; i < venues.length; i++) {
			var venue = venues[i];
			var location = venue.location;

			var infowindow = new google.maps.InfoWindow({
			    content: 'contentString'
			  });

			var content = "" + "<div class='info_win'><p>" + venue.name + "</p></div>";

			var marker = new google.maps.Marker({
				position: { lat: location.lat, lng: location.lng },
				map: map
			});		

			google.maps.event.addListener(marker,'mouseover', (function(marker,content,infowindow){ 
			        return function() {
			           infowindow.setContent(content);
			           infowindow.open(map,marker);
			        };
			    })(marker, content ,infowindow)); 

			google.maps.event.addListener(marker,'mouseout', (function(marker,content,infowindow){ 
			        return function() {			        	
			           // infowindow.close();
			        };
			    })(marker,null,infowindow)); 
		}
	}

	function initMap() {
      // Create a map object and specify the DOM element for display.
      var geocoder = new google.maps.Geocoder;
      map = new google.maps.Map(document.getElementById('map-wrapper'), {
      	center: {lat: -34.397, lng: 150.644},
      	scrollwheel: true,
      	zoom: 8
      });

      if (navigator.geolocation) {
      	navigator.geolocation.getCurrentPosition(function(position) {
      		var pos = {
      			lat: position.coords.latitude,
      			lng: position.coords.longitude
      		};

      		// geocoder.geocode({'location': pos}, function(results, status) {
      		// 	if (status === 'OK') {
      		// 		if (results[1]) {

      		// 		} else {
      		// 			window.alert('No results found');
      		// 		}
      		// 	} else {
      		// 		window.alert('Geocoder failed due to: ' + status);
      		// 	}
      		// });

      		// map.setCenter(pos);
      	}, function() {
            //- handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
          // Browser doesn't support Geolocation
          //- handleLocationError(false, infoWindow, map.getCenter());
      }
  }

  setTimeout(function() {      	
  	initMap();
  }, 500);

})
;

homeController.$inject = ['$scope'];