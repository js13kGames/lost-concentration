import Dom from '../dom'
import Svg from '../svg'

const HIDE = 'opacity:0;';
const SHOW = 'opacity:.99';


const _class = {
	base: Dom.addStyle('$memory-tile', {
		background: '#A0A0A0',
		flex: '1'
	}),
	shape: Dom.addStyle('memory-tile-shape', {
		background: '#000000',
		height: '100%',
		width: '100%'
	})
}

// Create(oTile, iIndex, fSignal)
// Creates a component ...
// 		oTile		- ...
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(oTile, iIndex, fSignal) {
	let _self, _shape;

	function _handleClick(oEvt) {
		_shape.setAttribute('style', SHOW);
		fSignal('selected', Object.assign({index:iIndex}, oTile));
	}
	
	return {
		dom: null,

		hide() {
			_shape.setAttribute('style', HIDE);
		},

		remove() {
			this.dom.removeEventListener('click', _handleClick);
		},

		render() {
			_self = this;
			_shape = Dom.div(_class.shape, {style:HIDE}, Svg.shape(oTile.shape, oTile.color));

			this.dom = Dom.div(_class.base, {click:_handleClick}, _shape);
			return this.dom;
		},

		// update(iCounter) {

		// }
	}
}