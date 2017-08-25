import Engine from '../engine'
import Dom from '../dom'

const _colorsBG = ['#FF0000', '#0000FF', '#FFFF00', '#00FF00', '#FF00FF', '#00FFFF'];
const _colorsFG = ['#FFFFFF', '#FFFFFF', '#000000', '#000000', '#000000', '#000000'];
const _rowStyles = ['order:0;padding:2px 3px 0px 3px', 'order:1;padding:2px 3px 2px 3px'];


const _class = {
	base: Dom.addStyle('$task-repeat', {
		'align-items': 'center',
		'display': 'flex',
		'height': '100%',
		'justify-content': 'center',
		'position': 'relative',
		'width': '100%'
	}),
	board: Dom.addStyle('$repeat-board', {
		'display': 'flex',
		'flex-direction': 'column',
		'height': '70%',
		'width': '70%'
	}),
	pattern: Dom.addStyle('$repeat-pattern', {
		'background': '#000000',
		'display': 'flex',
		'flex-flow': 'row wrap',
		'padding': '1px'
	}),
	block: Dom.addStyle('$repeat-pattern-block', {
		'align-items': 'center',
		'display': 'flex',
		'font-size': 2,
		'font-weight': 'bold',
		'height': 3,
		'justify-content': 'center',
		'margin': '1px',
		'width': 3
	}),
	row: Dom.addStyle('$repeat-row', {
		'background': '#000000',
		'display': 'flex',
		'flex': '1',
		'flex-direction': 'row'
	}),
	btn: Dom.addStyle('$repeat-btn', {
		'flex': '1'
	}, {
		':hover':'opacity:.8'
	}),
	click: Dom.addStyle('$repeat-click', 'opacity:.4 !important')
};

let _nextLevel = 1;


// _createPattern(oLevel)
function _createPattern(oLevel) {
	let oRet = {real:[], vis:[]};

	for (let i = 0; i < oLevel.count; ++i) {
		let iIndex = Engine.randomInt(0, _colorsBG.length - 1)
		let iTaps = Engine.randomInt(1, 3);

		oRet.vis.push({index:iIndex, taps:iTaps});
		for (let i = 0; i < iTaps; ++i) {
			oRet.real.push(iIndex);
		}
	}

console.dir(oRet);
	return oRet;
}


// Create(iIndex, fSignal)
// Creates a component representing a "Repeat Pattern" task.
// 		iIndex	- Index of task window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(iIndex, fSignal) {
	let _buttons, _deselect, _rows, _self;
	let _levelInfo = Engine.getLevelInfo('repeat', _nextLevel++);
	let _pattern = _createPattern(_levelInfo);
	let _index = 0;

	function _handleClick(oEvt) {

	}

	return {
		attempt: 1,
		dom: null,
		levelInfo: _levelInfo,

		changeOrder() {
			Engine.randomize(_rowStyles, true).forEach((sStyle, iNdx) => _rows[iNdx].setAttribute('style', sStyle));

			Engine.randomize([0, 1, 2], true).forEach((iIndex, iNdx) => {
				_buttons[iIndex].dom.style.setProperty('order', iNdx * 2);
				_buttons[iIndex + 3].dom.style.setProperty('order', iNdx * 2);
			});
		},

		remove() {
console.log('remove(repeat)');
			_buttons.forEach(oButton => oButton.dom.removeEventListener('click', oButton.handler))
		},

		render() {
			let aPattern = _pattern.vis.map(oBlock => {
				let iIndex = oBlock.index;
				return Dom.div(_class.block, {style:`background:${_colorsBG[iIndex]};color:${_colorsFG[iIndex]};`},oBlock.taps);
			});

			_self = this;

			_buttons = [0, 1, 2, 3, 4, 5].map(iIndex => {
				let iOrder = iIndex * 2 - Math.floor(iIndex / 3) * 6;

				function __handleClick(oEvt) {
					if (iIndex === _pattern.real[_index]) {
						if (_index === _pattern.real.length - 1) {
							fSignal('solved');
						} else {
							++_index;
							oEvt.target.classList.add(_class.click);
							window.setTimeout(() => oEvt.target.classList.remove(_class.click), 100);
							_self.changeOrder();
						}
					}
				}

				return {
					dom: Dom.div(_class.btn, {style:`background:${_colorsBG[iIndex]};order:${iOrder};`, click:__handleClick}, ''),
					handler: __handleClick
				};
			});

			_rows = [
				Dom.div(_class.row, {style:_rowStyles[0]}, [
					_buttons[0].dom, 
					Dom.span(null, {style:'order:1;width:4px;'}), 
					_buttons[1].dom,
					Dom.span(null, {style:'order:3;width:4px;'}), 
					_buttons[2].dom
				]),
				Dom.div(_class.row, {style:_rowStyles[1]}, [
					_buttons[3].dom, 
					Dom.span(null, {style:'order:1;width:4px;'}), 
					_buttons[4].dom,
					Dom.span(null, {style:'order:3;width:4px;'}), 
					_buttons[5].dom
				])
			];

			this.dom = Dom.div(_class.base, null, Dom.div(_class.board, null, [
				Dom.div(_class.pattern, null, aPattern),
				_rows[0],
				_rows[1]
			]));

			return this.dom;
		},

		update(iCounter) {

		}
	};
}