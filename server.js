var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/main.html');
});

app.get('/donate',function(req,res){
  res.sendFile(__dirname + '/public/donate.html');
});

app.listen(3000, function() {
    console.log('listening on port 3000');
});
