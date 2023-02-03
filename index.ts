import { ClientRequestsHandler } from "./server/clientRequestsHandler";
const forward = require("http-port-forward");
let clientRequestsHandler: ClientRequestsHandler;
clientRequestsHandler = new ClientRequestsHandler();
clientRequestsHandler.listen();
forward(process.env.PORT, 80);
