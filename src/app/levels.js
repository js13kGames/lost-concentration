// Used to dynamically create levels (1 - 10) for each of the tasks/puzzles.
// There is an array of objects (0 - 9) for each task type.
// The objects only need to provide keys for values which change from level to level.
// The game engine .getLevelInfo() resolves these into objects with all keys.
// There were intially several more properties for each task and this was an attempt to keep the code size down.

export default {
	dots: [
		{dotCount:6},
		{dotCount:8},
		{dotCount:10},
		{dotCount:14},
		{dotCount:18},
		{dotCount:22},
		{dotCount:28},
		{dotCount:34},
		{dotCount:40},
		{dotCount:48},
	],

	elvis: [
		{count:6, velocity:15},
		{count:8},
		{count:10, velocity:12},
		{},
		{count:12},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
	],

	math: [
		{min:1, max:5, ops:'+', lines:2},
		{max:7},
		{min:2, max:9, ops:'x'},
		{min:5, max:12},
		{min:1, max:6, ops:'++', lines:3},
		{max:9},
		{min:3, max:12, ops:'x+'},
		{min:5, max:15},
		{min:10, max:20, ops:'x+'},
		{},
	],

	memory: [
		{cols:3, rows:3},
		{},
		{cols:4},
		{},
		{rows:4},
		{},
		{cols:5},
		{},
		{rows:5},
		{},
	],

	repeat: [
		{count:4},
		{},
		{count:5},
		{},
		{count:6},
		{},
		{count:7},
		{},
		{count:8},
		{},
	],

	same: [
		{size:4},
		{},
		{size:5},
		{},
		{},
		{size:6},
		{},
		{},
		{size:7},
		{},
	],

	subtract: [
		{digits:3, borrow:1},
		{},
		{digits:4, borrow:1},
		{},
		{borrow:2},
		{},
		{digits:5},
		{},
		{borrow:3},
		{},
	]
}