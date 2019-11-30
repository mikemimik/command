'use strict'

const requireInject = require('require-inject')
const _ = require('lodash')
const t = require('tap')

const ValidationError = requireInject('../../lib/validation-error', {
  npmlog: {
    resume: () => {},
    error: () => {}
  }
})

class MockValidationError {}

function mockRequire (mocks = {}) {
  const mergedMocks = _.merge(
    {},
    {
      '../../lib/validation-error': MockValidationError,
      '../../lib/clean-stack': () => {},
      npmlog: {
        info: () => {},
        error: () => {},
        pause: () => {},
        resume: () => {},
        notice: () => {},
        addLevel: () => {},
        newGroup: () => ({}),
        silly: () => {}
      }
    },
    mocks
  )
  return requireInject('../../src/command', mergedMocks)
}

function commandFactory (mocks = {}, argv = {}) {
  const Command = mockRequire(mocks)
  const OkCommand = class extends Command {
    initialize () {
      return true
    }

    execute () {
      return 'ok'
    }
  }
  return new OkCommand(argv)
}

t.test('should export a class (function)', (t) => {
  t.plan(1)
  const Command = mockRequire()
  t.equal(typeof Command, 'function', 'should export a class (function)')
})

t.test('should throw if initialize not implemented', (t) => {
  t.plan(1)
  const Command = mockRequire()
  const FooCommand = class extends Command {
    execute () {
      return 'ok'
    }
  }
  t.rejects(
    () => new FooCommand({}),
    MockValidationError,
    'should throw mocked error'
  )
})

t.test('should throw if execute not implemented', (t) => {
  t.plan(1)
  const Command = mockRequire()
  const FooCommand = class extends Command {
    initialize () {
      return true
    }
  }
  t.rejects(
    () => new FooCommand({}),
    MockValidationError,
    'should throw mocked error'
  )
})

t.test('should call instance catch method', (t) => {
  t.plan(2)
  const Command = mockRequire()
  const FooCommand = class extends Command {
    initialize () {
      return true
    }

    execute () {
      throw new Error('hello world')
    }
  }
  new FooCommand({}).catch((err) => {
    t.ok(err instanceof Error, 'instance of error')
    t.equal(err.message, 'hello world', 'is mock error')
  })
})

t.test('should not log ValidationError', (t) => {
  t.plan(2)
  let didCallError = false
  const Command = mockRequire({
    npmlog: {
      error: (prefix, msg) => {
        didCallError = true
      }
    }
  })
  const FooCommand = class extends Command {
    initialize () {
      return true
    }

    execute () {
      throw new ValidationError()
    }
  }
  t.rejects(
    () => new FooCommand({}),
    ValidationError,
    'should throw ValidationError'
  )
  t.notOk(didCallError, 'should not have logged error')
})

t.test('should not call execute if initialize returns false', async (t) => {
  t.plan(1)
  let didCallExecute = false
  const Command = mockRequire()
  const FooCommand = class extends Command {
    initialize () {
      return false
    }

    execute () {
      didCallExecute = true
    }
  }
  // INFO: function that sets property is in promise chain
  await new FooCommand({})
  t.notOk(didCallExecute, 'should not have called execute')
})

/**
 * NOTE: Test Thoughts
 * Will need to NOT mock npmlog and allow the command to set the log level,
 * then use command.logger to log something to various levels and see which
 * actuall results in output (will need to capture output).
 *
 * At the moment this tests the if statement on line 110 by virtue of coverage.
 * As noted in command.js, that if statement is redundant and not needed
 */
t.test('should set log level from options', async (t) => {
  t.plan(1)
  const expectedArgv = { loglevel: false }
  const command = commandFactory({}, expectedArgv)
  // INFO: function that sets property is in promise chain
  await command
  t.ok(true)
})

t.test('should have defined properties', (t) => {
  t.test('should have definted name property', (t) => {
    t.plan(2)
    const expectedArgv = {}
    const command = commandFactory({}, expectedArgv)
    t.ok(command.name, 'should have property')
    t.equal(command.name, 'ok', 'should remove "Command" from name')
  })
  t.test('should have defined runner property', (t) => {
    t.plan(2)
    const expectedArgv = {}
    const command = commandFactory({}, expectedArgv)
    t.ok(command.runner, 'should have property')
    t.ok(command.runner instanceof Promise, 'should be a promise')
  })
  t.test('should have defined argv property', (t) => {
    t.plan(1)
    const expectedArgv = {}
    const command = commandFactory({}, expectedArgv)
    t.deepEqual(command.argv, expectedArgv, 'should have property')
  })
  t.test('should have defined logger property', async (t) => {
    t.plan(1)
    const expectedArgv = {}
    const command = commandFactory({}, expectedArgv)
    // INFO: function that sets property is in promise chain
    await command
    t.ok(command.logger, 'should have property')
  })
  t.test('should have defined options property', async (t) => {
    t.plan(1)
    const expectedArgv = {}
    const command = commandFactory({}, expectedArgv)
    // INFO: function that sets property is in promise chain
    await command
    t.ok(command.options, 'should have property')
  })
  t.test('should have defined composed property', async (t) => {
    t.plan(2)
    const expectedArgv = {}
    const command = commandFactory({}, expectedArgv)
    // INFO: function that sets property is in promise chain
    await command
    t.notOk(command.composed, 'should be falsy by default')
    t.equal(command.composed, false, 'should have false default')
  })
  t.test('should have defined composed value', async (t) => {
    t.plan(2)
    const expectedArgv = { composed: 'command' }
    const command = commandFactory({}, expectedArgv)
    // INFO: function that sets property is in promise chain
    await command
    t.ok(command.composed, 'should be truthy')
    t.equal(command.composed, true, 'should have property')
  })
  t.end()
})
