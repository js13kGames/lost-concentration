export default {
	dots: [
		{attempts:3, points:100, dotCount:6},
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

	math: [
		{attempts:2, points:100, min:1, max:5, ops:'+', lines:2},
		{points:110, max:7},
		{points:120, min:2, max:9, ops:'x'},
		{points:130, min:5, max:12},
		{attempts:3, points:200, min:1, max:6, ops:'++', lines:3},
		{points:220, max:9},
		{points:240, min:3, max:12, ops:'x+'},
		{points:260, min:5, max:15},
		{points:300, min:10, max:20, ops:'x+'},
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
		{attempts:2, points:100, size:4},
		{},
		{points:150, size:5},
		{},
		{},
		{attempts:3, points:200, size:6},
		{},
		{},
		{points:200, size:7},
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