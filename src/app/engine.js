import Loop from './loop.js'
import Levels from './levels.js'

const _taskTypes = ['dots', 'memory', 'subtract'];

let _points, _stage;
let _count = 0;
let _firstTask = true;
let _nextTypeIndex = 0;
let _score = 0;


// _update(nDelta)
function _update(nDelta) {
	++_count;
	_stage.update(_count);
}


export default {
	// END_LEVEL: 0,
	GAME_OVER: 0,

	// UNIT: document.body.clientHeight <= document.body.clientWidth ? 'vh' : 'vw',

	// currentLevel
	// ...
	currentLevel: 1,


	// adjustScore(iAmount)
	// ...
	adjustScore(iAmount) {
		_score += iAmount;
console.log('+++', iAmount, _score);
	},


	// getCounter()
	// ...
	getCounter() {
		return _count;
	},


	// getLevelInfo(sTask, iLevel)
	// ...
	getLevelInfo(sTask, iLevel) {
		let oRet = {};
		let oLevel = Levels[sTask];

		--iLevel;

		Object.keys(oLevel).forEach(sKey => {
			let vVal = oLevel[sKey];
			let sType = typeof vVal;

			if (sType === 'object') {
				if (vVal.step > 0) {
					oRet[sKey] = Math.min(vVal.max, Math.floor(vVal.min + vVal.step * iLevel));
				} else {
					oRet[sKey] = Math.max(vVal.min, Math.ceil(vVal.max + vVal.step * iLevel));
				}
			} else {
				oRet[sKey] = vVal;
			}
		});

		if (_firstTask) {
			_firstTask = false;
			--oRet.tries;
		}

		return oRet;
	},


	// init(mStage)
	// ...
	init(mStage) {
		_count = _points = 0;
		_stage = mStage;

		document.body.appendChild(mStage.render());
		
		Loop.setUpdate(_update);
		Loop.start();
	},


	// nextTaskType(iIndex)
	// Get the type of secondary task to present next.
	// 		iIndex	- Index of the secondary task area (0:UpperLeft, 1:UpperRight, 2:LowerLeft, 3:LowerRight).
	// Returns a string with the type of secondary task ("dots|...").
	nextTaskType(iIndex) {
		return _taskTypes[_nextTypeIndex++ % 3];
		// return 'memory';
	},


	// randomInt(iMin, iMax])
	// ...
	randomInt(iMin, iMax) {
		return Math.floor(Math.random() * (iMax - iMin + 1) + iMin);
	},


	// // randomItem(aSrc)
	// // ...
	// randomItem(aSrc) {
	// 	return aSrc[this.randomInt(0, aSrc.length - 1)];
	// },


	// randomItems(aSrc, iCount)
	// ...
	randomItems(aSrc, iCount) {
		let aRet = [];
		let aCopy = aSrc.slice();

		for (let i = 0; i < iCount; ++i) {
			aRet.push(aCopy.splice(this.randomInt(0, aCopy.length - 1), 1)[0]);
		}

		return aRet;
	},


	// randomize(aTgt)
	// ...
	randomize(aTgt) {
		for (let i = 0, l = aTgt.length; i < l; ++i) {
			let iRnd = this.randomInt(0, l - 1);
			let vSwap = aTgt[i];

			aTgt[i] = aTgt[iRnd];
			aTgt[iRnd] = vSwap;
		}
	},


	// stop(iCode)
	// ...
	stop(iCode) {
		Loop.stop();
	console.log('Engine Stopped', iCode);
	console.log('SCORE:', _score);
	},


	// updatePoints(iPoints)
	// ...
	updatePoints(iPoints) {
		_points += iPoints;
		console.log('POINTS', _points, iPoints);
	}
}