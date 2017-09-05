import Engine from '../engine'
import Dom from '../dom'

const SWITCH_TIME = [700, 500, 400];

const _class = {
	base: Dom.addStyle('$main-pointer', {
		'align-items': 'center',
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
	flash: Dom.addStyle('$main-pointer-flash', {
		'!border-radius': 10.5,
		'!border-width': 10.5,
		'!left': 39.5,
		'!top': 39.5,
	})
};


// Create(iLevel, fSignal)
// Creates a round component in center of screen which points to the active task.
// 		iLevel	- Level (0:Easy, 1:hard, 2:Insane) or -1 if pointer is for the menu.
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(iLevel, fSignal) {
	let _extra, _intvl, _self;
	let _extraTime = 0;
	let _switchTime = SWITCH_TIME[iLevel >= 0 ? iLevel : 0];
	let _rotation = 45;
	let _rotateAt = _switchTime;

	// _handleClick
	function _handleClick(oEvt) {
		if (Engine.stopped) {
			fSignal('restart');
		} else {
			fSignal('next_menu');
		}
	}

	return {
		dom: null,

		flash(bStart) {
			if (bStart) {
				let iToggle = 0;
				_intvl = window.setInterval(() => {
					if (++iToggle % 2 === 0) {
						if (iToggle % 20 < 4) this.dom.classList.add(_class.flash);
					} else {
						this.dom.classList.remove(_class.flash);
					}
				}, 100);
			} else {
				window.clearInterval(_intvl);
				this.dom.classList.remove(_class.flash);
			}
		},

		next(bExtra) {
			if (Engine.started) {
				if (bExtra) {
				_extraTime = Math.max(0, Math.min(1000, _extraTime + Math.floor((_rotateAt - Engine.getCounter()) / 2)));
				}
	
				_rotateAt = 0;
			} else {
				_rotateAt = 0;
				this.update(1);
			}
		},

		render() {
			let vClasses = iLevel === -1 ? [_class.base, 'menu-pointer'] : _class.base;

			_self = this;
			_extra = Dom.div(_class.time, null);

			this.dom = Dom.div(vClasses, {style:'transform:rotate(45deg)', click:_handleClick}, _extra);

			return this.dom;
		},

		restart() {
			_rotateAt = _switchTime;
		},

		update(iCounter) {
			if (iCounter >= _rotateAt) {
				_rotateAt = iCounter + _switchTime;
				_rotation += 90;
				if (_extraTime) {
					_rotateAt = iCounter + _switchTime + _extraTime;
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