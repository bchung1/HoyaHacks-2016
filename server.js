var express = require('express');
var app = express();
var path = require('path');
var parser = require('body-parser');
var fs = require('fs');
var Clarifai = require('clarifai');

var clar = new Clarifai.App(
	'_-KQU_GDv3-XGJd67pDVfENoLka5ITyAYD3bwevF',
	'Ols0ZeSCRBQNpQ4DKE_yir8RXecO6TGVSeFB9BE5'
);

app.use(parser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/main.html');
});

app.get('/donate',function(req,res){
  res.sendFile(__dirname + '/public/donate.html');
});

app.post('/photo', function(req, res){
  var snap = req.body.snap.slice(23);
  var lat = req.body.location.lat;
  var long = req.body.location.long;

  getTags(snap);

});

app.listen(3000, function() {
    console.log('listening on port 3000');
});




function getTags(base64){
	
	clar.models.predict(Clarifai.GENERAL_MODEL, {base64: base64}).then(
  		function(response) {
  			console.log(response);
  		},
  		function(err) {
    		console.error("Try again!\n");
    	}
	);
}
