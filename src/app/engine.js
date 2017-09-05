import Loop from './loop'
import Levels from './levels'

let _paused, _score, _stage;
let _count = 0;
let _levels = [];
let _nextTypeIndex = 0;
let _taskList = [];
let _taskTypes = ['dots', 'elvis', 'math', 'memory', 'repeat', 'same', 'subtract'];


// _update(nDelta)
function _update(nDelta) {
	++_count;
	_stage.update(_count);
}


export default {
	GAME_OVER: 0,

	// started
	// Has game engine been started?
	started: false,


	// stopped
	// Is game engine stopped?
	stopped: false,


	// adjustScore(iAmount)
	// Adjust the score.
	// 		iAmount	- Amoun to adjust the score by.
	adjustScore(iAmount) {
		_score += iAmount;
	},


	// getCounter()
	// Get the current value of the loop counter.
	getCounter() {
		return _count;
	},


	// getLevelInfo(sTask)
	// Process data from imported level.js file and get data for next level of the specified task.
	// 		sTask	- Name of the task/puzzle to get information for.
	// Returns a generic object with key/value pairs specific to the task.
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
	// Resets the "next level" index for each task to zero.
	resetLevels() {
		Object.keys(_levels).forEach(sKey => _levels[sKey].nextLevel = 0);
	},


	// getScore()
	// Returns the current score.
	getScore() {
		return _score;
	},


	// init(mStage)
	// Initializes the game engine.
	// 		mStage	- Component representing the game stage which contains all game elements.
	init(mStage) {
		_count = _score = 0;
		_stage = mStage;
		this.stopped = false;

		document.body.appendChild(mStage.render());
		
		Loop.setUpdate(_update);
		this.started = true;

		if (!_paused) Loop.start();
	},


	// nextBufferedTaskType()
	// Returns a string representing the oldest task type returned by all calls to the .nextTaskType() method. Ugly kluge 
	// caused by a lack of foresight and the addition of tutorials for each task.
	nextBufferedTaskType() {
		return _taskList.shift();
	},


	// nextTaskType()
	// Get the type of secondary task to present next. The selected type is somewhat random but is weighted towards the 
	// ones which have been displayed less recently.
	// Returns a string with the type of secondary task ("dots|memory|...").
	nextTaskType() {
		let sRet;
		let iChk = 3;
		let iIndex = _taskTypes.length - 1;
		let iRnd = this.randomInt(1, 100);

		while (iRnd < 100 - iChk && iIndex > 0) {
			--iIndex;
			iChk *= 2;
		}

		sRet = _taskTypes.splice(Math.max(0, iIndex), 1)[0];
		_taskList.push(sRet);

		return sRet;
	},


	// pause(bPause)
	// Pauses or unpauses the game loop.
	// 		bPause	- Pauses if true, unpauses if false.
	pause(bPause) {
		_paused = bPause;

		if (bPause) {
			Loop.stop();
		} else {
			Loop.start();
		}
	},


	// randomInt(iMin, iMax)
	// Returns a random integer between iMin and iMax.
	randomInt(iMin, iMax) {
		return Math.floor(Math.random() * (iMax - iMin + 1) + iMin);
	},


	// randomItem(aSrc)
	// Returns a randomm item from the array provided. Does not modify the array.
	randomItem(aSrc) {
		return aSrc[this.randomInt(0, aSrc.length - 1)];
	},


	// randomItems(aSrc, iCount)
	// Randomly selects one or more items from an array. Ensures the same item isn't returned more than once.
	// 		aSrc		- Source array to select items from.
	// 		iCount	- Number of items to select.
	// Returns an array with random elements from the source array.
	randomItems(aSrc, iCount) {
		let aRet = [];
		let aCopy = aSrc.slice();

		for (let i = 0; i < iCount; ++i) {
			aRet.push(aCopy.splice(this.randomInt(0, aCopy.length - 1), 1)[0]);
		}

		return aRet;
	},


	// randomize(aSrc[, bCopy])
	// Randomizes the order of elements in an array.
	// 		aSrc	- Source array to randomize.
	// 		bCopy	- [false] If true, a copy of the array is created and randomized instead of the source array itself.
	// Returns the randomized array.
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


	// restart()
	// Restarts the game engine.
	restart() {
		_count = _score = 0;
		this.stopped = false;
		Loop.start();
	},


	// returnTypeToPool(sType)
	// Returns the specified task type to the pool of available types. This is part of the system which randomizes the 
	// order tasks/puzzles are displayed but prevents mutiple copies of the same task to be displayed at once.
	returnTypeToPool(sType) {
		_taskTypes.push(sType);
	},


	// stop(iCode)
	// Stops the game engine.
	stop(iCode) {
		this.stopped = true;
		Loop.stop();
	}


}