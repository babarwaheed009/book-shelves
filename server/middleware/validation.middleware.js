const Joi = require("joi");

function validateRequest(schema, request = 'body') {
  return function (req, res, next) {
    const { error } = schema.validate(req[request]);

    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    next();
  };
}

module.exports = validateRequest;
