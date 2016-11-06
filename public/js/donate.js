var apiKey = 'AIzaSyC4XPcPbOT1eGbtl8LJClco6NkoalhqW2w';
(function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#videoStream').hide();
        $('#snapBtn').hide();
        $('#tagsBtnStart').show();
        $('#tagsTextArea').show();

    }else{
      $('#fileSelectorWrapper').hide();
      $('#uploadMobile').hide();
      $('#tagsBtnStart').hide();
      $('#tagsTextArea').hide();
    }
})();

function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if ("geolocation" in navigator) {
    /* geolocation is available */
} else {
    /* geolocation IS NOT available */
}

if (hasGetUserMedia()) {
    var video = document.querySelector('video');
    var canvas = document.querySelector('canvas');
    var context = canvas.getContext('2d');
    var localMediaStream = null;
    // Not showing vendor prefixes or code that works cross-browser.
    navigator.getUserMedia({
        video: true
    }, function(stream) {
        video.src = window.URL.createObjectURL(stream);
        localMediaStream = stream;
    }, function(error) {
        console.log(error);
    });
} else {
    alert('getUserMedia() is not supported in your browser');
}

$("#snapBtn").click(function() {
    snapshot();
});

$('#upload').hide();

$('#recordTagsBtn').click(function(){
  $('#tagsBtnStart').show();
  $('#tagsTextArea').show();
  $('#snapBtn').hide();
  $(video).hide();
  $('#upload').show();
});

function snapshot() {
    if (localMediaStream) {
        canvas.width = video.videoWidth - 70;
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = false;
        // "image/webp" works in Chrome.
        // Other browsers will fall back to image/png.
        var snap = canvas.toDataURL('image/jpeg');
        $("#snap").attr("src", snap);
    }
}

$("#upload").click(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var snap = canvas.toDataURL('image/jpeg');
        var tags = $('#tagsInput').val();
        console.log(tags);
        uploadPhoto(position.coords.latitude, position.coords.longitude, snap,tags);
    });
});

$('#uploadMobile').click(function() {
    var file = $('#fileSelector').get(0).files[0];
    var FR= new FileReader();
    FR.onload = function(e) {
      navigator.geolocation.getCurrentPosition(function(position) {
          var tags = $('#tagsInput').val();
          console.log(tags);
          uploadPhoto(position.coords.latitude, position.coords.longitude,e.target.result,tags);
      });
   };
   if (file) {
     FR.readAsDataURL(file);
}
});

function uploadPhoto(lat, long, snap, tags) {
    var results = reverseGeolocation(lat, long, function(address) {
        $.ajax({
            type: "POST",
            url: "https://353594a9.ngrok.io/photo",
            data: {
                snap: snap,
                location: {
                    lat: lat,
                    long: long
                },
                address: address,
                tags:tags
            },
            success: function(data) {
                collectorList.setCollectors(data);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
}

var collectorList = new Vue({
    el: '#collectorList',
    data: {
        collectors: ''
    },
    methods: {
        setCollectors: function(collectors) {
            this.collectors = collectors;
            $('#collectorList').show();
        }
    }
});

$('#collectorList').hide();

function reverseGeolocation(lat, long, callback) {
    var snap = canvas.toDataURL('image/jpeg');
    $.ajax({
        type: "GET",
        url: "https://maps.googleapis.com/maps/api/geocode/json",
        data: {
            latlng: lat + "," + long,
            key: apiKey
        },
        success: function(data) {
            callback(data.results[0].formatted_address);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

$('#tagsBtnStart').click(function(){
  recognition.start();
});

$('#tagsBtnEnd').click(function(){
  recognition.stop();
});

$('#tagsNext').click(function(){
  $("#snapModal").hide();
});

if (!('webkitSpeechRecognition' in window)) {
    //Speech API not supported here…
} else { //Let’s do some cool stuff :)
    var recognition = new webkitSpeechRecognition(); //That is the object that will manage our whole recognition process.
    recognition.continuous = true; //Suitable for dictation.
    recognition.interimResults = true; //If we want to start receiving results even if they are not final.
    //Define some more additional parameters for the recognition:
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1; //Since from our experience, the highest result is really the best...
}


recognition.onstart = function() {
  $('#liveIcon').show();
  $('#tagsBtnEnd').show();
};

recognition.onend = function() {
  $('#liveIcon').hide();
  $('#tagsBtnEnd').hide();
};

$('#tagsInput').tagsinput({
      allowDuplicates: false,
        itemValue: 'id',  // this will be used to set id of tag
        itemText: 'label' // this will be used to set text of tag
    });

recognition.onresult = function(event) { //the event holds the results
    //Yay – we have results! Let’s check if they are defined and if final or not:
    if (typeof(event.results) === 'undefined') { //Something is wrong…
        recognition.stop();
        return;
    }

    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) { //Final results
            var currTag =  event.results[i][0].transcript.toLowerCase();
            $('#tagsInput').tagsinput('add', {id:currTag ,label:currTag});
             //Of course – here is the place to do useful things with the results.
        } else { //i.e. interim...
          var currTag =  event.results[i][0].transcript.toLowerCase();
          if(currTag === "stop"){
            recognition.stop();
            return;
          }
          //You can use these results to give the user near real time experience.
        }
    } //end for loop
};


$.dynatableSetup({
    features: {
        paginate: false,
        sort: true,
        pushState: false,
        search: false,
        recordCount: false,
        perPageSelect: false
    }
});

$('#collectorList').hide();

$('#collectorList').dynatable();
