$( document ).ready(function() {
  $('#collectorButton').onClick(function(){
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/searchRep",
        success: function(data) {
          
        },
        error: function(error) {
            console.log(error);
        }
    });
  });

});
