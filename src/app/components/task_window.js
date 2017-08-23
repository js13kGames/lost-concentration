import Engine from '../engine'
import Dom from '../dom'
import Dots from './tasks/dots'
import Math from './tasks/math'
import Memory from './tasks/memory'
import Same from './tasks/same'
import Subtract from './tasks/subtract'
import Attempts from '../components/attempt_indicator'

const ACTIVE = 'opacity:0;transition-delay:.8s;z-index:-99;';
const INACTIVE = 'opacity:0.6;transition-delay:0s;z-index:99;';

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
		opacity: '0.6',
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


// _createTask(iIndex, fSignal)
function _createTask(iIndex, fSignal) {
	let sType = Engine.nextTaskType(iIndex);

	switch (sType) {
		case 'dots':			return Dots(iIndex, fSignal);
		case 'math':			return Math(iIndex, fSignal);
		case 'memory':		return Memory(iIndex, fSignal);
		case 'same':			return Same(iIndex, fSignal);
		case 'subtract':	return Subtract(iIndex, fSignal);
		default:					throw new Error('Invalid task type');
	}
}


// Create(bActive, iIndex, fSignal)
// Creates a task component which is one of the four areas on the screen where random tasks are presented.
// 		bActive	- Does this task begin as the active task (able to be interacted with)?
// 		iIndex	- Index of task window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(bActive, iIndex, fSignal) {
	let _attempt, _completed, _domBack, _domComp, _self, _task;

	function _handleSignal(sSignal, vData) {
		if (sSignal === 'solved') {
			let mTask = _task;
			_task = null;
			_self.dom.removeChild(mTask.dom);
			mTask.remove();
			_domComp.classList.remove('hidden');
			_completed = true;
			Engine.adjustScore(mTask.levelInfo.points * (mTask.levelInfo.attempts - mTask.attempt + 1));
			fSignal(sSignal, mTask.attempt === 1);
		}
	}

	return {
		dom: null,

		active(bVal) {
			bActive = bVal;

			if (bActive) {
				if (_completed) {
					_completed = false;
					_domComp.classList.add('hidden');
					_task = _createTask(iIndex, _handleSignal);
					_self.dom.appendChild(_task.render());
					_attempt.setAttempt(1);
				}
				_domBack.setAttribute('style', ACTIVE);
			} else if (_task) {
				_domBack.setAttribute('style', INACTIVE);
				_attempt.setAttempt(++_task.attempt);
				if (_task.attempt > _task.levelInfo.attempts) {
					Engine.stop(Engine.GAME_OVER);
				}
			}
		},

		remove() {
			//!!!
		},

		render() {
			_self = this;
			_task = _createTask(iIndex, _handleSignal);
			_attempt = Attempts(_task.levelInfo.attempts, iIndex);

			_domBack = Dom.div(_class.backdrop, {style:bActive ? ACTIVE : INACTIVE});
			_domComp = Dom.div([_class.complete, 'hidden'], null, 'COMPLETE!');
			
			this.dom = Dom.div(_class.base, null, [_attempt, _task, _domBack, _domComp]);

			return this.dom;
		},

		update(iCounter) {
			if (_task) {
				_task.update(iCounter);
			}
		}
	};
}