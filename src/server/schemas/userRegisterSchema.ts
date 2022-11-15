import { Joi } from "express-validation";

const userRegisterValidation = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
};

export default userRegisterValidation;
