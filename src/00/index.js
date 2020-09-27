import { createMachine, interpret } from 'xstate';
const elOutput = document.querySelector('#output');

const feedbackMachine = createMachine({
	initial: 'question',
	states: {
		question: {
			on: {
				CLICK_GOOD: {
					target: 'thanks',
				},
				CLICK_BAD: 'form',
			},
		},
		form: {
			on: {
				SUBMIT: {
					target: 'thanks',
				},
			},
		},
		thanks: {
			on: {
				CLOSE: 'closed',
			},
		},
		closed: {
			type: 'final',
		},
	},
});


const feedbackService = interpret(feedbackMachine);
// feedbackService.onTransition(s => console.log(s));
feedbackService.start();
window.send = feedbackService.send;
window.sss = feedbackService.stop

