import { createMachine } from 'xstate'
const elBox = document.querySelector('#box');

const machine = {
  initial: 'inactive',
  states: {
    'inactive': {
      on: {
        TOGGLE: 'active',
      }
    },
    'active': {
      on: {
        TOGGLE: 'inactive',
      }
    }
  }
}

const toggleMachine = createMachine(machine)

