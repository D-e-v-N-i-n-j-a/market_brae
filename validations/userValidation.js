const Joi = require('joi');

const registerSchema = Joi.object({
  firstname: Joi.string().required(),
  middlename: Joi.string().allow(''),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
