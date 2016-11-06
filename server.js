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

app.use(parser.json({limit: '50mb'}));
app.use(parser.urlencoded({limit: '50mb', extended: true}));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
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
  var address = req.body.address;
  getTags(snap, function(data){
    res.send(data);
  });
});

app.listen(3000, function() {
    console.log('listening on port 3000');
});


function getTags(base64, callback){
	clar.models.predict(Clarifai.GENERAL_MODEL, {base64: base64}).then(
  		function(response) {
        callback(response.data.outputs[0].data.concepts);
   		},
  		function(err) {
    		console.error("Try again!\n");
    	}
	);
}
