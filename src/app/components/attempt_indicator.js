import Dom from '../dom.js'

const _styles = [
	'left:4px;top:4px;',
	'right:4px;top:4px;',
	'bottom:4px;right:4px;',
	'bottom:4px;left:4px;'
];

const _class = {
	base: Dom.addStyle('$attempt', {
		'font-size': 4,
		'position': 'absolute'
	})
}

// Create(iAttempts, iIndex)
// Creates a component indicating which attempt out of how many available attempts.
// 		iAttempts	- Number of attempts allowed for the task.
// 		iIndex	- Index of task window indicator is for (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// Returns an object which represents a component.
export default function(iAttempts, iIndex) {
	return {
		dom: null,

		setAttempt(iAttempt) {
			this.dom.innerText = `${iAttempt} / ${iAttempts}`;
		},

		render() {
			this.dom = Dom.div(_class.base, {style:_styles[iIndex]}, '1 / ' + iAttempts);
			return this.dom;
		},

		// update(iCounter) {

		// }
	}
}