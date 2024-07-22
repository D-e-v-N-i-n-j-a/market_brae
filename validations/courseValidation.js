const Joi = require('joi');

const createCourseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  adminId: Joi.number().integer().required()
});

const addCourseMaterialSchema = Joi.object({
  courseId: Joi.number().integer().required(),
  type: Joi.string().required()  // This could be more specific based on the types of files you expect
});

const likeCourseSchema = Joi.object({
  courseId: Joi.number().integer().required(),
  userId: Joi.number().integer().required()
});

const addCommentSchema = Joi.object({
  content: Joi.string().required(),
  courseId: Joi.number().integer().required(),
  userId: Joi.number().integer().required()
});

module.exports = {
  createCourseSchema,
  addCourseMaterialSchema,
  likeCourseSchema,
  addCommentSchema
};
