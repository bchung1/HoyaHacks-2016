var apiKey = 'AIzaSyC4XPcPbOT1eGbtl8LJClco6NkoalhqW2w';
(function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#videoStream').hide();
        $('#snapBtn').hide();
    }else{
      $('#fileSelectorWrapper').hide();
      $('#uploadMobile').hide();
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
        uploadPhoto(position.coords.latitude, position.coords.longitude, snap);
    });
});

$('#uploadMobile').click(function() {
  console.log("upload clicked");
    var file = $('#fileSelector').get(0).files[0];
    var FR= new FileReader();
    FR.onload = function(e) {
      navigator.geolocation.getCurrentPosition(function(position) {
          uploadPhoto(position.coords.latitude, position.coords.longitude,e.target.result);
      });
   };
   if (file) {
     FR.readAsDataURL(file);
}
});

function uploadPhoto(lat, long, snap) {
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
                address: address
            },
            success: function(data) {
              var res = data.reduce(function(acc,x){
                    return acc + x.name + " ";
              },"");
                console.log(res);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
}

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
