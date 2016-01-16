var sv_core = new function() {

    var self = this;
    var controllerList = [];

    this.controller = function(name, func) {
        controllerList[name] = func;
    };

    this.initControllers = function(el) {
        el.find('[sv-click]').bind("click", onClick);
        var c = el.find('[sv-controller]');
        for (var i = 0; i < c.length; i++) {
            var func = controllerList[$(c[i]).attr('sv-controller')];
            if (func) {
                c[i].svController = new func(c[i]);
            }
        }
    };

    this.destroyControllers = function(el) {
        var c = el.find('[sv-controller]');
        for (var i = 0; i < c.length; i++) {
            var controller = c[i].svController;
            if (controller && controller.destroy) {
                controller.destroy();
            }
        }
        el.find('[sv-click]').unbind("click");
    };

    this.html = function(el, html) {
        var _el = $(el);
        this.destroyControllers(_el);
        try {
            _el.html(html);
        } catch(e){};
        this.initControllers(_el);
    };

    var onClick = function(e) {
        var link = $(e.currentTarget).attr('sv-click');
        var c = e.currentTarget;
        if (!self.fire(c, link, e)) cancelDefaultAction(e);
    };

    this.fire = function(el, link, data) {
        var c = $(el);
        c.push.apply(c, $(el).parents('[sv-controller]'));
        var next = true;
        for (var i = 0; i < c.length ; i++) {
            var cont = c[i].svController;
            if (!cont || !cont.on) continue;
            var handler = null;
            if (link && cont.on[link]) {
                handler = cont.on[link];
            } else if (typeof cont.on == 'function') {
                handler = cont.on;
            } else {
                continue;
            }

            next = false;
            handler(data, function() {
                next = true;
            });
            if (!next) break;

        }
        return next;
    };

    this.emmit = function(link, data) {
        var c = $.find('[sv-controller]');
        for (var i = 0; i < c.length; i++) {
            if (c[i].svController && c[i].svController.on && c[i].svController.on[link]) {
                c[i].svController.on[link](data, function() {});
            }
        }
    };

    var cancelDefaultAction = function(e) {
        var evt = e ? e:window.event;
        if (evt.preventDefault) evt.preventDefault();
        evt.returnValue = false;
        return false;
    };
};

$(document).ready(function() {
    SV.initControllers($('body'));
});

var SV = $.extend(SV, sv_core);
