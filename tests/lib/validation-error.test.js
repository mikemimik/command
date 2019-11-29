'use strict'

const requireInject = require('require-inject')
const t = require('tap')

function mockRequire (mocks = {}) {
  const mergedMocks = Object.assign(
    {},
    {
      npmlog: {
        resume: () => {},
        error: () => {}
      }
    },
    mocks
  )
  return requireInject('../../lib/validation-error', mergedMocks)
}

t.test('should export a class (function)', (t) => {
  const ValidationError = mockRequire()
  t.equal(typeof ValidationError, 'function', 'should export a class (function)')
  t.end()
})

t.test('should be type of Error', (t) => {
  const ValidationError = mockRequire()
  t.ok(ValidationError.prototype instanceof Error, 'should export a class (function)')
  t.end()
})

t.test('error instance', (t) => {
  t.test('basic shape of error instance', (t) => {
    const ValidationError = mockRequire()
    const error = new ValidationError()
    t.ok(error instanceof ValidationError, 'should be an instance of class')
    t.ok(error instanceof Error, 'should be an instance of super class (Error)')
    t.equal(error.name, 'ValidationError', 'should have correct name set')
    t.end()
  })

  t.test('should set error prefix', (t) => {
    const ValidationError = mockRequire()
    const prefix = 'my-cli'
    const error = new ValidationError(prefix)
    t.equal(error.prefix, prefix, 'should set prefix property')
    t.end()
  })

  t.test('should set error message', (t) => {
    const ValidationError = mockRequire()
    const msg = 'hello world'
    const prefix = 'my-cli'
    const error = new ValidationError(prefix, msg)
    t.equal(error.message, msg, 'should set error message')
    t.end()
  })

  t.test('should interact with logging', (t) => {
    let didCallResume = false
    let didCallError = false
    const expectedMessage = 'hello world'
    const expectedPrefix = 'my-cli'
    const ValidationError = mockRequire({
      npmlog: {
        resume: () => {
          didCallResume = true
        },
        error: (prefix, message, ...rest) => {
          didCallError = true
          t.equal(prefix, expectedPrefix, 'should have logged with prefix')
          t.equal(message, expectedMessage, 'should have logged message')
        }
      }
    })
    const error = new ValidationError(expectedPrefix, expectedMessage)
    t.ok(error instanceof ValidationError)
    t.ok(didCallResume, 'should call resume logging')
    t.ok(didCallError, 'should log error')
    t.end()
  })

  t.end()
})
