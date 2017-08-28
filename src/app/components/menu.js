import Dom from '../dom'
import Pointer from './pointer'
import Window from './menu_window'

const UNIT = Dom.UNIT;

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

export default function() {
	let _self;
	let _oldIndex = 0;
	let _pointer = Pointer(_handleSignal);
	let _windows = [];
	
	for (let i = 0; i < 4; ++i) {
		_windows.push(Window(i === 0, i, _handleSignal));
	}

	function _handleSignal(sSignal, vData) {
		if (sSignal === 'next') {
			_windows[_oldIndex].active(false);
			_windows[vData].active(true);
			_oldIndex = (_oldIndex + 1) % 4;
		} else {
			_pointer.next();
		}
	}

	return {
		dom: null,

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