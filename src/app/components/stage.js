import Engine from '../engine'
import Dom from '../dom'
import Pointer from './pointer'
import Tutorial from './tutorial'
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


// Create(iLevel)
// Creates a the stage which contains and coordinates all game elements.
// 		iLevel	- Level selected (0:Easy, 1:Hard, 2:Insane) which control number of attempts allowed and rotation freq.
// Returns an object which represents a component.
export default function(iLevel) {
	let _endGame, _endView, _self;
	let _oldIndex = 0;
	let _pointer = Pointer(iLevel, _handleSignal);
	let _windows = [];
	
	for (let i = 0; i < 4; ++i) {
		_windows.push(Window(i === 0, i, iLevel, _handleSignal));
	}

	function _gameOver(iIndex) {
		_oldIndex = iIndex;
		_endGame = Engine.getCounter() + 50;
	}

	function _handleSignal(sSignal, vData) {
		switch (sSignal) {
			case 'game_over':
				_gameOver(vData);
				break;
			case 'next':
				_windows[_oldIndex].active(false);
				_windows[vData].active(true);
				_oldIndex = (_oldIndex + 1) % 4;
				Tutorial.show(_self.dom, {index:vData, type:_windows[vData].getType()});
				break;
			case 'restart':
				_self.dom.removeChild(_endView);
				_endView = null;
				_endGame = null;
				_pointer.restart();
				Engine.resetLevels();
				_windows.forEach(mTask => mTask.restart());
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
					_windows[0],
					_windows[1]
				]),
				Dom.div(_class.row, null, [
					_windows[3],
					_windows[2]
				]),
				_pointer
			]);
			
			Tutorial.show(this.dom, {index:0, type:Engine.nextBufferedTaskType()});

			return this.dom;
		},

		update(iCounter) {
			if (_endGame) {
				if (iCounter >= _endGame) {
					let iHigh, iScore, sHigh, sScore, aScores;

					Engine.stop(Engine.GAME_OVER);

					aScores = JSON.parse(localStorage.getItem('highScores') || '[0,0,0]');
					iScore = Engine.getScore();
					iHigh = aScores[iLevel];

					if (iScore > iHigh) {
						sScore = 'New High Score: ' + iScore;
						sHigh = `(previous was ${iHigh})`;
						aScores[iLevel] = iScore;
						localStorage.setItem('highScores', JSON.stringify(aScores));
					} else {
						sScore = 'Score: ' + iScore;
						sHigh = `(high is ${iHigh})`;
					}

					_endView = Dom.div(_class.over, {style:_gameOverPositions[_oldIndex]}, [
						Dom.div(null, {style:`font-size:5${UNIT};font-weight:bold;`}, 'Game Over!'),
						Dom.div(null, {style:`font-size:3.8${UNIT};font-weight:bold;`}, sScore),
						Dom.div(null, {style:`font-size:3.2${UNIT};font-weight:bold;`}, sHigh),
						Dom.div(null, {style:`font-size:1.4${UNIT};padding-top:4${UNIT}`}, '(click spinner for new game)')
					]);
					_self.dom.appendChild(_endView);
				}
			} else {
				_pointer.update(iCounter);
				_windows[0].update(iCounter);
				_windows[1].update(iCounter);
				_windows[2].update(iCounter);
				_windows[3].update(iCounter);
			}
		}
	};
}