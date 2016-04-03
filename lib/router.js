"use strict";
let url = require('url');
let router = () => {
    let _routes = {
        "get":{},
        "post":{},
        "put":{},
        "delete":{},
        "_404": {}
    };
    let _middleware = {};
    let addRoute = (type, path, handler) => {
        _routes[type][path] = handler;
    };
    let matchRoutes = (type, path) => {
        if(_routes[type][path]){
            return _routes[type][path];
        } else {
            return _routes._404;
        }
    };
    let addMiddleware = (path, handler) => {
        if(matchMiddleware(path)){
            return console.error("Can not overwrite middleware route");
        }
        _middleware[path] = handler;
    };
    let matchMiddleware = (path) => {
        if(_middleware[path]){
            return _middleware[path];
        } else{
            return null;
        }
    };
    let process = (req) => {
        let data ='';
        req.on("data", function(chunk) {
            console.log("chunk", data);
            data += chunk;
        });
        return data;
    };
    return {
        get : (path, handler) => {
            addRoute("get", path, handler);
        },
        post : (path, handler) => {
            addRoute("post", path, handler);
        },
        put : (path, handler) => {
            addRoute("put", path, handler);
        },
        delete : (path, handler) => {
            addRoute("delete", path, handler);
        },
        middleware: (path, handler) => {
            addMiddleware(path, handler);
        },
        run: (req, res) =>{
            let path = url.parse(req.url, true).pathname;
            let middleware = matchMiddleware(path);
            if(middleware){
                let req, res = middleware(req, res);
            }
            let data = process(req);
            matchRoutes("get", path)(data, res);
        }
    };
};

module.exports = router();
