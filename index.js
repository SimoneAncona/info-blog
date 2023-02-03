"use strict";
exports.__esModule = true;
var clientRequestsHandler_1 = require("./server/clientRequestsHandler");
var clientRequestsHandler;
clientRequestsHandler = new clientRequestsHandler_1.ClientRequestsHandler();
clientRequestsHandler.listen();
