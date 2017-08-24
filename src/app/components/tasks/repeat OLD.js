import Engine from '../../engine'
import Dom from '../../dom'

const _colors = ['#FF0000', '#0000FF', '#FFFF00', '#00FF00', '#FF00FF', '#00FFFF'];

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
		'height': 3,
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


// Create(iIndex, fSignal)
// Creates a component representing a "Repeat Pattern" task.
// 		iIndex	- Index of task window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(iIndex, fSignal) {
	let _buttons, _deselect;
	let _levelInfo = Engine.getLevelInfo('repeat', _nextLevel++);
	let _pattern = Engine.randomInts(0, 3, _levelInfo.count);
	let _index = 0;

	function _handleClick(oEvt) {

	}

	return {
		attempt: 1,
		dom: null,
		levelInfo: _levelInfo,

		remove() {

		},

		render() {
			let aPattern = _pattern.map(iIndex => Dom.div(_class.block, {style:`background:${_colors[iIndex]};`}, ''));

			_buttons = [0, 1, 2, 3, 4, 5].map(iIndex => {
				return Dom.div(_class.btn, {style:`background:${_colors[iIndex]};`, click:oEvt => {
					if (iIndex === _pattern[_index]) {
						if (_index === _pattern.length - 1) {
							fSignal('solved');
						} else {
							++_index;
							oEvt.target.classList.add(_class.click);
							window.setTimeout(() => oEvt.target.classList.remove(_class.click), 100);
						}
					}
				}}, '');
			});

			this.dom = Dom.div(_class.base, null, Dom.div(_class.board, null, [
				Dom.div(_class.pattern, null, aPattern),
				Dom.div(_class.row, {style:'padding:2px 3px 0px 3px'}, [
					_buttons[0], 
					Dom.span(null, {style:'width:4px;'}), 
					_buttons[1],
					Dom.span(null, {style:'width:4px;'}), 
					_buttons[2]
				]),
				Dom.div(_class.row, {style:'padding:2px 3px 2px 3px'}, [
					_buttons[3], 
					Dom.span(null, {style:'width:4px;'}), 
					_buttons[4],
					Dom.span(null, {style:'width:4px;'}), 
					_buttons[5]
				])
			]));

			return this.dom;
		},

		update(iCounter) {

		}
	};
}