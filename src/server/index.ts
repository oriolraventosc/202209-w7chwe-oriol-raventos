import enviroment from "../loadEnviroment.js";
import debugCreator from "debug";
import chalk from "chalk";
import app from "./app.js";

const debug = debugCreator(`${enviroment.debug}server`);

const startServer = async (port: number) => {
  await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green.bold(`Server connected on port ${port}`));
      resolve(server);
    });
    server.on("error", (error: Error) => {
      debug(chalk.red.bold("Error connecting with the server"));
      reject(error);
    });
  });
};

export default startServer;
