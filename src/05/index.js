import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

const assignPoint = assign({
  px: (ctx, e) => e.clientX,
  py: (ctx, e) => e.clientY,
})

const assignDelta = assign({
  dx: (ctx, e) => e.clientX - ctx.px,
  dy: (ctx, e) => e.clientY - ctx.py
})

const assignPosition = assign({
  x: (ctx, e) => ctx.x + ctx.dx,
  y: (ctx, e) => ctx.y + ctx.dy,
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
})

const resetPosition = assign({
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
})

const showDelta = ctx => {
  elBox.dataset.delta = `delta: ${ctx.dx}, ${ctx.dy}`
}

const machine = createMachine({
  initial: 'idle',
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  },
  states: {
    idle: {
      on: {
        mousedown: {
          actions: assignPoint,
          target: 'dragging',
        },
      },
    },
    dragging: {
      on: {
        'keyup.escape': {
          actions: [resetPosition, showDelta],
          target: 'idle',
        },
        mousemove: {
          actions: [assignDelta, showDelta]
        },
        mouseup: {
          actions: [assignPosition, showDelta],
          target: 'idle',
        },
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);

    elBox.dataset.state = state.value;

    elBox.style.setProperty('--dx', state.context.dx);
    elBox.style.setProperty('--dy', state.context.dy);
    elBox.style.setProperty('--x', state.context.x);
    elBox.style.setProperty('--y', state.context.y);
  }
});

service.start();

elBox.addEventListener('mousedown', service.send)
elBody.addEventListener('mouseup', service.send)
elBody.addEventListener('mousemove', service.send)

elBody.addEventListener('keyup', e => {
  console.log('keyup!!', e.key)
  if (e.key === 'Escape') service.send('keyup.escape')
})