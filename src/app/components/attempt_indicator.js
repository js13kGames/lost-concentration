import Dom from '../dom'

const _styles = [
	'top:2px;',
	'top:2px;',
	'bottom:2px;',
	'bottom:2px;'
];

const _class = {
	base: Dom.addStyle('$attempt', {
		'font-size': 1.5,
		'font-weight': 'bold',
		'position': 'absolute',
		'text-align': 'center',
		'width': '100%'
	})
}


// _generateIndicatorString(iAttempt, iAttempts)
function _generateIndicatorString(iAttempt, iAttempts) {
	let sRet = '';

	for (let i = 1; i <= iAttempts; ++i) {
		sRet += (iAttempt >i ? '\u0398' : '\u039F');
	}

	return sRet;
}


// Create(iAttempts, iIndex)
// Creates a component indicating which attempt out of how many available attempts.
// 		iAttempts	- Number of attempts allowed for the task.
// 		iIndex	- Index of task window indicator is for (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// Returns an object which represents a component.
export default function(iAttempts, iIndex) {
	return {
		dom: null,

		setAttempt(iAttempt) {
			this.dom.innerText = _generateIndicatorString(iAttempt, iAttempts);
		},

		render() {
			let sStyle = iIndex < 2 ? 'top:2px;' : 'bottom:2px;';
			this.dom = Dom.div(_class.base, {style:sStyle}, _generateIndicatorString(1, iAttempts));
			return this.dom;
		},
	}
}