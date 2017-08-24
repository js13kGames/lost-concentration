import Loop from './loop'
import Levels from './levels'


let _points, _stage;
let _count = 0;
let _firstTask = true;
let _levels = [];
let _nextTypeIndex = 0;
let _score = 0;
let _taskTypes = ['dots', 'math', 'memory', 'repeat', 'same', 'subtract'];


// _update(nDelta)
function _update(nDelta) {
	++_count;
	_stage.update(_count);
}


export default {
	// END_LEVEL: 0,
	GAME_OVER: 0,

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
		let oPrev;

		if (!_levels[sTask]) {
			_levels[sTask] = Levels[sTask].map((oLvl, iNdx) => {
				if (iNdx === 0) {
					oPrev = oLvl;
				} else {
					oPrev = Object.assign({}, oPrev);
					Object.keys(oLvl).forEach(sKey => {
						oPrev[sKey] = oLvl[sKey];
					});
				}
				return oPrev;
			});
		}

		return _levels[sTask][iLevel - 1];
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
		return _taskTypes.splice(this.randomInt(0, _taskTypes.length - 1), 1)[0];
		// return _taskTypes[_nextTypeIndex++ % _taskTypes.length];
		// return 'repeat';
	},


	// randomInt(iMin, iMax)
	// ...
	randomInt(iMin, iMax) {
		return Math.floor(Math.random() * (iMax - iMin + 1) + iMin);
	},


	// // randomInts(iMin, iMax, iCount)
	// // ...
	// randomInts(iMin, iMax, iCount) {
	// 	let aRet = [];

	// 	for (let i = 0; i < iCount; ++i) {
	// 		aRet.push(Math.floor(Math.random() * (iMax - iMin + 1) + iMin));
	// 	}

	// 	return aRet;
	// },


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


	// randomize(aSrc[, bCopy])
	// ...
	randomize(aSrc, bCopy) {
		let aRet = bCopy ? aSrc.slice() : aSrc;

		for (let i = 0, l = aRet.length; i < l; ++i) {
			let iRnd = this.randomInt(0, l - 1);
			let vSwap = aRet[i];

			aRet[i] = aRet[iRnd];
			aRet[iRnd] = vSwap;
		}

		return aRet;
	},


	// randomNot(iMin, iMax, aEx)
	// ...
	randomNot(iMin, iMax, aEx) {
		let iRet;

		do {
			iRet = Math.floor(Math.random() * (iMax - iMin + 1) + iMin);
		} while (aEx.indexOf(iRet) >= 0);

		return iRet;
	},


	// returnTypeToPool(sType)
	// ...
	returnTypeToPool(sType) {
		_taskTypes.push(sType);
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