"use strict";

const joi = require("joi");
const validator = require("./makeValidator");

const registerSchema = joi.object({
    username: joi.string()
        .min(3)
        .token()
        .lowercase()
        .required(),

    email: joi.string()
        .email()
        .required(),

    password: joi.string()
        .min(6)
        .required()
});

const validateRegistration = validator.makeValidator(registerSchema);

module.exports = {
    validateRegistration
}
