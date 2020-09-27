import { createMachine } from 'xstate';

const elBox = document.querySelector('#box');

const tmachine = createMachine({
	initial: 'red',
	states: {
		red: {
			on: {
				CHANGE: 'green',
			},
		},
		green: {
			on: {
				CHANGE: 'yellow',
			},
		},
		yellow: {
			on: {
				CHANGE: 'red',
			},
		},
	},
});
const machine = createMachine({
	initial: 'inactive',
	states: {
		inactive: {
			on: {
				TOGGLE: 'active',
			},
		},
		active: {
			on: {
				TOGGLE: 'inactive',
			},
		},
	},
});

// Change this to the initial state
// let currentState = machine.initial;
let tcurrentState = tmachine.initial;

// function send(event) {
// 	currentState = machine.transition(currentState, 'TOGGLE');

// 	elBox.dataset.state = currentState.value;
// }

function tsend(event) {
	tcurrentState = tmachine.transition(tcurrentState, event);

	elBox.dataset.state = tcurrentState.value;
}

var a = 0;
var choices = ['CHANGE'];
elBox.addEventListener('click', () => {
  a += 1;
  const newIndex = a % choices.length;
  console.log(choices[newIndex])
	tsend(choices[newIndex]);
	// Send a click event
});
