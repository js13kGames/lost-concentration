import Engine from '../engine.js'
import Dom from '../dom.js'
import Dots from './tasks/dots.js'
import Memory from './tasks/memory.js'
import Subtract from './tasks/subtract.js'

const ACTIVE = 'opacity:0;transition-delay:.8s;z-index:-99;';
const INACTIVE = 'opacity:0.6;transition-delay:0s;z-index:99;';

const _countStyles = [
	'left:4px;top:4px;',
	'right:4px;top:4px;',
	'bottom:4px;right:4px;',
	'bottom:4px;left:4px;'
];

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
	}),
	count: Dom.addStyle('$task-count', {
		'font-size': 4,
		'position': 'absolute'
	})
};


// _createTask(iIndex, fSignal)
function _createTask(iIndex, fSignal) {
	let sType = Engine.nextTaskType(iIndex);

	switch (sType) {
		case 'dots':			return Dots(iIndex, fSignal);
		case 'memory':		return Memory(iIndex, fSignal);
		case 'subtract':	return Subtract(iIndex, fSignal);
		default:			throw new Error('Invalid task type');
	}
}


// Create(bActive, iIndex, fSignal)
// Creates a task component which is one of the four areas on the screen where random tasks are presented.
// 		bActive	- Does this task begin as the active task (able to be interacted with)?
// 		iIndex	- Index of task window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(bActive, iIndex, fSignal) {
	let _completed, _domBack, _domComp, _domCount, _self, _task;

	function _handleSignal(sSignal) {
		console.log('Signal', sSignal);
		if (sSignal === 'solved') {
			_self.dom.removeChild(_task.dom);
			_task.remove();
			_domComp.classList.remove('hidden');
			_completed = true;
			Engine.adjustScore(_task.points);
			_task = null;
			fSignal(sSignal);
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
					_domCount.innerText = _task.tries;
				}

				_domBack.setAttribute('style', ACTIVE);
				_domCount.innerText = --_task.tries;
			} else if (_task) {
				_domBack.setAttribute('style', INACTIVE);
				if (_task.tries === 0) {
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

			_domBack = Dom.div(_class.backdrop, {style:bActive ? ACTIVE : INACTIVE});
			_domComp = Dom.div([_class.complete, 'hidden'], null, 'COMPLETE!');
			_domCount = Dom.div(_class.count, {style:_countStyles[iIndex]}, _task.tries);
			
			this.dom = Dom.div(_class.base, null, [_domCount, _task, _domBack, _domComp]);

			return this.dom;
		},

		update(iCounter) {
			if (_task) {
				_task.update(iCounter);
			}
		}
	};
}