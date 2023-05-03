import { ClientRequestsHandler } from "./server/clientRequestsHandler.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const forward = require("http-port-forward");
let clientRequestsHandler;
clientRequestsHandler = new ClientRequestsHandler();
clientRequestsHandler.listen();
forward(process.env.PORT, 80);
