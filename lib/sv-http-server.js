exports = module.exports = function(type, handler) {

    return function(req, res, next) {
        if (req.url === '/__event/'+type) {
            var body = '';
            req.on("data",function(chunk){
                body += chunk.toString();
            });
            req.on("end",function(){
                var data = JSON.parse(body);
                data.__req = req;
                data.__res = res;
                handler(data, function(type, data) {
                    res.send(JSON.stringify({type: type, data: data}));
                });
            });
        } else {
            next();
        }
    };

};