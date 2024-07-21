
const Joi = require('joi');

const registerSchema = Joi.object({
  firstname: Joi.string().max(255).required(),
  middlename: Joi.string().max(255).optional(),
  lastname: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(6).max(255).required(),
  phone: Joi.string().max(15).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(6).max(255).required()
});

module.exports = {
  registerSchema,
  loginSchema
};
