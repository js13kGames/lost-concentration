export default {
	dots: [
		{attempts:3, points:100, dotCount:4},
		{dotCount:6},
		{dotCount:8},
		{dotCount:9},
		{dotCount:10},
		{dotCount:11},
		{dotCount:12},
		{dotCount:13},
		{dotCount:14},
		{dotCount:15},
	],

	math: [
		{attempts:2, points:100, min:1, max:5, ops:'++'},
		{points:120, max:9},
		{points:130, min:3, ops:'+x'},
		{attempts:3, points:150, min:5, max:12, ops:'++'},
		{points:180, ops:'+x'},
		{points:200, min:8, max:15, ops:'++'},
		{points:250, ops:'+x'},
		{points:300, min:10, max:20, ops:'++'},
		{points:380, ops:'+x'},
		{},
	],

	memory: [
		{attempts:3, points:120, cols:3, rows:3},
		{},
		{points:180, cols:4},
		{},
		{attempts:4, points:250, rows:4},
		{},
		{attempts:5, points:400, cols:5},
		{},
		{attempts:6, points:600, rows:5},
		{},
	],

	same: [
		{attempts:3, points:100, size:5},
		{},
		{points:120, size:6},
		{},
		{points:150, size:7},
		{},
		{points:190, size:8},
		{},
		{points:250, size:9},
		{},
		{points:320, size:10},
		{},
	],

	subtract: [
		{attempts:3, points:120, digits:3, borrow:1},
		{},
		{points:150, digits:4, borrow:1},
		{},
		{points:200, borrow:2},
		{},
		{points:220, digits:5},
		{},
		{points:280, borrow:3},
		{},
	]

	// dots: {
	// 	attempts: 3,
	// 	points: 100,
	// 	dotCount: {min:6, max:32, step:1}
	// },

	// memory: {
	// 	attempts: 3,
	// 	points: 100,
	// 	cols: {min:3, max:6, step:0.5},
	// 	rows: {min:3, max:6, step:0.5}
	// },

	// subtract: {
	// 	attempts: 3,
	// 	points: 100,
	// 	borrow: {min:1, max:3, step:0.2},
	// 	digits: {min:3, max:5, step:0.2}
	// }
}