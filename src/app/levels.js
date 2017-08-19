export default {
	dots: {
		// tries: {min:1, max:3, step:-1},
		tries: 3,
		points: 100,
		dotCount: {min:6, max:32, step:1}
	},

	memory: {
		// tries: {min:1, max:3, step:-0.3},
		tries: 3,
		points: 100,
		cols: {min:3, max:6, step:0.5},
		rows: {min:3, max:6, step:0.5}
	},

	subtract: {
		// tries: {min:1, max:3, step:-0.1},
		tries: 3,
		points: 100,
		borrow: {min:1, max:3, step:0.2},
		digits: {min:3, max:5, step:0.2}
	}
}