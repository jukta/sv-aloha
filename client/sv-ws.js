var sv_ws = new function() {

    var self = this;
    var handlers = {};

    this.on = function(type, cb) {
        handlers[type] = cb;
    };

    this.off = function(type) {
        delete handlers[type];
    };

    this.emmit = function(type, data) {
        if (!self.ws || self.ws.readyState != 1) {
            return;
        }
        var e = {type:type, data: data};
        self.ws.send(JSON.stringify(e));
    };

    var port = 8090;

    this.open = function() {
        checkConnection();
        self.interval = setInterval(function () {
            checkConnection();
        }, 1000);
    };

    this.close = function() {
        clearInterval(self.interval);
        self.ws.close();
    };

    var checkConnection = function () {
        if (self.ws && self.ws.readyState != 3) {
            return;
        }
        self.ws = new WebSocket("ws://" + location.hostname + ":" + port + "/");

        self.ws.onmessage = function (event) {
            var e = JSON.parse(event.data);
            var cb = handlers[e.type];
            if (cb) {
                cb(e.type, e.data);
            }
        };

        self.ws.onclose = function (evt) {

        };
    };
};

var SV = $.extend(SV, {ws: sv_ws});