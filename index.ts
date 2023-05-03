import { ask } from "./server/autoFetch.js";
import { ClientRequestsHandler } from "./server/clientRequestsHandler.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const forward = require("http-port-forward");
let clientRequestsHandler: ClientRequestsHandler;
clientRequestsHandler = new ClientRequestsHandler();
clientRequestsHandler.listen();
forward(process.env.PORT, 80);

// a();

// async function a() {

//     console.log(await ask("how to print in c"))
// }