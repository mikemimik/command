'use strict'

const Joi = require('@hapi/joi')
const log = require('npmlog')

const _validateConfig = Symbol('_validateConfig')

const configSchema = Joi.object({
  command: Joi.string().required(),
  describe: Joi.string().required(),
  builder: Joi.function().required(),
  commandClass: Joi.function().class().required()
})

module.exports = class CommandDefinition {
  constructor (config) {
    this.name = this.constructor.name
    this[_validateConfig](config)

    const {
      command,
      describe,
      builder,
      commandClass: CommandClass
    } = config

    return {
      command,
      describe,
      builder,
      handler: function handler (argv) {
        return new CommandClass(argv)
      }
    }
  }

  [_validateConfig] (config) {
    const { error } = configSchema.validate(config)
    if (error) {
      log.error(error.annotate())
      throw error
    }
  }
}
