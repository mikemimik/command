'use strict'

const requireInject = require('require-inject')
const t = require('tap')

function mockRequire (mocks = {}) {
  const mergedMocks = Object.assign(
    {},
    {
      '../src/command': class MockCmdClass {},
      '../src/definition': class MockDfnClass {}
    },
    mocks
  )
  return requireInject('../index.js', mergedMocks)
}

t.test('should export classes', (t) => {
  t.plan(3)
  const index = mockRequire()
  t.equal(typeof index, 'object', 'should be a module object')
  t.ok(index.Command, 'should have Command class export')
  t.ok(index.Definition, 'should have Definition class export')
})
