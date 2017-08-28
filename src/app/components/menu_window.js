import Dom from '../dom'

const ACTIVE = 'opacity:0;transition-delay:.8s;z-index:-99;';
const INACTIVE = 'opacity:0.65;transition-delay:0s;z-index:99;';

const _class = {
	base: Dom.addStyle('$menu-window', {
		'align-items': 'center',
		'border': '1px solid #A0A0A0',
		'display': 'flex',
		'flex': '1',
		'flex-direction': 'row',
		'justify-content': 'center',
		'position': 'relative'
	}),
	title: Dom.addStyle('$menu-title', {
		'color': '#404040',
		'font-size': 4,
		'font-weight': 'bold'
	}),
	backdrop: Dom.addStyle('$menu-back', {
		background: '#000000',
		height: '100%',
		opacity: '0.65',
		position: 'absolute',
		transition: 'opacity .6s ease-out',
		width: '100%'
	}),
	play: Dom.addStyle('$menu-play', {
		'align-items': 'center',
		// 'background': 'red',
		'border-radius': '50%',
		'display': 'flex',
		'font-size': 6,
		'height': 22,
		'justify-content': 'center',
		'box-shadow': '2px 2px 4px #404040',
		'width': 22,
	})
};


// _createMenu(iIndex, fHandle)
function _createMenu(iIndex, fHandle) {
	switch (iIndex) {
		case 0: return _createMenuEasy(fHandle);
		case 1: return _createMenuHard(fHandle);
		case 2: return _createMenuInsane(fHandle);
		case 3: return _createMenuInstruct(fHandle);
	}
}


// _createMenuEasy(fHandle)
function _createMenuEasy(fHandle) {
	return _createStartButton('Easy', fHandle);
}


// _createMenuHard(fHandle)
function _createMenuHard(fHandle) {
	return _createStartButton('Hard', fHandle);
}


// _createMenuInsane(fHandle)
function _createMenuInsane(fHandle) {
	return _createStartButton('Insane', fHandle);
}


// _createMenuInstruct(fHandle)
function _createMenuInstruct(fHandle) {
	return [
		Dom.div(_class.title, null, 'Instructions'),
		Dom.div(null, null, 'Click the middle circle to select a panel')
	];
}


// _createStartButton(sMode, fSignal)
function _createStartButton(sMode, fSignal) {
	let sBG;

	function __handleClick(oEvt) {
		console.log('CLICK', sMode);
	}

	if (sMode === 'Easy') {
		sBG = 'green;'
	} else if (sMode === 'Hard') {
		sBG = 'orange;';
	} else {
		sBG = 'red;';
	}

	return [
		Dom.div(_class.play, {style:'background:' + sBG, click:__handleClick}, sMode)
	];
}


// Create(bActive, iIndex, fSignal)
// Creates a MenuWindow component which is one of the four main areas on the menu.
// 		bActive	- Does this window begin as the active window (able to be interacted with)?
// 		iIndex	- Index of window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(bActive, iIndex, fSignal) {
	let _domBack, _menu, _self;

	function _clear() {
		// _completed = false;
		// _menu = _createMenu(iIndex, _handleSignal);
		// _self.dom.appendChild(_menu.render());
		// _attempt.setAttempt(1);
		// _levelInd.innerText = 'Level ' + (_menu.levelInfo.level + 1);
	}

	function _handleSignal(sSignal, vData) {
		// let mTask = _menu;

		// if (sSignal === 'solved') {
		// 	Audio.correct();
		// 	_removeTask(mTask);
		// 	_completed = true;
		// 	Engine.adjustScore(POINTS * (ATTEMPTS - mTask.attempt + 1));
		// 	fSignal(sSignal, mTask.attempt === 1);
		// }
	}

	function _removeTask(mTask) {
		// _menu = null;
		// _self.dom.removeChild(mTask.dom);
		// mTask.remove();
		// Engine.returnTypeToPool(mTask.type);
	}

	return {
		dom: null,

		active(bVal) {
			bActive = bVal;

			if (bActive) {
				_domBack.setAttribute('style', ACTIVE);
			} else if (_menu) {
				_domBack.setAttribute('style', INACTIVE);
			}
		},

		remove() {
			// _menu.remove();
		},

		render() {
			_self = this;
			_menu = _createMenu(iIndex, _handleSignal);
			_domBack = Dom.div(_class.backdrop, {style:bActive ? ACTIVE : INACTIVE});
			
			this.dom = Dom.div(_class.base, null, _menu.concat(_domBack));

			return this.dom;
		}
	};
}