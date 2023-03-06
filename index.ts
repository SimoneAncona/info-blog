import { ask } from "./server/autoFetch";
import { ClientRequestsHandler } from "./server/clientRequestsHandler";
const forward = require("http-port-forward");
let clientRequestsHandler: ClientRequestsHandler;
clientRequestsHandler = new ClientRequestsHandler();
clientRequestsHandler.listen();
forward(process.env.PORT, 80);

a();

async function a() {

    console.log(await ask("how to print in c"))
}