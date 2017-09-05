// A component which dsplays one or more digits (0 - 9) each of which has a button above for incrementing the digit and 
// a button below for decrementing it.
// Used by the Simple Subtraction task.

import Dom from '../dom'
import Digit from './digit_input'

const _class = Dom.addStyle('$number-input', 'display:flex;position:relative;');


// Create(iSolution, fSignal)
// Creates a component allowing entry of multi-digit numbers.
// 		iSolution	- The value which represents the solution (number the input must be set to for success).
// 		fSignal		- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(iSolution, fSignal) {
	let _digits = String(iSolution).split('').map((sDigit, iNdx) => {
		return Digit(0, iNdx, _handleSignal);
	});

	function _handleSignal(sSignal, iIndex) {
		let sValue = _digits.reduce((sPrev, mDigit) => sPrev + mDigit.getValue(), '');
		
		if (parseInt(sValue) === iSolution) {
			fSignal('solved');
		}
	}

	return {
		dom: null,

		remove() {
			_digits.forEach(mDigit => mDigit.remove());
		},

		render() {
			this.dom = Dom.div(_class, null, _digits);
			return this.dom;
		},

		// update(iCounter) {

		// }
	}
}