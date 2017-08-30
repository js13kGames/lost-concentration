import Loop from './loop'
import Levels from './levels'

let _points, _stage;
let _count = 0;
let _firstTask = true;
let _levels = [];
let _nextTypeIndex = 0;
let _paused;
let _score = 0;
//!!!!TUTORIAL
let _taskList = [];
let _taskTypes = ['dots', 'elvis', 'math', 'memory', 'repeat', 'same', 'subtract'];


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

	// started
	// ...
	started: false,

	// stopped
	// ...
	stopped: false,


	// adjustScore(iAmount)
	// ...
	adjustScore(iAmount) {
		_score += iAmount;
	},


	// getCounter()
	// ...
	getCounter() {
		return _count;
	},


	// getLevelInfo(sTask)
	// ...
	getLevelInfo(sTask) {
		let oPrev;

		if (!_levels[sTask]) {
			_levels[sTask] = {nextLevel:0};
			_levels[sTask].info = Levels[sTask].map((oLvl, iNdx) => {
				if (iNdx === 0) {
					oPrev = oLvl;
				} else {
					// oPrev = Object.assign({}, oPrev);
					oPrev = Object.assign({}, oPrev);
					Object.keys(oLvl).forEach(sKey => {
						oPrev[sKey] = oLvl[sKey];
					});
				}
				oPrev.level = iNdx;
				return oPrev;
			});
		}

		return _levels[sTask].info[_levels[sTask].nextLevel++];
	},


	// resetLevels()
	// ...
	resetLevels() {
		Object.keys(_levels).forEach(sKey => _levels[sKey].nextLevel = 0);
	},


	// getScore()
	// ...
	getScore() {
		return _score;
	},


	// init(mStage)
	// ...
	init(mStage) {
		_count = _points = 0;
		_stage = mStage;
		this.stopped = false;

		document.body.appendChild(mStage.render());
		
		Loop.setUpdate(_update);
		this.started = true;

		if (!_paused) Loop.start();
	},


//!!!!TUTORIAL
	// nextBufferedTaskType()
	// ...
	nextBufferedTaskType() {
	console.log('Buff', _taskList);
		return _taskList.shift();
	},


	// nextTaskType()
	// Get the type of secondary task to present next. The selected type is somewhat random but is weighted towards the 
	// ones which have been displayed less recently.
	// Returns a string with the type of secondary task ("dots|memory|...").
	nextTaskType() {
//!!!!TUTORIAL
let sRet;
		let iChk = 3;
		let iIndex = _taskTypes.length - 1;
		let iRnd = this.randomInt(1, 100);

		while (iRnd < 100 - iChk && iIndex > 0) {
			--iIndex;
			iChk *= 2;
		}

//!!!!TUTORIAL
sRet = _taskTypes.splice(Math.max(0, iIndex), 1)[0];
_taskList.push(sRet);
return sRet;
		// return _taskTypes.splice(Math.max(0, iIndex), 1)[0];
		// return 'elvis';
	},


//!!!!TUTORIAL
// pause(bPause)
// ...
pause(bPause) {
	_paused = bPause;

	if (bPause) {
console.log('Pause');
		Loop.stop();
	} else {
		Loop.start();
	}
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


	// randomItem(aSrc)
	// ...
	randomItem(aSrc) {
		return aSrc[this.randomInt(0, aSrc.length - 1)];
	},


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


	// restart()
	// ...
	restart() {
		console.log('Restart game');
		_count = _points = 0;
		this.stopped = false;
		// _stage.restart();
		Loop.start();
	},


	// returnTypeToPool(sType)
	// ...
	returnTypeToPool(sType) {
		_taskTypes.push(sType);
	},


	// stop(iCode)
	// ...
	stop(iCode) {
		this.stopped = true;
		Loop.stop();
console.log('Engine Stopped', iCode);
	},


	// updatePoints(iPoints)
	// ...
	updatePoints(iPoints) {
		_points += iPoints;
	}
}