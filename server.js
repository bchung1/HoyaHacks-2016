var express = require('express');
var app = express();
var path = require('path');
var parser = require('body-parser');
var fs = require('fs');
var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyBKmuL2wZN9xGci0gPTMi1ZzikD8g3e28w",
    authDomain: "lfrb-3843b.firebaseapp.com",
    databaseURL: "https://lfrb-3843b.firebaseio.com",
    storageBucket: "lfrb-3843b.appspot.com",
    messagingSenderId: "271810523032"
  };
  firebase.initializeApp(config);
  var db = firebase.database();
  var collectorsRef = db.ref("collectors/");
  var donorsRef = db.ref("donors/");
  var collectorsObj, donorsObj;

  donorsRef.on("value", function(snapshot) {
  donorsObj = snapshot.val();
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

collectorsRef.on("value", function(snapshot) {
  collectorsObj = snapshot.val();
}, function (errorObject) {
console.log("The read failed: " + errorObject.code);
});


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

app.get('/donors',function(req, res){
  var collectorTags = req.query.tags;
  var currDonors = donorsObj;
  var resultDonors = donorsObj.filter(function(donor){
    var donorTags = donor.tags;
    var union = intersect(donorTags,collectorTags);
    if(union.length > 0){
      return true;
    }
  });
  res.send(resultDonors);
});

app.get('/collect', function(req, res){
  res.sendFile(__dirname + '/public/collect.html');
});

app.post('/photo', function(req, res){
  var snap = req.body.snap.slice(23);
  var lat = req.body.location.lat;
  var long = req.body.location.long;
  var address = req.body.address;
  var tags = req.body.tags;
  getCollectors(tags,function(data){
    res.send(data);
  });
});

app.listen(3000, function() {
    console.log('listening on port 3000');
});


function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
}

function getCollectors(tags, callback){
  var currCollectors = collectorsObj;
  var resultCollectors = collectorsObj.filter(function(collector){
    var collectorTags = collector.tags;
    var union = intersect(tags,collectorTags);
    if(union.length > 0){
      return true;
    }
  });
  callback(resultCollectors);
}
