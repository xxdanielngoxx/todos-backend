import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'test', 'production')
    .default('local'),
  PORT: Joi.number().default(3000),
});
