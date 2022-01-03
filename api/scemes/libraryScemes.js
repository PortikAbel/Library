import Joi from 'joi';

export const registerSceme = Joi.object({
  _id: Joi.number()
    .integer()
    .min(1000000000000)
    .max(9999999999999)
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

  rentDate: Joi.date(),
  returnDate: Joi.date().allow(null),
});

export default { registerSceme, rentScheme };
