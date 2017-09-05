// A Component which is a container for the main menu. Equivalent to the stage component of the actual game.

import Dom from '../dom'
import Pointer from './pointer'
import Window from './menu_window'

const _class = {
	base: Dom.addStyle('$main-stage', {
	  'background': '#F0F0F0',
	  'display': 'flex',
	  'flex-direction': 'column',
	  'height': 100,
	  'position': 'relative',
	  'width': 100
	}),
	row: Dom.addStyle('$main-row', {
		'display': 'flex',
		'flex': '1',
		'flex-direction': 'row'
	})
};


// Create(fSignal)
// Creates a component representing the "stage" for the main menu.
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(fSignal) {
	let _self, _timeout;
	let _oldIndex = 0;
	let _pointer = Pointer(-1, _handleSignal);
	let _windows = [];
	
	for (let i = 0; i < 4; ++i) {
		_windows.push(Window(i === 0, i, _handleSignal));
	}

	_timeout = window.setTimeout(() => _pointer.flash(true), 8000);

	function _handleSignal(sSignal, vData) {
		function __clearFlash() {
			if (_timeout) window.clearTimeout(_timeout);
			_timeout = null;
			_pointer.flash(false);
		}

		if (sSignal === 'next') {
			_windows[_oldIndex].active(false);
			_windows[vData].active(true);
			_oldIndex = (_oldIndex + 1) % 4;
		} else if (sSignal === 'start') {
			__clearFlash();
			fSignal(vData);
		} else {
			window.clearTimeout(_timeout);
			__clearFlash();
			_pointer.next();
		}
	}

	return {
		dom: null,

		remove() {
			_windows.forEach(dWindow => dWindow.remove());
		},

		render() {
			_self = this;

			this.dom = Dom.div(_class.base, null, [
				Dom.div(_class.row, null, [
					_windows[0],
					_windows[1]
				]),
				Dom.div(_class.row, null, [
					_windows[3],
					_windows[2]
				]),
				_pointer
			]);
			
			return this.dom;
		},

	};
}