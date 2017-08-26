import Engine from '../engine'
import Dom from '../dom'
import Input from '../components/number_input'

const _class = {
	base: Dom.addStyle('$task-subtract', {
		'align-items': 'center',
		'display': 'flex',
		'flex': '1',
		'flex-direction': 'column',
		'font-family': 'monospace',
		'font-size': 10,
		'font-weight': 'bold',
		'height': '100%',
		'justify-content': 'center',
		'position': 'relative',
		'width': '100%'
	}),
	problem: Dom.addStyle('$subtract-problem', {
		'align-items': 'flex-end',
		'display': 'flex',
		'flex': '1',
		'flex-direction': 'column',
		'justify-content': 'center',
	}),
	line2: Dom.addStyle('$subtract-line2', {
		'border-bottom': '4px solid #000000',
		'margin-bottom': 1
	})
};

let _nextLevel = 1;		// Static global for all dots tasks...


// _createProblem(oLevel)
function _createProblem(oLevel) {
	let oValues = _generateValues(oLevel);

	return oValues;
}


// _generateValues(oLevel)
function _generateValues(oLevel) {
	let oRet = {};
	let aLine1 = [];
	let aLine2 = [];

	for (let i = 0; i < oLevel.digits; ++i) {
		let iLine1 = Engine.randomInt(0, 9);
		let iLine2 = Engine.randomInt(0, 9);

		if (i === 0) {
			iLine1 = Math.max(1, iLine1);
			iLine2 = 0;
		} else if (i === oLevel.digits - oLevel.borrow) {
			iLine1 = Math.min(8, iLine1);
			iLine2 = Math.max(iLine1 + 1, iLine2);
		} else if (i === 1 && iLine2 === 0) {
			iLine2 = Engine.randomInt(0, 9);
		}

		aLine1.push(iLine1);
		aLine2.push(iLine2);
	}

	oRet.line1 = parseInt(aLine1.join(''));
	oRet.line2 = parseInt(aLine2.join(''));
	oRet.solution = oRet.line1 - oRet.line2;

	return oRet;
}


// Create(iIndex, fSignal)
// Creates a component representing a "Subtraction" task.
// 		iIndex	- Index of task window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(iIndex, fSignal) {
	let _levelInfo = Engine.getLevelInfo('subtract', _nextLevel++);
	let _problem = _createProblem(_levelInfo);
	let _inputs = Input(_problem.solution, _handleSignal);
	
	function _handleSignal(sSignal) {
		fSignal('solved');
	}

	return {
		attempt: 1,
		dom: null,
		levelInfo: _levelInfo,

		remove() {
			_inputs.remove();
		},

		render() {
			this.dom = Dom.div(_class.base, null, [
				Dom.div(_class.problem, null, [
					Dom.div('', null, _problem.line1),
					Dom.div(_class.line2, null, _problem.line2),
					_inputs
				])
			]);

			return this.dom;
		},

		restart() {
			_nextLevel = 1;
		},

		update(iCounter) {

		}
	};
}