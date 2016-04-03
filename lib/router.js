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
        let obj ={};
        obj[path] = handler;
        _middleware.push(obj);
    };
    let runMiddleware = (req, res) => {
        _middleware.forEach( (_handler) => {
            _handler(req, res);
        });
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
            let data = {};
            let middleware = matchMiddleware(path);
            if(!middleware.done){
                data = middleware.next().value(req, data);
                middleware = middleware.next();
            }
            return matchRoutes(req.method.toLowerCase(),path)(req, data);
        }
    };
};

module.exports = router();
