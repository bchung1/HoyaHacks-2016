$('#searchDonorsBtn').click(function() {
    var tags = $('#tagsInput').val();
    $.ajax({
        type: "GET",
        url: "https://353594a9.ngrok.io/donors",
        data: {
            tags: tags
        },
        success: function(data) {
            donorList.setDonors(data);
        },
        error: function(error) {
            console.log(error);
        }
    });
});

var donorList = new Vue({
    el: '#donorList',
    data: {
        donors: ''
    },
    methods: {
        setDonors: function(donors) {
            this.donors = donors;
            $('#donorList').show();
        }
    }
});
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

$('#donorList').hide();

$('#donorList').dynatable();
