import Dom from '../dom'

const _class = {
	base: Dom.addStyle('$digit-input', {
		'background': '#E0E0E0',
		'color': '#A0A0A0',
		'display': 'flex',
		'flex-direction': 'column',
		'margin-left': '1px'
	}),
	button: Dom.addStyle('$digit-input-btn', {
		'background': '#808080',
		'border': '1px solid',
		'border-color': '#B0B0B0 #404040 #404040 #B0B0B0',
		'color': '#C0C0C0',
		'cursor': 'pointer',
		'font-size': 3,
		'text-align': 'center'
	})
}

// Create(vValue, iIndex, fSignal)
// Creates a component allowing a single digit to be chosen using mouse clicks.
// 		vValue	- Initial value for the digit.
// 		iIndex	- Index of digit within enclosing number_input.
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(vValue, iIndex, fSignal) {
	let _value = parseInt(vValue) + 100000;
	let _digit = Dom.span(null, null, _value % 10);
	let _incBtn = Dom.span(_class.button, {click:_handleClick}, '+');
	let _decBtn = Dom.span(_class.button, {click:_handleClick}, '-');

	function _handleClick(oEvt) {
		let iVal;

		_value += oEvt.currentTarget.innerText === '+' ? 1 : -1;
		iVal = _value % 10;
		_digit.innerText = iVal;

		fSignal('change', iIndex, iVal);
	}
	
	return {
		dom: null,

		getValue() {
			return _value % 10;
		},

		remove() {
			_incBtn.removeEventListener('click', _handleClick);
			_decBtn.removeEventListener('click', _handleClick);
		},

		render() {
			this.dom = Dom.div(_class.base, null, [_incBtn, _digit, _decBtn]);
			return this.dom;
		}
		
	}
}