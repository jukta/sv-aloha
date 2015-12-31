var WebSocketServer = require('ws').Server;

var createApp = function(otps) {

    var options = otps || {}
        , session = options.session
        , cookieParser = options.cookieParser
        , port = options.port || 8090
        , maxUsers = options.maxUsers || 10000;

    var app = {};
    var handlers = {};

    app.on = function(type, cb) {
        handlers[type] = cb;
    };

    app.off = function(type) {
      delete handlers[type];
    };

    wss = new WebSocketServer({port: port});

    var store = null;

    wss.on('connection', function(ws) {
        if (wss.clients.length > maxUsers) {
            return ws.close();
        }

        cookieParser(ws.upgradeReq, null, function(err) {
            session(ws.upgradeReq, {}, function(err) {
                ws.sessionID = ws.upgradeReq.sessionID;
                store = ws.upgradeReq.sessionStore;
            });
        });

        ws.pingssent = 0;
        ws.on('message', function (message) {
            try {
                var e = JSON.parse(message);
            } catch (ex) {
                ws.close();
            }
            var cb = handlers[e.type];
            if (cb) {
                var message = {
                    type: e.type,
                    data: e.data
                };
                if (store && ws.sessionID) {
                    store.get(ws.sessionID, function (err, session) {
                        message.session = session;
                        message.sessionID = ws.sessionID;
                        cb(message);
                    });
                } else {
                    cb(message);
                }
            } else {
                ws.close();
            }
        });
        ws.on('error', function(message) {

        });
        ws.on("pong", function() {
            ws.pingssent = 0;
        });
    });

    app.emmit = function(type, data, sessionID) {
        for(var i in wss.clients) {
            var c = wss.clients[i];
            if ((!sessionID || c.sessionID === sessionID) && c.readyState == c.OPEN) {
                c.send(JSON.stringify({type: type, data: data}));
            }
        }
    };

    setInterval(function(){
        var cl = 0;
        for(var i in wss.clients) {
            var c = wss.clients[i];
            if (c.readyState != c.OPEN) continue;
            if (c.pingssent >= 1) {
                c.close();
                cl++;
            } else {
                c.ping();
                c.pingssent++;
            }
        }
//        console.log('Closing ' + cl + '/' + wss.clients.length);
    }, 60 * 1000);

    return app;
};

exports = module.exports = createApp;


