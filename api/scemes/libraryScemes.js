import Joi from 'joi';

export const registerSceme = Joi.object({
  _id: Joi.number()
    .integer()
    .min(0)
    .required(),

  title: Joi.string()
    .max(30),

  author: Joi.string()
    .max(30),

  releasedate: Joi.date(),

  summary: Joi.string()
    .max(100),

  copies: Joi.number()
    .integer()
    .min(0),

  imageName: Joi.string(),
});

export const rentScheme = Joi.object({
  renter: Joi.string()
    .alphanum()
    .max(30)
    .required(),

  isbn: Joi.number()
    .integer()
    .min(0)
    .required(),

  date: Joi.date(),
});

export default { registerSceme, rentScheme };
