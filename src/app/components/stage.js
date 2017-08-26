import Engine from '../engine'
import Dom from '../dom'
import Pointer from './pointer'
import Window from './task_window'

const UNIT = Dom.UNIT;

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
	}),
	over: Dom.addStyle('$main-over', {
		'align-items': 'center',
		'background': 'red',
		'color': '#FFFFFF',
		'display': 'flex',
		'flex-direction': 'column',
		// 'font-size': 5,
		'height': 50,
		'justify-content': 'center',
		'position': 'absolute',
		'width': 50
	})
}

let _gameOverPositions = [
	`left:0${UNIT};top:0${UNIT}`,
	`left:50${UNIT};top:0${UNIT}`,
	`left:50${UNIT};top:50${UNIT}`,
	`left:0${UNIT};top:50${UNIT}`
];

export default function() {
	let _endGame, _endView, _self;
	let _oldIndex = 0;
	let _pointer = Pointer(_handleSignal);
	let _tasks = [];
	
	for (let i = 0; i < 4; ++i) {
		_tasks.push(Window(i === 0, i, _handleSignal));
	}

	function _gameOver(iIndex) {
		_oldIndex = iIndex;
		_endGame = Engine.getCounter() + 50;
		// _self.dom.appendChild(Dom.div(_class.over, {style:_gameOverPositions[iIndex]}));
		// Engine.stop(Engine.GAME_OVER);
	}

	function _handleSignal(sSignal, vData) {
		switch (sSignal) {
			case 'game_over':
				_gameOver(vData);
				break;
			case 'next':
				_tasks[_oldIndex].active(false);
				_tasks[vData].active(true);
				_oldIndex = (_oldIndex + 1) % 4;
				break;
			case 'restart':
				_tasks.forEach(mTask => {
					mTask.remove();
					mTask.restart();
				});
				_self.dom.removeChild(_endView);
				_endView = null;
				Engine.restart();
				break;
			case 'solved':
				_pointer.next(vData);
				break;
		}
	}

	return {
		dom: null,

		render() {
			_self = this;

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

		restart() {
			_endGame = null;
			_pointer.restart();
			_tasks.forEach(mTask => mTask.restart());
		},

		update(iCounter) {
			if (_endGame) {
console.log('END');
				if (iCounter >= _endGame) {
					Engine.stop(Engine.GAME_OVER);
					_endView = Dom.div(_class.over, {style:_gameOverPositions[_oldIndex]}, [
						Dom.div(null, {style:`font-size:5${UNIT};font-weight:bold;`}, 'Game Over!'),
						Dom.div(null, {style:`font-size:4${UNIT};font-weight:bold;`}, 'Score: ' + Engine.getScore()),
						Dom.div(null, {style:`font-size:1.4${UNIT};`}, '(click spinner for new game)')
					]);
					_self.dom.appendChild(_endView);
				}
			} else {
				_pointer.update(iCounter);
				_tasks[0].update(iCounter);
				_tasks[1].update(iCounter);
				_tasks[2].update(iCounter);
				_tasks[3].update(iCounter);
			}
		}
	};
}