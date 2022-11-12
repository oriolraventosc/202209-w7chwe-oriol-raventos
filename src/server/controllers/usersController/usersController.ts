import enviroment from "../../../loadEnviroment.js";
import debugCreator from "debug";

const debug = debugCreator(`${enviroment.debug}controllers`);

export const userRegister = () => {
  debug("Register!");
};

export const userLogin = () => {
  debug("Login!");
};
