# command
Command class used with cli-project

## Description


## Installation
In your project, run the following command to get the latest version of the
module:

```
npm install @mikemimik/command
```

## Usage
```javascript
// some-command.js

'use strict'

const { Command, Definition } = require('@mikemimik/command')

class SomeCommand extends Command {

  /**
   * NOTE: Implement methods
   * The following commands need to be implemented in order for the command
   * to function correctly.
   *
   * initialize(): Run code to setup things needed for execution. This function
   * should return a promise, which resolves to a boolean. If true, the
   * execution method will be run.
   *
   * execute(): Run action to be taken by this command
   */
  async initialize () {
    // Some initialization code
  }

  async execute () {

  }
}

const definition = new Definition({
  command: 'some <args>',
  describe: 'Some command that will do things.',
  builder: (yargs) => {
    return yargs
  },
  commandClass: SomeCommand
})

module.exports = definition
module.exports.command = SomeCommand
```
