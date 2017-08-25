import Engine from '../engine'
import Dom from '../dom'
import Svg from '../svg'
import Key from '../components/keypad_input'

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
		'display': 'flex',
		'font-size': 6
	}),
	answer: Dom.addStyle('$math-answer', {
		'border': '2px solid black',
		'font-size': 6,
		'height': 6,
		'min-width': 10
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
	let oQst;
	let oRet = {dom:[]};
	let aShapes = Engine.randomItems(SHAPES, oLevel.lines);
	let aColors = Engine.randomItems(COLORS, oLevel.lines);
	let aValues = Engine.randomItems(_arrayFromTo(oLevel.min, oLevel.max), oLevel.lines);

	for (let i = 0; i < oLevel.lines; ++i) {
		let aLine = _generateLine(i, aShapes, aColors, aValues);
		oRet.dom.push(Dom.div(_class.line, null, aLine));
	}

	oQst = _generateQuestion(oLevel.ops, aShapes, aColors, aValues);
	oRet.dom.push(oQst.dom);
	oRet.answerBox = oQst.answerBox;
	oRet.solution = oQst.solution;

	return oRet;
}


// _generateQuestion()
function _generateQuestion(sOps, aShapes, aColors, aValues) {
	let iSol, aLine, dAnsw;
	let aVals = Engine.randomize(aValues, true);

	function __char(vChr) {
		let iIndex, sType = typeof vChr;

		if (sType === 'number') {
			iIndex = aValues.indexOf(aVals[vChr]);
			return _shape(aShapes[iIndex], aColors[iIndex]);
		} else if (sType === 'string') {
			return Dom.div(_class.symbol, null, vChr);
		} else {
			dAnsw = Dom.div(_class.answer, null, '');
			return Dom.div(_class.symbol, null, ['=', dAnsw]);
		}
	}

	switch (sOps) {
		case '+':
			iSol = aVals[0] + aVals[1];
			aLine = [__char(0), __char('+'), __char(1), __char(true)]
			break;
		case 'x':
			iSol = aVals[0] * aVals[1];
			aLine = [__char(0), __char('\u00D7'), __char(1), __char(true)]
			break;
		case '++':
			iSol = aVals[0] + aVals[1] + aVals[2];
			aLine = [__char(0), __char('+'), __char(1), __char('+'), __char(2), __char(true)]
			break;
		case 'x+':
			if (Engine.randomInt(1, 100) <= 50) {
				iSol = aVals[0] + aVals[1] * aVals[2];
				aLine = [__char(0), __char('+'), __char(1), __char('\u00D7'), __char(2), __char(true)]
			} else {
				iSol = aVals[0] * aVals[1] + aVals[2];
				aLine = [__char(0), __char('\u00D7'), __char(1), __char('+'), __char(2), __char(true)]
			}
			break;
		default:
			throw new Error('Invalid Ops!');
	}

	return {
		dom: Dom.div(_class.line, null, aLine),
		answerBox: dAnsw,
		solution: iSol
	};
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
	let _keypad;
	let _levelInfo = Engine.getLevelInfo('math', _nextLevel++);
	let _puzzle = _generatePuzzle(_levelInfo);

	function _handleClick(oEvt) {
		_keypad.show();
	}

	function _handleSignal(sSignal, oData) {
		if (sSignal === 'changed') {
			if (oData === _puzzle.solution) {
				fSignal('solved');
			} else {
				_puzzle.answerBox.setAttribute('style', 'color:red;');
			}
		}
	}

	return {
		attempt: 1,
		dom: null,
		levelInfo: _levelInfo,

		remove() {
console.log('remove(math)');
			this.dom.removeEventListener('click', _handleClick);
			_keypad.remove();
		},

		render() {
			_keypad = Key(_puzzle.answerBox, _handleSignal);

			this.dom = Dom.div(_class.base, null, Dom.div(_class.puzzle, {click:_handleClick}, [_puzzle.dom, _keypad]));

			return this.dom;
		},

		update(iCounter) {

		}
	};
}