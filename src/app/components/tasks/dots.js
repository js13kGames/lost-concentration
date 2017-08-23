import Engine from '../../engine.js'
import Dom from '../../dom.js'

const STATUS_NONE = 0;
const STATUS_SET = 1;
const STATUS_RESET = 2;

const POSITIONS = [
	40,5, 50,10, 63,14, 67,6, 53,39, 28,63, 25,29, 44,66, 67,64, 39,83, 65,31, 88,57, 13,70, 54,70, 40,53, 45,27, 84,26, 
	8,35, 23,47, 70,79, 70,50, 26,77, 31,17, 57,21, 83,68, 34,39, 17,19, 82,41, 9,54, 55,56, 55,83, 72,18, 30,88
];


const _class = {
	base: Dom.addStyle('$task-dots', {
		height: '100%',
		position: 'relative',
		width: '100%'
	}),
	dot: Dom.addStyle('$dots-container', {
		'align-items': 'center',
		'background': '#000080',
		'border-radius': '50%',
		'color': '#FFFFFF',
		'cursor': 'pointer',
		'display': 'flex',
		'justify-content': 'center',
		'position': 'absolute',
		'height': 4,
		'width': 4		
	}),
	dotBad: Dom.addStyle('$task-dot-bad', 'background:#FF0000 !important;'),
	dotGood: Dom.addStyle('$task-dot-good', 'background:#00A000 !important;')
};

let _nextLevel = 1;		// Static global for all dots tasks...


// _randomDots(iCount) {
function _randomDots(iCount, fClick) {
	let aRet = [];
	let aPositions = POSITIONS.slice();

	for (let i = 0; i < iCount; ++i) {
		let iIndex = Engine.randomInt(0, (aPositions.length - 2) / 2) * 2;
		let aPos = aPositions.splice(iIndex, 2);
		let sStyle = `left:${aPos[0]}%;top:${aPos[1]}%;`;
		aRet.push(Dom.div(_class.dot, {style:sStyle, click:fClick}, i + 1));
	}

	return aRet;
}


// Create(iIndex, fSignal)
// Creates a component representing a "Connect the Dots" task.
// 		iIndex	- Index of task window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(iIndex, fSignal) {
	let _dots, _selectedDot, _statusChangeTime;
	let _nextDotIndex = 0;
	let _dotStatus = STATUS_NONE;
	let _levelInfo = Engine.getLevelInfo('dots', _nextLevel++);

	function _handleClick(oEvt) {
		let sClass;
		let iIndex = parseInt(oEvt.currentTarget.innerText) - 1;

		if (iIndex === _nextDotIndex) {
			if (++_nextDotIndex === _levelInfo.dotCount) {
				fSignal('solved');
			} else {
				sClass = 'dotGood';
			}
		} else {
			sClass = 'dotBad';
		}

		_dotStatus = STATUS_SET;
		_selectedDot = _dots[iIndex];
		_selectedDot.classList.add(_class[sClass]);
	}

	return {
		attempt: 1,
		dom: null,
		levelInfo: _levelInfo,

		remove() {
			_dots.forEach(dDot => dDot.removeEventListener('click', _handleClick));
		},

		render() {
			_dots = _randomDots(_levelInfo.dotCount, _handleClick);
			this.dom = Dom.div(_class.base, null, _dots);
			return this.dom;
		},

		update(iCounter) {
			if (_dotStatus) {
				if (_dotStatus === STATUS_SET) {
					_dotStatus = STATUS_RESET;
					_statusChangeTime = iCounter + 10;
				} else if (iCounter > _statusChangeTime) {
					_dotStatus = STATUS_NONE;
					_selectedDot.classList.remove(_class.dotGood, _class.dotBad);
				}
			}
		}
	};
}