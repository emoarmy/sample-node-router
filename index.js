"use strict";
let router = require("./lib/router");
let http = require("http");

router.default('/', function(res){
        res.write("Hello World");
        res.end();
});
let server = http.createServer(function(req, res){
    router.run(req, res);
});

server.listen(8080);
