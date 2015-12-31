var sv_http = new function() {

    this.http = {};

    this.http.emmit = function (type, data) {
        $.ajax({
            type: 'POST',
            url: '/__event/'+type,
            dataType: 'json',
            async: true,
            data: JSON.stringify(data)
        }).done(handleResponse);
    };

    var handleResponse = function(resp) {
        SV.emmit(resp.type, resp.data);
    };
};

var SV = $.extend(SV, sv_http);