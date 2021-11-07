import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const userSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().pattern(
    new RegExp("^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$")
  ),
  age: Joi.number().required().min(4).max(130),
});

const userValidator = (schema: Joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).send(error.details);
      return;
    }

    next();
  };
};

export default userValidator(userSchema);
