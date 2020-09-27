import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');

const randomFetch = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        rej('Fetch failed!');
      } else {
        res('Fetch succeeded!');
      }
    }, 500);
  });
};

const machine = createMachine({
  initial: 'idle',
  context: {
    fails: 0,
  },
  states: {
    idle: {
      on: {
        FETCH: 'pending',
      },
    },
    pending: {
      invoke: {
        src: randomFetch,
        onDone: {
            target: 'resolved',
            actions: assign({
              fails: ()=>0,
            }),
          },
        onError: [
          { target: 'maxRetries', cond: c => {
            console.log(c)
            console.log(c.fails)
            return c.fails > 1
          }},
          {
            actions: assign({
              fails: (c,e) =>{
                console.log('hoagies!!')
                console.log(c)
                return c.fails + 1
              },
            }),
            target: 'rejected'
          },
        ],
      },
    },
    maxRetries: {
      entry: {
        actions: ()=>console.log('MAX RETRIES!!')
      },
      type: 'final',
    },
    resolved: {
      on: {
        FETCH: 'pending',
      },
    },
    rejected: {
      on: {
        FETCH: 'pending',
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  elBox.dataset.state = state.toStrings().join(' ');

  console.log(state);
});

service.start();

elBox.addEventListener('click', (event) => {
  service.send('FETCH');
});
