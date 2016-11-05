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

    function snapshot() {
        if (localMediaStream) {
            canvas.width = video.videoWidth - 70;
            canvas.height = video.videoHeight
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            context.imageSmoothingEnabled = false;
            // "image/webp" works in Chrome.
            // Other browsers will fall back to image/png.
            var snap = canvas.toDataURL('image/webp');
            $("#snap").attr("src", snap);
        }
    }

    $("#snapBtn").click(function() {
        snapshot();
    });

    $("#upload").click(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            uploadPhoto(position.coords.latitude, position.coords.longitude);
        });
    });

    function uploadPhoto(lat, long) {
        var snap = canvas.toDataURL('image/webp');
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/photo",
            data: {
                snap: snap,
                location: {
                    lat: lat,
                    long: long
                }
            },
            success: function(data) {

            }
        });
    }

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