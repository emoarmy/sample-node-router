# sample-node-router
Sample-node-router is an attempt to build a node router in under 100 loc.

## Use
let router = require("./lib/router");

To use SNR, place it in you router as so.
let server = http.createServer(function(req, res){
    res = router.run(req, res);
    res.end();
});

## Methods
There are 5 functions that the user can call on SNR
 - router.get, router.post, router.delete, router.put, router.use, router.run

#### get, post, put, delete
Each of these handle the 4 basic request that are expected from an HTTP client.
To instantiate a route one must call:

router.get(path, handler);

The handler will receive the request object from the server, as well as a data
object. It is expected that all handlers return a modified data object.

#### use
router.use creates middleware for a specific path, regardless of http verb.
The middleware has the request and a data object passed into it and should the
object ones it's added on it's output

#### run
router.run takes in req and res, and returns a data object composed from the
applicable middleware and route handler.
It is then up to the user to decide how this data object is sent back to the user
