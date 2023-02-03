import { ClientRequestsHandler } from "./server/clientRequestsHandler";
let clientRequestsHandler: ClientRequestsHandler;
clientRequestsHandler = new ClientRequestsHandler();
clientRequestsHandler.listen();
