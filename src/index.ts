import enviroment from "./loadEnviroment.js";
import startServer from "./server/index.js";
import connectToDataBase from "./database/index.js";

const { port, mongodbUrl } = enviroment;

// eslint-disable-next-line no-implicit-coercion
await startServer(+port);
await connectToDataBase(mongodbUrl);
