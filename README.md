# sv-aloha

Installation
------------

    npm install sv-aloha

1. copy js files from ``sv-aloha/client`` to your public folder 
2. add ``jquery`` and ``sv.js`` reference to your html document


    <script src="/javascripts/jquery.min.js"></script>
    <script src="/javascripts/sv.js"></script>
    
Syntax
------------

## Define simple controller

Add ``sv-controller`` attribute to any html tag on your html page

    <div sv-controller="mycontroller">
    </div>

Add controller definition in your js file

    SV.controller('mycontroller', function(el) {
        console.log("controller instance created for element " + el);    
    });
    
## Events

### Fire event

To raise controller event your can use the following
    
    SV.controller('mycontroller', function(el) {
        ...
        SV.fire(el, "myEventType", {someField: "anyValue"});
        ...
    });
    
this event will be processed by closest parent controller in DOM subscribes this event type

    this.on = {};
    this.on["myEventType"] = function(data, next) {
    
        if (data.someFiled === "anyValue") {
            console.log("got it");
        } else {
            next();
        }    
    }
    
Method ``next()`` routes event to next parent controller in DOM

### Emmit event

If event should be handled by all controllers in any DOM branches and level SV.emmit can be used
Like this:

    SV.emmit("eventType", {someField: "anyValue"});


### Emmit / Fire example:

    <script> 
        SV.controller('c1', function(el) {
            this.on = {};
            this.on["e1"] = function(data, next) {
                console.log("c1: " + data);    
            }
            this.on["e2"] = function(data, next) {
                console.log("c1: " + data);    
            }
        });
        SV.controller('c2', function(el) {
            this.on = {};
            this.on["e1"] = function(data, next) {
                console.log("c2: " + data);
                if (data == 1) next();
            }
        });
        SV.controller('c3', function(el) {
            SV.fire(el, "e1", 1);
            console.log("---");
            SV.fire(el, "e1", 1.1);
            console.log("---");
            SV.fire(el, "e2", 2);
            console.log("---");
            SV.emmit("e1", 1.2);
        });
    </script>
    
    <div sv-controller="c1">
        <div sv-controller="c2">
            <div sv-controller="c3"></div>
        </div>
    </div>

    
will produce the following in js console:

    c2: 1
    c1: 1
    ---
    c2: 1.1
    ---
    c1: 2
    ---
    c1: 1.2
    c2: 1.2

### Click events

to be defined

## DOM modification

to be defined

## Async HTTP calls

to be defined
