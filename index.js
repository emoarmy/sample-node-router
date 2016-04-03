"use strict";
let router = require("./lib/router");
let http = require("http");

router.use('/', function(req, res){
    res.write("<div>Hello world</div>");
    return res;
});
router.get('/', function(req, res){
    res.write("<div>Food bar</div>");
    return res;
});
let server = http.createServer(function(req, res){
    res = router.run(req, res);
    res.end();
});

server.listen(8080);
