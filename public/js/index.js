function homeController($scope){

}

angular
.module('wwwApp', ['ui.router', 'ngMaterial', 'angular-loading-bar'])

.run(function(){})

.config(function($stateProvider, $urlRouterProvider){})

.controller('homeController', function($scope, $http, $window, $q, $timeout, $log){
	var map = null;

	$scope.place = null;
	$scope.term = null;

	$scope.simulateQuery = false;
	$scope.isDisabled = false;

	$scope.selectedItemChange = selectedItemChange;
	$scope.searchTextChange = searchTextChange;

	$scope.selectedPlaceChange = selectedPlaceChange;
	$scope.searchPlaceChange = searchPlaceChange;

	 $scope.querySearch = function(query) {
      var results = query ? $scope.AllCategories.filter( createFilterFor(query) ) : $scope.AllCategories,
          deferred;
      if ($scope.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    $scope.queryPlace = function(query){
      var results = query ? $scope.AllPlaces.filter( createFilterFor(query) ) : $scope.AllPlaces,
          deferred;
      if ($scope.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }    	
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(category) {
        return (category.value.indexOf(lowercaseQuery) === 0);
      };

    }

	$scope.loadCategories = function(){
		var categories = ['Food', 'Cafe', 'NightLife', 'Fun', 'Shopping'];

		return categories.map(function(category){
			return {
				value: category.toLowerCase(),
				display: category
			}
		});
	}

	$scope.loadPlaces = function(){
		var places = ['Pune', 'Mumbai', 'Hyderabad', 'Chicago', 'Los Angeles', 'Delhi', 'Chennai', 'Kochi', 'Bengaluru'];

		return places.map(function(place){
			return {
				value: place.toLowerCase(),
				display: place
			}
		});
	}

	function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
      $scope.term = item.value;
    }

    function searchPlaceChange(text){
    	$log.info('Place changed to + ', text );
    }

    function selectedPlaceChange(item){
    	$log.info('Place selected ' + JSON.stringify(item));
    	$scope.place = item.value;
    }

	$scope.AllCategories = $scope.loadCategories();
	$scope.AllPlaces = $scope.loadPlaces();

	$scope.visitSite = function(url){
		$window.open(url);
	}

	$scope.search = function(){
		console.log('search...');

		var opt = {
			"term": $scope.term,
			"location": $scope.place
		};

		$http.post('/getBusiness', opt).then(function(data){
			console.log(data);
			$scope.venues = data.data.venues;

			setMarkers(map, $scope.venues);
		}, function(err){
			console.log(err);
		});
	}

	// getList();

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
			           infowindow.close();
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

      		geocoder.geocode({'location': pos}, function(results, status) {
      			if (status === 'OK') {
      				if (results[1]) {
      					console.log('results', results);
      					for (var ac = 0; ac < results[0].address_components.length; ac++) {
      						var component = results[0].address_components[ac];

      						switch(component.types[0]) {
      							case 'locality':
	      							$scope.city = component.long_name;
	      							break;
      							case 'administrative_area_level_1':
	      							// storableLocation.state = component.short_name;
	      							break;
      							case 'country':
	      							// storableLocation.country = component.long_name;
	      							// storableLocation.registered_country_iso_code = component.short_name;
	      							break;
      						}
      					};

      				} else {
      					window.alert('No results found');
      				}
      			} else {
      				window.alert('Geocoder failed due to: ' + status);
      			}
      		});

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