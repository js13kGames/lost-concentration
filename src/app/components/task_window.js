import Attempts from '../components/attempt_indicator'
import Audio from '../audio'
import Dom from '../dom'
import Engine from '../engine'

import Dots from '../tasks/dots'
import Elvis from '../tasks/elvis'
import Mathish from '../tasks/math'
import Memory from '../tasks/memory'
import Repeat from '../tasks/repeat'
import Same from '../tasks/same'
import Subtract from '../tasks/subtract'

const POINTS = 100;
const ATTEMPTS = [4, 3, 2];

const ACTIVE = 'opacity:0;transition-delay:.8s;z-index:-99;';
const INACTIVE = 'opacity:0.65;transition-delay:0s;z-index:99;';

const _class = {
	base: Dom.addStyle('$task-window', {
		'border': '1px solid #A0A0A0',
		'display': 'flex',
		'flex': '1',
		'flex-direction': 'column',
		'position': 'relative'
	}),
	complete: Dom.addStyle('$task-complete', {
		'align-items': 'center',
		'background': 'green',
		'color': '#FFFFFF',
		'display': 'flex',
		'font-size': 4,
		'height': '100%',
		'justify-content': 'center',
		'position': 'absolute',
		'width': '100%',
		'z-index': '100'
	}),
	level: Dom.addStyle('$task-level', {
		'color': '#808080',
		'font-size': 2,
		'position': 'absolute'
	})
};

const _levelStyles = [
	'left:4px;bottom:4px;',
	'right:4px;bottom:4px;',
	'right:4px;top:4px;',
	'left:4px;top:4px;',
];

const _tasks = {
	dots: Dots,
	elvis: Elvis,
	math: Mathish,
	memory: Memory,
	repeat: Repeat,
	same: Same,
	subtract: Subtract
}


// _createTask(iIndex, fSignal)
function _createTask(iIndex, fSignal) {
	let sType = Engine.nextTaskType();
	let mRet = _tasks[sType](iIndex, fSignal);

	mRet.type = sType;

	return mRet;
}


// Create(bActive, iIndex, iLevel, fSignal)
// Creates a task window which is one of the four areas on the stage where random tasks are presented.
// 		bActive	- Does this window begin as the active window (able to be interacted with)?
// 		iIndex	- Index of window window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		iLevel	- Level (0:Easy, 1:hard, 2:Insane).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(bActive, iIndex, iLevel, fSignal) {
	let _attempt, _completed, _domBack, _domComp, _levelInd, _self, _task;
	let _attemptsAllowed = ATTEMPTS[iLevel];

	function _clear() {
		_completed = false;
		_domComp.classList.add('hidden');
		_task = _createTask(iIndex, _handleSignal);
		_self.dom.appendChild(_task.render());
		_attempt.setAttempt(1);
		_levelInd.innerText = 'Level ' + (_task.levelInfo.level + 1);
	}

	function _handleSignal(sSignal, vData) {
		let mTask = _task;

		if (sSignal === 'solved') {
			Audio.correct();
			_removeTask(mTask);
			_domComp.classList.remove('hidden');
			_completed = true;
			Engine.adjustScore(POINTS * (_attemptsAllowed - mTask.attempt + 1));
			fSignal(sSignal, mTask.attempt === 1);
		}
	}

	function _removeTask(mTask) {
		_task = null;
		_self.dom.removeChild(mTask.dom);
		mTask.remove();
		Engine.returnTypeToPool(mTask.type);
	}

	return {
		dom: null,

		active(bVal) {
			bActive = bVal;

			if (bActive) {
				if (_completed) {
					_clear();
				}
				_domBack.setAttribute('style', ACTIVE);
			} else if (_task) {
				_domBack.setAttribute('style', INACTIVE);
				_attempt.setAttempt(++_task.attempt);
				if (_task.attempt > _attemptsAllowed) {
					fSignal('game_over', iIndex);
				}
			}
		},

		getType() {
			return _task.type;
		},

		remove() {
			_task.remove();
		},

		render() {
			_self = this;
			_task = _createTask(iIndex, _handleSignal);
			_attempt = Attempts(_attemptsAllowed, iIndex);

			_domBack = Dom.div('window-inactive', {style:bActive ? ACTIVE : INACTIVE});
			_domComp = Dom.div([_class.complete, 'hidden'], null, 'COMPLETE!');
			_levelInd = Dom.div(_class.level, {style:_levelStyles[iIndex]}, 'Level ' + (_task.levelInfo.level + 1));
			
			this.dom = Dom.div(_class.base, null, [_attempt, _task, _domBack, _domComp, _levelInd]);

			return this.dom;
		},

		restart() {
			if (_task) {
				_removeTask(_task);
				_clear();
			}
		},

		update(iCounter) {
			if (_task) {
				_task.update(iCounter);
			}
		}
	};
}