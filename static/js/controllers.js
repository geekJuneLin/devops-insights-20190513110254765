
var ConsoleModule = angular.module('ConsoleModule', ['ngRoute']);

ConsoleModule.config(['$routeProvider', '$locationProvider','$sceDelegateProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partials/Byzip.html',
        controller: 'wcontroller',
        controllerAs: 'wcontroller'
    });
}]);

ConsoleModule.controller('wcontroller', ['$scope', '$http', '$routeParams', '$timeout', '$sce',
    function($scope, $http, $routeParams, $timeout, $sce) {

    $scope.somemessage = "Some weather";
    $scope.zip1City = "";
    $scope.zip1Weather = "";
    
    var a,b,c,d;
    var marker;
    var infowindow = new google.maps.InfoWindow({
      content:"Hello World!"
    });
    
    
    var map = new google.maps.Map(document.getElementById('googleMap'), {
                          zoom: 5,
                        center: {lat: -40.9006, lng: 174.8860}
                    });
    
    google.maps.event.addListener(map, 'click', function(event){
    	marker = new google.maps.Marker({position: event.latLng, map: map});
    	var city;
    	var lat = event.latLng.lat();
    	var lon = event.latLng.lng();
    	//var latlng = {la: lat, lo: lon};
    	var latlng 	 = new google.maps.LatLng(lat, lon);
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'latLng': latlng}, function(results, status){
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					for (var i = 0; i < results.length; i++) {
						if (results[i].types[0] === "locality") {
							city = results[i].address_components[0].short_name;
						}
					}
				}
				else {console.log("No reverse geocode results.");}
			}
			else {console.log("Geocoder failed: " + status);}
		});
    	/*
    	var REQUEST = require('request');
    	var request = REQUEST.defaults( {
    		strictSSL: false
		});
    	request({
    		method: "GET",
    		url: 'https//api.openweathermap.org/data/2.5/weather?appid=6b7b471967dd0851d0010cdecf28f829&units=metric&lat=' + lat + '&lon=' + lon,
   			json:true
   		}, function(err, resp, body){
    		//$scope.zip1City = response.data.city;
            $scope.zip1Weather = "The clicked place's conditions are " + body.weather[0].main + " and temperature is " + body.main.temp + ' °';
    	});
    	*/
    	
    	$http({
                method: "GET",
                url: '/api/v1/getWeather?zip=' + city
            }).then( function(response){
            	$scope.zip1Weather = response.data.weather;
            });
    });
    	/*
    	$http({
                method: "GET",
                url: '/api/v1/getWeatherByLatLng?lat=' + latlng
            }).then( function(response){
            	$scope.zip1Weather = response.data.weather;
            });
    });*/


	infowindow.open(map,marker);

    $scope.zip = function(which) {

        var data = "";
        if(which === 1) {
            data = $scope.zip1m;
        } else if(which === 2) {
            data = $scope.zip2m;
        } else if(which === 3) {
            data = $scope.zip3m;
        } else if(which === 4) {
            data = $scope.zip4m;
        } 

        if(data.length >= 4) {
            $http({
                method: "GET",
                url: '/api/v1/getWeather?zip=' + data
            }).then( function(response) {
            	var myLatLng=null;
                if(which === 1) {
                	
                    $scope.zip1City = response.data.city;
                    $scope.zip1Weather = response.data.weather;
                    myLatLng = {lat: response.data.la, lng: response.data.lo};           
					a= new google.maps.Marker({
                         position: myLatLng,
                        map: map,     
                    });
                } else if(which === 2) {
                    $scope.zip2City = response.data.city;
                    $scope.zip2Weather = response.data.weather;
                    myLatLng = {lat: response.data.la, lng: response.data.lo};           

                    b= new google.maps.Marker({
                         position: myLatLng,
                        map: map,
                         
                    });
                } else if(which === 3) {
                    $scope.zip3City = response.data.city;
                    $scope.zip3Weather = response.data.weather;
                    myLatLng = {lat: response.data.la, lng: response.data.lo};           

                    c= new google.maps.Marker({
                         position: myLatLng,
                        map: map,
                         
                    });
                } else if(which === 4) {
                    $scope.zip4City = response.data.city;
                    $scope.zip4Weather = response.data.weather;
                    myLatLng = {lat: response.data.la, lng: response.data.lo};           

                    d= new google.maps.Marker({
                         position: myLatLng,
                        map: map,
                         
                    });
                } 
            });
        } else {
            if(which === 1) {
                    $scope.zip1City = "";
                    $scope.zip1Weather = "";
                    a.setVisible(false);
                } else if(which === 2) {
                    $scope.zip2City = "";
                    $scope.zip2Weather = "";
                    b.setVisible(false);
                } else if(which === 3) {
                    $scope.zip3City = "";
                    $scope.zip3Weather = "";
                    c.setVisible(false);
                } else if(which === 4) {
                    $scope.zip4City = "";
                    $scope.zip4Weather = "";
                    d.setVisible(false);
                } 
        }
    };
}]);