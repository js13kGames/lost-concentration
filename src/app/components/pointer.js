import Engine from '../engine.js'
import Dom from '../dom.js'

const TMP_SWITCH_TIME = 600;//!!!

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
};


// Create(fSignal)
// Creates a round component in center of screen which points to the active task.
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(fSignal) {
	let _self;
	let _rotation = 45;
	let _rotateAt = TMP_SWITCH_TIME;

	// _handleClick
	function _handleClick(oEvt) {
		Engine.stop();
	}

	return {
		dom: null,

		next() {
			_rotateAt = 0;
		},

		render() {
			_self = this;
			this.dom = Dom.div(_class.base, {style:'transform:rotate(45deg)', click:_handleClick});
			return this.dom;
		},

		update(iCounter) {
			// if (iCounter % TMP_SWITCH_TIME === 0) {
			if (iCounter >= _rotateAt) {
				_rotateAt = iCounter + TMP_SWITCH_TIME;
				_rotation += 90;
				_self.dom.setAttribute('style', `transform:rotate(${_rotation}deg)`);
				fSignal('next', (_rotation % 360 - 45) / 90);
			}
		}
	};
}