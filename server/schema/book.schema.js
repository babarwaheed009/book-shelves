const Joi = require("joi");

module.exports.bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  pub_house: Joi.string().required(),
  pub_date: Joi.date().required(),
  genre_id: Joi.number().required(),
  book_img: Joi.required(),
  user_id: Joi.number().required(),
});

module.exports.bookStatusSchema = Joi.object({
    status: Joi.number().required(),
    user_id: Joi.number().required(),
    book_id: Joi.number().required(),
  });