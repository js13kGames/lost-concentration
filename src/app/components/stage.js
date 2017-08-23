import Dom from '../dom'
import Pointer from './pointer'
import Window from './task_window'

const _class = {
	base: Dom.addStyle('$main-stage', {
	  'background': '#F0F0F0',
	  'display': 'flex',
	  'flex-direction': 'column',
	  'height': 100,
	  'position': 'relative',
	  'width': 100
	}),
	row: Dom.addStyle('$main-row', {
		'display': 'flex',
		'flex': '1',
		'flex-direction': 'row'
	})
}

export default function() {
	let _oldIndex = 0;
	let _pointer = Pointer(_handleSignal);

	let _tasks = [];
	for (let i = 0; i < 4; ++i) {
		_tasks.push(Window(i === 0, i, _handleSignal));
	}

	function _handleSignal(sSignal, vData) {
		if (sSignal === 'next') {
			_tasks[_oldIndex].active(false);
			_tasks[vData].active(true);
			_oldIndex = (_oldIndex + 1) % 4;
		} else if (sSignal === 'solved') {
			_pointer.next(vData);
		}
	}

	return {
		dom: null,

		render() {
			// this.dom = Dom.div(_class, null, _pointer);
			this.dom = Dom.div(_class.base, null, [
				Dom.div(_class.row, null, [
					_tasks[0],
					_tasks[1]
				]),
				Dom.div(_class.row, null, [
					_tasks[3],
					_tasks[2]
				]),
				_pointer
			]);
			
			return this.dom;
		},

		update(iCounter) {
			_pointer.update(iCounter);
			_tasks[0].update(iCounter);
			_tasks[1].update(iCounter);
			_tasks[2].update(iCounter);
			_tasks[3].update(iCounter);
		}
	};
}