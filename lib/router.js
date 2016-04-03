"use strict";
let url = require('url');
let router = () =>{
    let _routes = {
        "get":{},
        "post":{},
        "put":{},
        "delete":{},
        "_404": (res) => {
            res.headers('Content-Type', 'text/html');
            res.write("Unable to find the resource you asked for\n");
            res.end();
        }
    };

    let add = (type, path, handler) => {
        _routes[type][path] = handler;
    };

    let match = (type, path) => {

        if(_routes[type][path]){
            return _routes[type][path];
        } else {
            return _routes._404;
        }
    };
    return {
        get : (path, handler) => {
            add("get", path, handler);
        },
        post : (path, handler) => {
            add("post", path, handler);
        },
        put : (path, handler) => {
            add("put", path, handler);
        },
        delete : (path, handler) => {
            add("delete", path, handler);
        },
        default: (path, handler) => {
            add("get", path, handler);
            add("post", path, handler);
            add("put", path, handler);
            add("delete", path, handler);
        },
        run: (req, res) =>{
            let data ='';
            req.on("data", function(chunk) {
                console.log("chunk", data);
                data += chunk;
            });
            let path = url.parse(req.url, true).pathname;
            match("get", path)(data, res);
        }
    };
};

module.exports = router();
