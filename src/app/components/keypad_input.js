import Dom from '../dom'

const _class = {
	base: Dom.addStyle('$keypad', {
		background: 'blue',
		color: '#C0C0C0',
		// display: 'none',
		position: 'absolute'
	}),
	row: Dom.addStyle('$keypad-row', {
		background: '#000000',
		display: 'flex'
	}),
	key: Dom.addStyle('$keypad-key', {
		'align-items': 'center',
		'background': '#404040',
		'cursor': 'pointer',
		'display': 'flex',
		'font-size': 5,
		'height': 6,
		'justify-content': 'center',
		'margin': '1px',
		'width': 6
	}, {
		':hover': 'background:#808080;'
	})
};


// Create(dAnswer, fSignal)
// Creates a component which displays a keypad for entering a number.
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(dAnswer, fSignal) {
	let _self;
	let _keys = [];

	// _createKey(sLbl)
	function _createKey(sLbl) {
		_keys.push(Dom.div(_class.key, {click:_handleClick}, sLbl));
		return _keys[_keys.length - 1];
	}


	function _handleClick(oEvt) {
		let sChr = oEvt.target.innerText;
		let sText = dAnswer.innerText;

		oEvt.stopPropagation();

		if (sChr === '\u21B5') {
			fSignal('changed', parseInt(sText));
			_self.show(false);
		} else if (sChr === '\u00AB') {
			dAnswer.innerText = sText.length <= 1 ? '' : sText.substr(0, sText.length - 1);
		} else {
			dAnswer.innerText += sChr;
		}
	}
	
	return {
		dom: null,

		remove() {
			_keys.forEach(dKey => dKey.removeEventListener('click', _handleClick));
		},

		render() {
			_self = this;

			// this.dom = Dom.div(_class.base, {style:'display:none;', click:_handleClick}, [
			this.dom = Dom.div(_class.base, {style:'display:none;'}, [
				Dom.div(_class.row, null, [_createKey('7'), _createKey('8'), _createKey('9')]),
				Dom.div(_class.row, null, [_createKey('4'), _createKey('5'), _createKey('6')]),
				Dom.div(_class.row, null, [_createKey('1'), _createKey('2'), _createKey('3')]),
				Dom.div(_class.row, null, [_createKey('\u00AB'), _createKey('0'), _createKey('\u21B5')])
			]);

			return this.dom;
		},

		show(bShow = true) {
			if (bShow) {
				this.dom.setAttribute('style', 'display:initial;');
				// dAnswer.innerText = '';
			} else {
				this.dom.setAttribute('style', 'display:none;');
			}
		},

		// update(iCounter) {

		// }
	}
}