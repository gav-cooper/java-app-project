"use strict";

const joi = require("joi");
const validator = require("./makeValidator");

const songSchema = joi.object({
    value: joi.string()
        .lowercase(),

    password: joi.string()
        .min(6)
        .required()
});