"use strict";

function middleware(req, res, handler, func){
    return func(req, res, handler);
}
let url = require('url');
let router = () => {
    let _routes = {
        "get":{},
        "post":{},
        "put":{},
        "delete":{},
        "_404": {}
    };
    let _middleware = [];

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
    let matchMiddleware = function* (path){
        let index=0;
        for(; index<_middleware.length; index++){
            if(_middleware[index][path]){
                yield _middleware[index][path];
            }
        }
    };
    let addMiddleware = (path, handler) => {
        _middleware[path] = handler;
    };
    let runMiddleware = (req, res) => {
        _middleware.forEach( (_handler) => {
            _handler(req, res);
        });
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
        use: (path, handler) => {
            addMiddleware(path, handler);
        },
        run: (req, res) =>{
            let path = url.parse(req.url, true).pathname;
            let middleware = matchMiddleware(path);
            if(!middleware.done && res){
                res = middleware.value(res);
                middleware = middleware.next();
            }
            let data = process(req);
            matchRoutes("get", path)(data, res);
        }
    };
};

module.exports = router();
