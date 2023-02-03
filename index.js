"use strict";
exports.__esModule = true;
var clientRequestsHandler_1 = require("./server/clientRequestsHandler");
var forward = require("http-port-forward");
var clientRequestsHandler;
clientRequestsHandler = new clientRequestsHandler_1.ClientRequestsHandler();
clientRequestsHandler.listen();
forward(process.env.PORT, 80);
