'use strict'

const log = require('npmlog')

const ValidationError = require('../lib/validation-error')
const cleanStack = require('../lib/clean-stack')

module.exports = class Command {
  constructor (argv) {
    log.pause()
    log.heading = 'nops'

    log.silly('argv', argv)

    // INFO: "FooCommand" => "foo"
    this.name = this.constructor.name.replace(/Command$/, '').toLowerCase()

    // INFO: composed commands are called from other commands, like publish -> version
    this.composed = typeof argv.composed === 'string' && argv.composed !== this.name

    if (!this.composed) {
      // composed commands have already logged the lerna version
      log.notice('cli', `v${argv.lernaVersion}`)
    }

    // INFO: luanch the command
    const runner = async () => {
      const chain = async () => {
        await this.configureEnvironment()
        await this.configureOptions()
        await this.configureProperties()
        await this.configureLogging()
        await this.runValidations()
        await this.runPreparations()
        return this.runCommand()
      }

      chain.then(
        (result) => {
        // TODO: add warnIfHanging() here

          return result
        },
        (err) => {
          if (err.name !== 'ValidationError') {
            log.error('', cleanStack(err, this.constructor.name))
          }

          if (err.name !== 'ValidationError') {
            // TODO: implement writeLogFile()
          }

          // TODO: add warnIfHanging() here
          // INFO: error code is handled by cli.fail()
          throw err
        }
      )
    }

    // INFO: 'hide' irrelevant argv keys from options
    for (const key of ['cwd', '$0']) {
      Object.defineProperty(argv, key, { enumerable: false })
    }

    Object.defineProperty(this, 'runner', {
      value: runner
    })
  }

  // INFO: proxy 'Promise' methods to 'private instance
  then (onResolved, onRejected) {
    return this.runner.then(onResolved, onRejected)
  }

  catch (onRejected) {
    return this.runner.catch(onRejected)
  }

  async configureEnvironment () {}

  async configureOptions () {}

  async configureProperties () {}

  async configureLogging () {
    const { loglevel } = this.options

    if (loglevel) {
      log.level = loglevel
    }

    // INFO: handle log.success()
    log.addLevel('success', 3001, { fg: 'green', bold: true })

    // INFO: create logger that subclesses use
    Object.defineProperty(this, 'logger', {
      value: log.newGroup(this.name)
    })

    // INFO: emit all buffered logs at configured level and higher
    log.resume()
  }

  async runValidations () {}

  async runPreparations () {}

  async runCommand () {
    const proceed = await this.initialize()
    if (proceed) {
      return this.execute()
    }
    // NOTE: early exits set their own exitCode (if non-zero)
  }

  async initialize () {
    throw new ValidationError(this.name, 'initialize() needs to be implemented.')
  }

  async execute () {
    throw new ValidationError(this.name, 'execute() needs to be implemented.')
  }
}
