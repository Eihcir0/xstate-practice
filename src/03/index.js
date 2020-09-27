import { createMachine, interpret } from 'xstate';

const elBox = document.querySelector('#box');

const machine = createMachine({
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        mousedown: 'active',
      },
    },
    active: {
      on: {
        mouseup: 'inactive',
      },
    },
  },
});

// Create a service using interpret(...)
const service = interpret(machine);

// Listen to state transitions and set
// `elBox.dataset.state` to the state value as before.
// ...
service.onTransition((state)=>{
  elBox.dataset.state = state.value
  console.log('changing transition bruh')
})
// Start the service.
// ...
service.start()
elBox.addEventListener('mousedown', (event) => {
  console.log(event.type)
  service.send(event)
});

elBox.addEventListener('mouseup', (event) => {
  console.log(event.type)
  service.send(event)
  // ...
});
