'use strict'

const requireInject = require('require-inject')
const t = require('tap')

function mockRequire (mocks = {}) {
  const mergedMocks = Object.assign(
    {},
    {
      npmlog: {
        info: () => {},
        error: () => {},
        pause: () => {},
        resume: () => {}
      }
    },
    mocks
  )

  return requireInject('../../src/definition', mergedMocks)
}

t.test('should export a class (function)', (t) => {
  t.plan(1)
  const CommandDefinition = mockRequire()
  t.equal(typeof CommandDefinition, 'function', 'should export a class (function)')
})

t.test('should validate config', (t) => {
  t.plan(4)
  t.test('should validate config.command property', (t) => {
    t.plan(2)
    t.test('should validate property exists', (t) => {
      t.plan(1)
      const CommandDefinition = mockRequire()
      const config = {
        describe: 'something',
        builder: () => {},
        commandClass: class MockCmd {}
      }
      t.throws(
        () => new CommandDefinition(config),
        {
          name: 'ValidationError',
          message: '"command" is required'
        },
        'should validate command property exists'
      )
    })

    t.test('should validate property type', (t) => {
      t.plan(1)
      const CommandDefinition = mockRequire()
      const config = {
        command: 123,
        describe: 'something',
        builder: () => {},
        commandClass: class MockCmd {}
      }
      t.throws(
        () => new CommandDefinition(config),
        {
          name: 'ValidationError',
          message: '"command" must be a string'
        },
        'should validate command property type'
      )
    })
  })
  t.test('should validate config.describe property', (t) => {
    t.plan(2)
    t.test('should validate property exists', (t) => {
      t.plan(1)
      const CommandDefinition = mockRequire()
      const config = {
        command: 'foo',
        builder: () => {},
        commandClass: class MockCmd {}
      }
      t.throws(
        () => new CommandDefinition(config),
        {
          name: 'ValidationError',
          message: '"describe" is required'
        },
        'should validate describe property exists'
      )
    })
    t.test('should validate property type', (t) => {
      t.plan(1)
      const CommandDefinition = mockRequire()
      const config = {
        command: 'foo',
        describe: 123,
        builder: () => {},
        commandClass: class MockCmd {}
      }
      t.throws(
        () => new CommandDefinition(config),
        {
          name: 'ValidationError',
          message: '"describe" must be a string'
        },
        'should validate describe property type'
      )
    })
  })
  t.test('should validate config.builder property', (t) => {
    t.plan(2)
    t.test('should validate property exists', (t) => {
      t.plan(1)
      const CommandDefinition = mockRequire()
      const config = {
        command: 'foo',
        describe: 'something',
        commandClass: class MockCmd {}
      }
      t.throws(
        () => new CommandDefinition(config),
        {
          name: 'ValidationError',
          message: '"builder" is required'
        },
        'should validate builder property exists'
      )
    })
    t.test('should validate property type', (t) => {
      t.plan(1)
      const CommandDefinition = mockRequire()
      const config = {
        command: 'foo',
        describe: 'something',
        builder: 'not a function',
        commandClass: class MockCmd {}
      }
      t.throws(
        () => new CommandDefinition(config),
        {
          name: 'ValidationError',
          message: '"builder" must be of type function'
        },
        'should validate builder property type'
      )
    })
  })
  t.test('should validate config.commandClass property', (t) => {
    t.plan(2)
    t.test('should validate property exists', (t) => {
      t.plan(1)
      const CommandDefinition = mockRequire()
      const config = {
        command: 'foo',
        describe: 'something',
        builder: () => {}
      }
      t.throws(
        () => new CommandDefinition(config),
        {
          name: 'ValidationError',
          message: '"commandClass" is required'
        },
        'should validate commandClass property exists'
      )
    })
    t.test('should validate property type', (t) => {
      t.plan(2)
      const CommandDefinition = mockRequire()
      const config = {
        command: 'foo',
        describe: 'something',
        builder: () => {},
        commandClass: 'not a class'
      }
      t.throws(
        () => new CommandDefinition(config),
        {
          name: 'ValidationError',
          message: '"commandClass" must be of type function'
        },
        'should validate commandClass property type'
      )
      t.throws(
        () => new CommandDefinition({
          command: 'foo',
          describe: 'something',
          builder: () => {},
          commandClass: () => {}
        }),
        {
          name: 'ValidationError',
          message: '"commandClass" must be a class'
        },
        'should validate commandClass property type'
      )
    })
  })
})

t.test('should return an object', (t) => {
  t.plan(5)
  t.test('result should be object', (t) => {
    t.plan(1)
    const CommandDefinition = mockRequire()
    const config = {
      command: 'foo',
      describe: 'the foo command',
      builder: () => {},
      commandClass: class MockCmd {}
    }
    const definition = new CommandDefinition(config)
    t.equal(typeof definition, 'object', 'should result in an object')
  })

  t.test('should have command property', (t) => {
    t.plan(2)
    const CommandDefinition = mockRequire()
    const config = {
      command: 'foo',
      describe: 'the foo command',
      builder: () => {},
      commandClass: class MockCmd {}
    }
    const definition = new CommandDefinition(config)
    t.ok(definition.command, 'should have property')
    t.equal(definition.command, config.command, 'should have submitted config')
  })

  t.test('should have describe property', (t) => {
    t.plan(2)
    const CommandDefinition = mockRequire()
    const config = {
      command: 'foo',
      describe: 'the foo command',
      builder: () => {},
      commandClass: class MockCmd {}
    }
    const definition = new CommandDefinition(config)
    t.ok(definition.describe, 'should have property')
    t.equal(definition.describe, config.describe, 'should have submitted config')
  })

  t.test('should have builder property', (t) => {
    t.plan(2)
    const CommandDefinition = mockRequire()
    const config = {
      command: 'foo',
      describe: 'the foo command',
      builder: () => {},
      commandClass: class MockCmd {}
    }
    const definition = new CommandDefinition(config)
    t.ok(definition.builder, 'should have property')
    t.equal(definition.builder, config.builder, 'should have submitted config')
  })

  t.test('should have handler property', (t) => {
    t.plan(2)
    const CommandDefinition = mockRequire()
    const config = {
      command: 'foo',
      describe: 'the foo command',
      builder: () => {},
      commandClass: class MockCmd {}
    }
    const definition = new CommandDefinition(config)
    t.ok(definition.handler, 'should have property')
    t.equal(
      typeof definition.handler,
      'function',
      'should have handler function'
    )
  })
})

t.test('should have handler function', (t) => {
  t.plan(1)
  t.test('should return instance of commandClass', (t) => {
    t.plan(2)
    const CommandDefinition = mockRequire()
    const mockArgv = ['subCmd', 'value']
    const MockCmd = class MockCmd {
      constructor (argv) {
        t.deepEqual(argv, mockArgv, 'should get argv passed in')
      }
    }
    const config = {
      command: 'foo',
      describe: 'the foo command',
      builder: () => {},
      commandClass: MockCmd
    }
    const definition = new CommandDefinition(config)
    const handlerResult = definition.handler(mockArgv)
    t.ok(handlerResult instanceof MockCmd, 'should be instance of command')
  })
})
