
(function () {

  'use strict';

	var requireHelper = require('./requireHelper');
  var apiv1 = requireHelper.require('tests/coverage/instrumented/routes/apiv1');
  var assert = require('chai').assert;
  var sinon = require('sinon');



  // create mock request and response
  var reqMock = {};

  var resMock = {};
  resMock.status = function() {
    return this;
  };
  resMock.send = function() {
    return this;
  };
  resMock.end = function() {
    return this;
  };
  sinon.spy(resMock, "status");
  sinon.spy(resMock, "send");


  //test the getWeather function
  describe('Get Weather', function() {

    it('with without city code', function() {
      reqMock = {
        query: {

        }
      };

      apiv1.getWeather(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected status code:' + resMock.status.lastCall.args);
    });

    it('with valid zip code and error from request call', function() {
      reqMock = {
        query: {
          zip: "Hamilton"
        }
      };

      var request = function( obj, callback ){
        callback("error", null, null);
      };

      apiv1.__set__("request", request);

      apiv1.getWeather(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.calledWith('Failed to get the data'), 'Unexpected response:' + resMock.send.lastCall.args);
    });

    it('with incomplete zip code', function() {
      reqMock = {
        query: {
          zip: "Hamilton"
        }
      };

      var request = function( obj, callback ){
        callback(null, null, {});
      };

      apiv1.__set__("request", request);

      apiv1.getWeather(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.args[0].msg === 'Failed', 'Unexpected response:' + resMock.send.lastCall.args);
    });

    it('with valid zip code', function() {
      reqMock = {
        query: {
          zip: "Auckland"
        }
      };

      var body = {
        cod: 200,
        name: 'Auckland',
        weather: [
          {
            main: 'cold'
          }
        ],
        main: {
          temp: 78
        },
        coord:{la: -30.442,lo: 170.323}
      };

      var request = function( obj, callback ){
        callback(null, null, body);
      };

      apiv1.__set__("request", request);

      apiv1.getWeather(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(200), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.args[0].city === 'Auckland', 'Unexpected response:' + resMock.send.lastCall.args[0].city);
      assert(resMock.send.lastCall.args[0].weather === 'Conditions are cold and temperature is 78 °', 'Unexpected response:' + resMock.send.lastCall.args[0].weather);
    });
  });

	//test the getWeatherByLatLng function
	describe('Get Weather By LatLng', function(){
		it('without latlng', function(){
			reqMock = {
				query: {
					
				}
			};
			
			apiv1.getWeatherByLatLng(reqMock, resMock);
			
			assert(resMock.status.lastCall.calledWith(400), 'Unexpected status code:' + resMock.status.lastCall.args);
		});
		
		it('with valid latlng and error from request call', function(){
			reqMock = {
				query: {
					lat: -37.7870,
					lon: 175.2793
				}
			};
			
			var request = function(obj, callback){
				callback("error", null, null);
			};
			
			apiv1.__set__("request", request);
			
			apiv1.getWeatherByLatLng(reqMock, resMock);
			
			assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
      		assert(resMock.send.lastCall.calledWith('Failed to get the data'), 'Unexpected response:' + resMock.send.lastCall.args);
		});
		
		it('with incomplete latlng', function() {
      		reqMock = {
        		query: {
          			lat: -37.7870,
					lon: 175.2793
        		}
      		};

      		var request = function( obj, callback ){
        		callback(null, null, {});
      		};

      		apiv1.__set__("request", request);

      		apiv1.getWeatherByLatLng(reqMock, resMock);

      		assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
      		assert(resMock.send.lastCall.args[0].msg === 'Failed', 'Unexpected response:' + resMock.send.lastCall.args);
    	});
    	
    	it('with valid  latlng', function() {
      		reqMock = {
        		query: {
          			lat: -37.7870,
					lon: 175.2793
        		}
      		};

      		var body = {
        		cod: 200,
        		name: 'Hamilton',
        		weather: [
          		{
            		main: 'cold'
          		}
        		],
        		main: {
          			temp: 78
        		}
      		};

      		var request = function( obj, callback ){
        		callback(null, null, body);
      		};

      		apiv1.__set__("request", request);

      		apiv1.getWeatherByLatLng(reqMock, resMock);

      		assert(resMock.status.lastCall.calledWith(200), 'Unexpected response:' + resMock.status.lastCall.args);
      		assert(resMock.send.lastCall.args[0].city === 'Hamilton', 'Unexpected response:' + resMock.send.lastCall.args[0].city);
      		assert(resMock.send.lastCall.args[0].weather === 'The clicked place\'s conditions are cold and temperature is 78 °', 'Unexpected response:' + resMock.send.lastCall.args[0].weather);
    	});
	});



  /*
  describe('Get Weather 2', function() {

    it('with without zip code', function() {
      reqMock = {
        query: {

        }
      };

      apiv1.getWeather2(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected status code:' + resMock.status.lastCall.args);
    });

    it('with valid zip code and error from request call', function() {
      reqMock = {
        query: {
          zip: 79968
        }
      };

      var request = function( obj, callback ){
        callback("error", null, null);
      };

      apiv1.__set__("request", request);

      apiv1.getWeather2(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.calledWith('Failed to get the data'), 'Unexpected response:' + resMock.send.lastCall.args);
    });

    it('with incomplete zip code', function() {
      reqMock = {
        query: {
          zip: 79968
        }
      };

      var request = function( obj, callback ){
        callback(null, null, {});
      };

      apiv1.__set__("request", request);

      apiv1.getWeather2(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.args[0].msg === 'Failed', 'Unexpected response:' + resMock.send.lastCall.args);
    });

    it('with valid zip code', function() {
      reqMock = {
        query: {
          zip: 79968
        }
      };

      var body = {
        cod: 200,
        name: 'El Paso',
        weather: [
          {
            main: 'cold'
          }
        ],
        main: {
          temp: 78
        }
      };

      var request = function( obj, callback ){
        callback(null, null, body);
      };

      apiv1.__set__("request", request);

      apiv1.getWeather2(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(200), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.args[0].city === 'El Paso', 'Unexpected response:' + resMock.send.lastCall.args[0].city);
      assert(resMock.send.lastCall.args[0].weather === 'Conditions are cold and temperature is 78 F', 'Unexpected response:' + resMock.send.lastCall.args[0].weather);
    });
  });
  */
}());
