import Engine from '../../engine'
import Dom from '../../dom'
import Svg from '../../svg'

const NUM_LINES = 3;
const COLORS = ['#FF0000', '#00C000', '#0000FF', '#FF00FF', '#808000', '#8000880', '#008080', '#FF8080'];
const SHAPES = ['gear', 'octagon', 'pacman', 'pentagon', 'ring', 'star', 'triangleDown', 'triangleUp'];

const _class = {
	base: Dom.addStyle('$task-math', {
		'align-items': 'center',
		'display': 'flex',
		'flex-direction': 'column',
		'height': '100%',
		'justify-content': 'center',
		'position': 'relative',
		'width': '100%'
	}),
	puzzle: Dom.addStyle('$task-puzzle', {
		'align-items': 'left',
		'display': 'flex',
		'flex-direction': 'column',
		// 'justify-content': 'center',
	}),
	line: Dom.addStyle('$math-line', {
		// color: 'brown',
		display: 'flex'
	}),
	shape: Dom.addStyle('$math-shape', {
		'height': 6,
		'width': 6
	}),
	sum: Dom.addStyle('$math-sum', {
		// 'color': 'blue',
		'font-size': 6
	}),
	symbol: Dom.addStyle('$math-symbol', {
		// 'color': 'red',
		'font-size': 6
	})
};

let _nextLevel = 1;


// _arrayFromTo(iFrom, iTo)
function _arrayFromTo(iFrom, iTo) {
	let aRet = [];

	for (let i = iFrom; i <= iTo; ++i) {
		aRet.push(i);
	}

	return aRet;
}


// _generateLine(iIndex, aShapes, aColors, aValues)
function _generateLine(iIndex, aShapes, aColors, aValues) {
	let iSum = aValues[iIndex] * 2
	let aDigits = [_shape(aShapes[iIndex], aColors[iIndex]), _shape(aShapes[iIndex], aColors[iIndex])];

	if (iIndex > 0) {
		--iIndex;
	}

	iSum += aValues[iIndex];
	aDigits.push(_shape(aShapes[iIndex], aColors[iIndex]));
	Engine.randomize(aDigits);
	
	return [
		aDigits[0],
		Dom.span(_class.symbol, null, '+'),
		aDigits[1],
		Dom.span(_class.symbol, null, '+'),
		aDigits[2],
		Dom.span(_class.symbol, null, '='),
		Dom.span(_class.sum, null, iSum)
	];

}


// _generatePuzzle(oLevel)
function _generatePuzzle(oLevel) {
	let aRet = [];
	let aShapes = Engine.randomItems(SHAPES, NUM_LINES);
	let aColors = Engine.randomItems(COLORS, NUM_LINES);
	let aValues = Engine.randomItems(_arrayFromTo(oLevel.min, oLevel.max), NUM_LINES);

// debugger;
	for (let i = 0; i < NUM_LINES; ++i) {
		let aLine = _generateLine(i, aShapes, aColors, aValues);
		aRet.push(Dom.div(_class.line, null, aLine));
	}

	aRet.push(_generateQuestion(oLevel.ops, aShapes, aColors, aValues));

	return aRet;
}


// _generateQuestion()
function _generateQuestion(sOps, aShapes, aColors, aValues) {
	let iRes;

	function __char(vChr) {
		let sType = typeof vChr;

		if (sType === 'number') {1
			return _shape(aShapes[vChr], aColors[vChr]);
		} else if (sType === 'string') {
			return Dom.div(_class.symbol, null, vChr);
		} else {
			return Dom.div(_class.symbol, null, iRes);
		}
	}

	switch (sOps) {
		case '++':
			iRes = aValues[0] + aValues[1] + aValues[2];
			break;
		case '+x':
			iRes = aValues[0] + aValues[1] * aValues[2];
			break;
		case 'x+':
			iRes = aValues[0] * aValues[1] + aValues[2];
			break;
		default:
			throw new Error('Invalid Ops!');
	}

	return Dom.div(_class.line, null,
			[__char(0), __char(sOps.charAt(0)), __char(1), __char(sOps.charAt(1)), __char(2), __char(true)]);
}


// _shape(sShape, sColor)
function _shape(sShape, sColor) {
	return Dom.div(_class.shape, null, Svg.shape(sShape, sColor));
}


// Create(iIndex, fSignal)
// Creates a component representing a "Same Tiles" task.
// 		iIndex	- Index of task window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(iIndex, fSignal) {
	let _levelInfo = Engine.getLevelInfo('math', _nextLevel++);
	let _puzzle = _generatePuzzle(_levelInfo);

	function _handleSignal(sSignal, oData) {
		// if (!_first) {
		// 	_first = oData;
		// } else {
		// 	if (oData.shape === _first.shape && oData.color === _first.color) {
		// 		fSignal('solved');
		// 	} else {
		// 		_first = null;
		// 		_tiles[oData.index].show();
		// 		_tiles[_first.index].show();
		// 	}
		// }
	}

	return {
		attempt: 1,
		dom: null,
		levelInfo: _levelInfo,

		remove() {

		},

		render() {
			this.dom = Dom.div(_class.base, null, Dom.div(_class.puzzle, null, _puzzle));

			return this.dom;
		},

		update(iCounter) {

		}
	};
}