import Engine from '../engine'
import Dom from '../dom'

const SWITCH_TIME = 500;
// const SWITCH_TIME = 50;
const _class = {
	base: Dom.addStyle('$main-pointer', {
		'align-items': 'center',
		'background': '#F0F0F0',
		'border-bottom': '10= solid #000000',
		'border-left': '10= solid transparent',
		'border-radius': '10=',
		'border-right': '10= solid #000000',
		'border-top': '10= solid #000000',
		'display': 'flex',
		'justify-content': 'center',
		'left': 40,
		'position': 'absolute',
		'top': 40,
		'transition': 'transform 1s ease-in-out',
		'z-index': '9999'
	}),
	time: Dom.addStyle('$main-pointer-time', {
		'background': '#F0F0F0',
		'border-bottom': '0= solid #008000',
		'border-left': '0= solid transparent',
		'border-radius': '0=',
		'border-right': '0= solid #008000',
		'border-top': '0= solid #008000',
		'display': 'flex',
		'justify-content': 'center',
		'position': 'absolute',
	}),
};


// Create(fSignal)
// Creates a round component in center of screen which points to the active task.
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(fSignal) {
	let _extra, _self;
	let _extraTime = 0;
	let _rotation = 45;
	let _rotateAt = SWITCH_TIME;

	// _handleClick
	function _handleClick(oEvt) {
		if (Engine.stopped) {
			fSignal('restart');
		} else {
Engine.stop();
		}
	}

	return {
		dom: null,

		next(bExtra) {
			if (bExtra) {
			_extraTime = Math.max(0, Math.min(1000, _extraTime + Math.floor((_rotateAt - Engine.getCounter()) / 2)));
			}
			_rotateAt = 0;
		},

		render() {
			_self = this;
			_extra = Dom.div(_class.time, null);

			this.dom = Dom.div(_class.base, {style:'transform:rotate(45deg)', click:_handleClick}, _extra);

			return this.dom;
		},

		restart() {
			_rotateAt = SWITCH_TIME;
		},

		update(iCounter) {
			if (iCounter >= _rotateAt) {
console.log('rotate', iCounter, _rotateAt);
				_rotateAt = iCounter + SWITCH_TIME;
				_rotation += 90;
				if (_extraTime) {

					_rotateAt = iCounter + SWITCH_TIME + _extraTime;
				}
				_self.dom.setAttribute('style', `transform:rotate(${_rotation}deg)`);
				fSignal('next', (_rotation % 360 - 45) / 90);
			} else if (_extraTime) {
				let iExtra = _extraTime / 100;
				_extra.setAttribute('style', `border-width:${iExtra}${Dom.UNIT};border-radius:${iExtra}${Dom.UNIT};`);
				--_extraTime;
			}
		}
	};
}