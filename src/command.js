'use strict'

const log = require('npmlog')
const _ = require('lodash')

const ValidationError = require('../lib/validation-error')
const cleanStack = require('../lib/clean-stack')

module.exports = class Command {
  constructor (argv) {
    log.pause()
    // TODO: figure out how to set this
    log.heading = 'cli'

    log.silly('argv', argv)

    // INFO: "FooCommand" => "foo"
    this.name = this.constructor.name.replace(/Command$/, '').toLowerCase()

    // INFO: composed commands are called from other commands, like publish -> version
    this.composed = typeof argv.composed === 'string' && argv.composed !== this.name

    if (!this.composed) {
      // composed commands have already logged the lerna version
      log.notice('cli', `v${argv.cliVersion}`)
    }

    // INFO: luanch the command
    const runner = (async () => {
      try {
        await this.configureEnvironment()
        await this.configureOptions()
        await this.configureProperties()
        await this.configureLogging()
        await this.runValidations()
        await this.runPreparations()
        const result = await this.runCommand()
        // TODO: add warnIfHanging() here
        return result
      } catch (err) {
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
    })()

    // // INFO: 'hide' irrelevant argv keys from options
    // for (const key of ['cwd', '$0']) {
    //   Object.defineProperty(argv, key, { enumerable: false })
    // }

    Object.defineProperty(this, 'argv', {
      value: Object.freeze(argv)
    })

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

  async configureEnvironment () {
    const loglevel = 'error'
    const progress = false

    Object.defineProperty(this, 'envDefaults', {
      value: {
        progress,
        loglevel
      }
    })
  }

  async configureOptions () {
    this.options = _.defaults(
      {},
      this.argv,
      this.envDefaults
    )
  }

  async configureProperties () {}

  async configureLogging () {
    const { loglevel } = this.options

    /**
     * NOTE: redundant if statement
     * loglevel will default to 'error', which means it will always be set,
     * and truthy
     */
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
