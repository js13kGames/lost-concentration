import Engine from '../engine'
import Dom from '../dom'

const UNIT = Dom.UNIT;
const FAKES = ['ELV1S', 'E1VIS', 'EVLIS'];

const _class = {
	base: Dom.addStyle('$task-elvis', {
		'align-items': 'center',
		'display': 'flex',
		'height': '100%',
		'justify-content': 'center',
		'position': 'relative',
		'width': '100%'
	}),
	board: Dom.addStyle('$elvis-board', {
		'background': '#000000',
		'display': 'flex',
		'flex-direction': 'column',
		'height': 40,
		'position': 'relative',
		'width': 40
	}),
	ball: Dom.addStyle('$elvis-ball', {
		'align-items': 'center',
		'background': 'yellow',
		'border-radius': '2.5=',
		'cursor': 'pointer',
		'display': 'flex',
		'font-size': 1.5,
		'height': 5,
		'justify-content': 'center',
		'position': 'absolute',
		'width': 5
	})
};

let _nextLevel = 1;


// _randomVelocity(oLevel)
function _randomVelocity(oLevel) {
	let nVel = oLevel.velocity;
	let nX = Engine.randomInt(-1, 1);
	let nY = nX === 0 ? 1 * Engine.randomInt(0, 1) * 2 - 1 : Engine.randomInt(-1, 1);
	return {vx:nX / Engine.randomInt(nVel, nVel + 5), vy:nY / Engine.randomInt(nVel, nVel + 5)}; 
}


// Create(iIndex, fSignal)
// Creates a component representing a "Repeat Pattern" task.
// 		iIndex	- Index of task window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(iIndex, fSignal) {
	let _balls;
	let _levelInfo = Engine.getLevelInfo('elvis', _nextLevel++);

	function _createBall(bElvis) {
		let sName = bElvis ? 'ELVIS' : Engine.randomItem(FAKES);
		let iX = Engine.randomInt(0, 3500) / 100;
		let iY = Engine.randomInt(0, 3500) / 100;
		let oDir = _randomVelocity(_levelInfo);

		return {
			elvis: bElvis,
			dom: Dom.div(_class.ball, {style:`left:${iX}${UNIT};top:${iY}${UNIT};`, click:_handleClick}, sName),
			x: iX,
			y: iY,
			vx: oDir.vx,
			vy: oDir.vy
		};
	}

	function _handleClick(oEvt) {
		if (oEvt.target.innerText === 'ELVIS') {
			fSignal('solved');
		}
	}

	return {
		attempt: 1,
		dom: null,
		levelInfo: _levelInfo,

		remove() {
console.log('remove(elvis)');
			_balls.forEach(oBall => oBall.dom.removeEventListener('click', _handleClick));
		},

		render() {
			_balls = [];
			for (let i = 0; i < _levelInfo.count; ++i) {
				_balls.push(_createBall(i === 0));
			}

			this.dom = Dom.div(_class.base, null, Dom.div(_class.board, null, _balls.map(oBall => oBall.dom)));

			return this.dom;
		},

		update(iCounter) {
			_balls.forEach(oBall => {
				oBall.x += oBall.vx;
				oBall.y += oBall.vy;
				if (oBall.x < 0 || oBall.x > 35) oBall.vx *= -1; 
				if (oBall.y < 0 || oBall.y > 35) oBall.vy *= -1; 
				oBall.dom.setAttribute('style', `left:${oBall.x}${UNIT};top:${oBall.y}${UNIT};`);
			});
		}
	};
}