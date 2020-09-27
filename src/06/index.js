import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

const machine = createMachine({
  initial: 'checkAuth',
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
    drags: 0,
  },
  states: {
    checkAuth: {
      on: {
        '': [
          {
            target: 'idle',
            cond: 'authorized',
          },
          {
            target: 'unauthorized',
          }
        ]
      }
    },
    idle: {
      on: {
        mousedown: [{
          actions: 'assignPoint',
          target: 'dragging',
          cond: 'belowMaxDrags'
        }],
      },
    },
    unauthorized: {
      entry: 'showUnauthorized',
    },
    draggedOut: {
      entry: [()=>console.log('draggedout'), 'checkDrags'],
      type: 'final',
    },
    dragging: {
      entry: 'incrementDrags',
      exit: ()=>console.log('placing box in new position!! Exciting!! '),
      on: {
        mousemove: {
          actions: 'assignDelta',
        },
        mouseup: [{
          actions: ['assignPosition'],
          cond: 'belowMaxDrags',
          target: 'idle',
        }, {
          actions: ['assignPosition'],
          target: 'draggedOut',
        }],
        'keyup.escape': {
          target: 'idle',
          actions: ['resetPosition', 'decrementDrags']
        },
      },
    },
  },
}, {
  actions: {
    showUnauthorized: () => {
      elBox.dataset.drags = "You're not authorized Jimmy!"
    },
    assignPoint: assign({
      px: (context, event) => event.clientX,
      py: (context, event) => event.clientY,
    }),
    assignPosition: assign({
      x: (context, event) => {
        return context.x + context.dx;
      },
      y: (context, event) => {
        return context.y + context.dy;
      },
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
    }),
    assignDelta: assign({
      dx: (context, event) => {
        return event.clientX - context.px;
      },
      dy: (context, event) => {
        return event.clientY - context.py;
      },
    }),
    resetPosition: assign({
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
    }),
    checkDrags: assign({
      drags: context => {
        console.log(context.drags)

        if (context.drags >= 4) {
          elBox.dataset.drags = 'Upgrade now for unlimited drags!!';
        }
        return context.drags
      },
    }),
    incrementDrags: assign({
      drags: context => context.drags + 1,
    }),
    decrementDrags: assign({
      drags: context => context.drags -1,
    }),
    resetPosition: assign({
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
    })
  },
  guards: {
    belowMaxDrags: context => context.drags < 5,
    authorized: ()=>true,
  }
});

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    // console.log(state.context.drags)
    // console.log(state.context);
    console.log('state', state.value)
    elBox.dataset.state = state.value;
    if (state.context.drags === 5) {
      if (state.value === 'dragging') {
        elBox.dataset.drags = state.context.drags;
      }
    } else if(state.value !== 'unauthorized') {
      elBox.dataset.drags = state.context.drags;
    }

    elBox.style.setProperty('--dx', state.context.dx);
    elBox.style.setProperty('--dy', state.context.dy);
    elBox.style.setProperty('--x', state.context.x);
    elBox.style.setProperty('--y', state.context.y);
  }
});

service.start();

elBox.addEventListener('mousedown', (event) => {
  service.send(event);
});

elBody.addEventListener('mousemove', (event) => {
  service.send(event);
});

elBody.addEventListener('mouseup', (event) => {
  service.send(event);
});

elBody.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    service.send('keyup.escape');
  }
});
