import Engine from '../engine'
import Dom from '../dom'
import Attempts from '../components/attempt_indicator'

import Dots from '../tasks/dots'
import Elvis from '../tasks/elvis'
import Mathish from '../tasks/math'
import Memory from '../tasks/memory'
import Repeat from '../tasks/repeat'
import Same from '../tasks/same'
import Subtract from '../tasks/subtract'

const ATTEMPTS = 2;
const POINTS = 100;

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
	backdrop: Dom.addStyle('$task-back', {
		background: '#000000',
		height: '100%',
		opacity: '0.65',
		position: 'absolute',
		transition: 'opacity .6s ease-out',
		width: '100%'
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
	})
};

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
	let mRet = _tasks[sType](iIndex,fSignal);

	mRet.type = sType;

	return mRet;
}


// Create(bActive, iIndex, fSignal)
// Creates a task component which is one of the four areas on the screen where random tasks are presented.
// 		bActive	- Does this task begin as the active task (able to be interacted with)?
// 		iIndex	- Index of task window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(bActive, iIndex, fSignal) {
	let _attempt, _completed, _domBack, _domComp, _self, _task;

	function _clear(mTask) {
		if (mTask) {
			_task = null;
			_self.dom.removeChild(mTask.dom);
			mTask.remove();
			Engine.returnTypeToPool(mTask.type);
		} else {
			_completed = false;
			_domComp.classList.add('hidden');
			_task = _createTask(iIndex, _handleSignal);
			_self.dom.appendChild(_task.render());
			_attempt.setAttempt(1);
		}
	}

	function _handleSignal(sSignal, vData) {
		let mTask = _task;

		if (sSignal === 'solved') {
			_clear(mTask);
			_domComp.classList.remove('hidden');
			_completed = true;
			Engine.adjustScore(POINTS * (ATTEMPTS - mTask.attempt + 1));
			fSignal(sSignal, mTask.attempt === 1);
		}
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
				if (_task.attempt > ATTEMPTS) {
					fSignal('game_over', iIndex);
				}
			}
		},

		remove() {
			_task.remove();
		},

		render() {
			_self = this;
			_task = _createTask(iIndex, _handleSignal);
			_attempt = Attempts(ATTEMPTS, iIndex);

			_domBack = Dom.div(_class.backdrop, {style:bActive ? ACTIVE : INACTIVE});
			_domComp = Dom.div([_class.complete, 'hidden'], null, 'COMPLETE!');
			
			this.dom = Dom.div(_class.base, null, [_attempt, _task, _domBack, _domComp]);

			return this.dom;
		},

		restart() {
			_clear(_task);
			_clear();
			_task.restart();
		},

		update(iCounter) {
			if (_task) {
				_task.update(iCounter);
			}
		}
	};
}