// An object which is used to display tutorial information for one of the seven different tasks (or puzzles) displayed 
// in the task windows during game play.

import Dom from '../dom'
import Engine from '../engine'

const UNIT = Dom.UNIT;

const _class = {
	title: Dom.addStyle('$tut-title', {
		'color': '#FFFFFF',
		'font-size': 4,
		'margin': 1,
		'text-align': 'center'
	}),
	text: Dom.addStyle('$tut-text', {
		'color': '#FFFFFF',
		'font-size': 2,
	})
};

const _styles = [
	Dom.resolveStyles({left:40, top:40}),
	Dom.resolveStyles({right:40, top:40}),
	Dom.resolveStyles({right:40, bottom:40}),
	Dom.resolveStyles({left:40, bottom:40})
];

const _info = {
	dots: {
		a: 'Connect the Dots',
		b: [
			'Simply click the dots in numerical order.',
			"It's exceedingly easy until you get interrupted.",
			"Guess what, there's no indicator for which dot was last clicked.",
			'You have to remember while being distracted by the other puzzles.',
			'Good luck with not losing your place!'
		]
	},
	elvis: {
		a: "Where's Elvis?",
		b: [
			'Several balls are bouncing around the screen.',
			'One of them is labeled "ELVIS".',
			'The rest say something almost, but not quite, entirely unlike "ELVIS".',
			'Click on the real ELVIS ball to complete the puzzle.'
		]
	},
	math: {
		a: 'Shape_stitution',
		b: [
			'Each line represents a simple math expression which must be solved.',
			'Figure out what number is represented by the shape on the first line.',
			'Use this to figure the value for the new shape on the second line.',
			'Use both values in the final expression and click the box to enter a value.'
		]
	},
	memory: {
		a: 'Memory Master',
		b: [
			'This is a simple version of the old "flip the tiles" memory game.',
			"Click two tiles to check what's underneath.",
			'If they match, both tiles disappear.',
			'Continue flipping until all tiles are removed.'
		]
	},
	repeat: {
		a: 'Repeat the Pattern',
		b: [
			'The colored squares with numbers inside represent the required pattern.',
			'You must repeat the pattern by clicking the larger colored tiles below.',
			'The tile must be clicked the number of times listed in the associated square.',
			'For instance, a red square with a "2" means you have to click twice on the red tile.',
			'Just to keep you on your toes, the tiles randomly change positions when clicked.',
			"There's no progress indicator so try not to lose your place when interrupted."
		]
	},
	same: {
		a: 'Same Same',
		b: [
			'The grid displays a number of tiles with different shapes and colors.',
			'Find (and click on) the two which show the same shape AND color.',
			"That's it, really. Nothing to remember. No chance of losing your place.",
			'It is surprisingly distracting, though.',
			'Try not to lose your place in other puzzles while solving this one.'
		]
	},
	subtract: {
		a: 'Simple Subtraction',
		b: [
			'Subtract the number on the second line from the number on the first line.',
			'Enter a solution using buttons above/below placeholders on the third line.',
			'You will always be required to regroup and carry at least once.',
			'Can you keep from losing your concentration after being interrupted?'
		]
	}
};

let _shown = localStorage.getItem('tutorialsShown');
_shown = _shown ? JSON.parse(_shown) : [];

export default {

	// reset([bReset])
	// Reset and save the persistent flag for whether tutorials have been shown.
	// 		bReset	- If true, flags for tutorials shown are all reset to false before values are saved to local storage.
	reset(bReset) {
		if (bReset) {
			_shown = [];
		}

		localStorage.setItem('tutorialsShown', JSON.stringify(_shown));
	},


	// show(dStage, oTask)
	// Show the tutorial for the specified task/puzzle.
	// 		dStage	- DOM element representing the game stage.
	// 		oTask		- Generic object with information about the task o display tutorial for:
	// 								index	- Index of task window containing the puzzle (0:TopLeft, 1:TopRight, 2:BtmRight, 3:BtmLeft).
	// 								type	- String with type of task/puzzle (e.g. 'dots', 'repeat', etc).
	show(dStage, oTask) {
		let sStyle, oInfo, dDiv;

		function __handleClick(oEvt) {
			oEvt.target.removeEventListener('click', __handleClick);
			dStage.removeChild(dDiv);
			dDiv = null;
			Engine.pause(false);
		}

		if (_shown.indexOf(oTask.type) < 0) {
			Engine.pause(true);
			
			_shown.push(oTask.type);
			this.reset();

			sStyle = _styles[oTask.index];
			oInfo = _info[oTask.type];

			dDiv = Dom.div('tutorial', {style:sStyle}, [
				Dom.div(_class.title, null, oInfo.a),
				Dom.ul(_class.text, null, oInfo.b),
				Dom.div(null, {style:'font-weight:bold;text-align:center;'}, '#concentrationlost'),
				Dom.div(_class.title, null, Dom.createElement('button', null, {click:__handleClick}, 'Close'))
			]);

			dStage.appendChild(dDiv);
		}
	}
}