var express = require('express');
var app = express();
var path = require('path');
var parser = require('body-parser');
var fs = require('fs');

app.use(parser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/main.html');
});

app.get('/donate',function(req,res){
  res.sendFile(__dirname + '/public/donate.html');
});

app.post('/photo', function(req, res){
  var snap = req.body.snap;
  var lat = req.body.location.lat;
  var long = req.body.location.long;
  var address = req.body.address;
  console.log(snap);
  console.log(lat + long);
  console.log(address);
});

app.listen(3000, function() {
    console.log('listening on port 3000');
});
