'use strict'

// const dedent = require('dedent')
const { join } = require('path')
const fs = require('fs')
const t = require('tap')

const cleanStack = require('../../lib/clean-stack')

// const dir = t.testdir({
//   'stack.fixture': dedent`
//     /Users/mperrotte/repos/command/lib/clean-stack.js:6
//     const lines = err.stack ? err.stack.split('/n') : String(err).split('/n')
//                       ^

//     TypeError: Cannot read property 'stack' of undefined
//         at cleanStack (/Users/mperrotte/repos/command/lib/clean-stack.js:6:21)
//         at Object.<anonymous> (/Users/mperrotte/repos/command/poop.js:5:1)
//         at Module._compile (module.js:653:30)
//         at Object.Module._extensions..js (module.js:664:10)
//         at Module.load (module.js:566:32)
//         at tryModuleLoad (module.js:506:12)
//         at Function.Module._load (module.js:498:3)
//         at Function.Module.runMain (module.js:694:10)
//         at startup (bootstrap_node.js:204:16)
//         at bootstrap_node.js:625:3
//   `
// })

t.test('should export a function', (t) => {
  t.equal(typeof cleanStack, 'function', 'should be a function')
  t.end()
})

t.test('should throw if first param is not an object', (t) => {
  t.throws(() => cleanStack(), {}, 'should throw while looking for `.stack`')
  t.end()
})

t.test('should filter stack to incoming command', (t) => {
  const fixturePath = join(__dirname, 'fixtures/command-run.fixture')
  const fixtureStack = fs.readFileSync(fixturePath, 'utf8')
  const error = { stack: fixtureStack }
  const result = cleanStack(error, 'FooCommand')
  t.equal(typeof result, 'string', 'should return string')
  const actualLines = result.split('\n').length
  const expectedLines = 2
  t.equal(actualLines, expectedLines, 'should have trimmed lines')
  t.end()
})

t.test('should NOT filter stack if command does not match', (t) => {
  const fixturePath = join(__dirname, 'fixtures/command-run.fixture')
  const fixtureStack = fs.readFileSync(fixturePath, 'utf8')
  const error = { stack: fixtureStack }
  const result = cleanStack(error, 'NotACommand')
  t.equal(typeof result, 'object', 'should return full error object')
  t.equal(result, error, 'should return passed in error object')
  const actualLines = result.stack.split('\n').length
  const expectedLines = fixtureStack.split('\n').length
  t.equal(actualLines, expectedLines, 'should NOT have trimmed lines')
  t.end()
})

t.test('no stack present in error, convert error to string', (t) => {
  const fixturePath = join(__dirname, 'fixtures/command-stack.fixture')
  const fixtureData = fs.readFileSync(fixturePath, 'utf8')
  const error = fixtureData
  const result = cleanStack(error, 'FooCommand')
  const actualLines = result.split('\n').length
  const expectedLines = fixtureData.split('\n').length
  t.equal(actualLines, expectedLines, 'should NOT have trimmed lines')
  t.end()
})
