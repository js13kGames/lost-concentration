import Dom from '../dom'
import Tutorial from './tutorial'

const ACTIVE = 'opacity:0;transition-delay:.8s;z-index:-99;';
const INACTIVE = 'opacity:0.65;transition-delay:0s;z-index:99;';

const _class = {
	base: Dom.addStyle('$menu-window', {
		'align-items': 'center',
		'border': '1px solid #A0A0A0',
		'display': 'flex',
		'flex': '1',
		'flex-direction': 'column',
		'justify-content': 'center',
		'position': 'relative'
	}),
	title: Dom.addStyle('$menu-title', {
		'color': '#404040',
		'font-size': 4,
		'font-weight': 'bold'
	}),
	play: Dom.addStyle('$menu-play', {
		'align-items': 'center',
		'border-radius': '50%',
		'box-shadow': '2px 2px 4px #404040',
		'cursor': 'pointer',
		'display': 'flex',
		'font-size': 6,
		'height': 22,
		'justify-content': 'center',
		'transition': 'all .3s ease-in',
		'width': 22,
	}, {
		':hover': 'box-shadow:3px 3px 6px #404040;opacity:.88;'
	}),
	label: Dom.addStyle('$menu-label', {
		'font-size': 4
	}),
	buttons: Dom.addStyle('$menu-btns', {
		'display': 'flex',
		'flex-direction': 'row',
		'justify-content': 'space-evenly',
		'margin-bottom': 2,
		'width': '72%',

	})
};


// _createMenu(iIndex, fClick)
function _createMenu(iIndex, fClick) {
	let bHasPlayed = (localStorage.getItem('hasPlayed') !== null);

	if (bHasPlayed) ++iIndex;

	switch (iIndex % 4) {
		case 0: return _createMenuInstruct(fClick);
		case 1: return _createMenuEasy(fClick);
		case 2: return _createMenuHard(fClick);
		case 3: return _createMenuInsane(fClick);
	}
}


// _createMenuEasy(fClick)
function _createMenuEasy(fClick) {
	return _createStartButton('Easy', 'green', fClick);
}


// _createMenuHard(fClick)
function _createMenuHard(fClick) {
	return _createStartButton('Hard', 'orange', fClick);
}


// _createMenuInsane(fClick)
function _createMenuInsane(fClick) {
	return _createStartButton('Insane', 'red', fClick);
}


// _createMenuInstruct(fClick)
function _createMenuInstruct(fClick) {
	let oSettings = JSON.parse(localStorage.getItem('settings')) || {sound:true};

	return [
		Dom.div(_class.label, {style:'display:flex;flex-direction:column;'}, 'Instructions'),
		Dom.createElement('ul', _class.text, null, [
			Dom.li(null, null, 'The game screen looks a lot like this menu.'),
			Dom.li(null, null, 'Four simple puzzles are displayed but only one is active at any time.'),
			Dom.li(null, null, 'When the round pointer in the middle rotates, the next puzzle becomes active.'),
			Dom.li(null, null, 
					'If it rotates before the puzzle is complete, try to remember your place for when it rotates back around.'),
			Dom.li(null, null, 'You get a limited number of tries based on the level selected.'),
			Dom.li(null, null, 'Solving a puzzle early adds a fraction of the remaining time to the next puzzle.'),
			Dom.li(null, null, 'You cannot control when the pointer rotates.'),
		]),
		Dom.createElement('h3', null, null, 'Concentrate hard and try not lose your place!'),
		Dom.div(_class.buttons, null, [
			Dom.button(null, {id:'btnMenuSound'}, ['Mute sounds', 'Unmute sounds'], oSettings.sound ? 0 : 1),
			Dom.button(null, {id:'btnMenuTutorial', click:() => Tutorial.reset(true)}, 'Reset tutorials')
		]),
	];
}


// _createStartButton(sMode, sBG, fClick)
function _createStartButton(sMode, sBG, fClick) {
	return [
		Dom.div(_class.play, {style:'background:' + sBG, click:fClick}, sMode)
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

	function _handleClick(oEvt) {
		localStorage.setItem('hasPlayed', 'yes');

		fSignal('start', {level:iIndex, sound:document.getElementById('btnMenuSound').innerText === 'Mute sounds'});
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

		},

		render() {
			_self = this;
			_menu = _createMenu(iIndex, _handleClick);
			_domBack = Dom.div('window-inactive', {style:bActive ? ACTIVE : INACTIVE});
			
			this.dom = Dom.div(_class.base, null, _menu.concat(_domBack));

			return this.dom;
		}
	};
}