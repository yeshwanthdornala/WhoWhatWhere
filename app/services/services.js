var Yelp = require('yelp');
var Dodge = require('dodge');

var yelp = new Yelp({
	consumer_key: 'ebX5qBcGJJZdtsaKU3f6eg',
	consumer_secret: 'NubN467mkiFl3oX-B6_RQybt4k4',
	token: 'pd3M4IGoQlDJGt2crDfakAiT6_e5w-bq',
	token_secret: 'SuJM3ypna1mZ6IKFEOgKBp4IoB8',
});

var Foursquare = new Dodge({"clientId": "TA1Y15OZD5IXYGKYRLIY45IEV034POA0BKN0MFV5D1LDMIAH", "clientSecret": "XOKCTRZNSKXBMMMM5BXWIUWYTRMWGC14DP4VCLJVYN52E5Z3"});

function parseFourSquare(data, venues){
	var foursquareData = data;
	var fsArray = {};

	for (var i = 0; i < foursquareData.length; i++) {
		var fsd = foursquareData[i];

		fsArray.id = fsd.id;
		fsArray.name = fsd.name;
		fsArray.phone = fsd.contact.formattedPhone || 'Not Available';
		fsArray.url= fsd.url;
		fsArray.rating = fsd.rating || 'Not Available';

		fsArray.imgUrl = "/img/noimg.png";

		fsArray.location  = {};
		fsArray.location.lat = fsd.location.lat;
		fsArray.location.lng = fsd.location.lng;
		fsArray.location.address = fsd.location.address || 'Not Available';
		fsArray.location.postal = fsd.location.postalCode;
		fsArray.location.city = fsd.location.city;
		fsArray.location.state = fsd.location.state;
		fsArray.location.country = fsd.location.country;

		venues.push(fsArray);
		fsArray = {};
	}

	return venues;
}

function parseYelp(data, venues){
	var yelpData = data;
	var ypArray = {};
	
	for (var j = 0; j < yelpData.businesses.length; j++) {
		var business = yelpData.businesses[j];

		ypArray.id = business.id;
		ypArray.name = business.name;
		ypArray.phone = business.phone || 'NA';
		ypArray.url = business.url;
		ypArray.rating = business.rating;
		ypArray.imgUrl = business.image_url;

		ypArray.location  = {};
		ypArray.location.lat = business.location.coordinate.latitude;
		ypArray.location.lng = business.location.coordinate.longitude;
		ypArray.location.address = business.location.address[0];
		ypArray.location.postal = business.location.postal_code;
		ypArray.location.city = business.location.city;
		ypArray.location.state = business.location.state_code;
		ypArray.location.country = business.location.country_code;

		venues.push(ypArray);
		ypArray = {};
	}
	return venues;
}

module.exports = {
	getYelp: function(req, res){
		var body = {
			term: req.body.term,
			location: req.body.location
		}

		yelp.search(body)
		.then(function success(data){
			console.log('yellp called...', data);				
			return res.json(data);
		}, function error(err){
			return res.json(err);
		});
	},

	getFourSquare: function(req, res){
		var opt = {
			near: req.body.location,
			query: req.body.term
		}

		Foursquare.venues.search(opt, function(err, result){
			if(err){
				return res.json(err);				
			}

			console.log('venues', result);
			return res.json(result);
		});
	},

	getBusiness: function(req, res){
		var fData = null;
		var yData = null;
		var venues = [];

		var opt = {
			near: req.body.location,
			query: req.body.term,
			limit: 15
		}

		Foursquare.venues.search(opt, function(err, foursquareData){
			if(err){
				return res.json(err);				
			}

			if (foursquareData) {
				venues = parseFourSquare(foursquareData, venues);
			}

			var yopt = {
				term: req.body.term,
				location: req.body.location,
				limit: 15
			}

			yelp.search(yopt)
			.then(function success(yelpData){
				if (yelpData) {
					venues = parseYelp(yelpData, venues);
				}

				return res.json({
					venues: venues
				});
				
			}, function error(err){

				if(err.data.error.id === 'UNAVAILABLE_FOR_LOCATION'){					
					return res.json({
						venues: venues
					});
				}

				console.log('yelp failure', err);
				return res.json(err);
			});
		});
	}
}