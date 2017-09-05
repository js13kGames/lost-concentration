import Dom from '../dom'
import Svg from '../svg'

const HIDE = 'opacity:0;';
const SHOW = 'opacity:.99';
const HIGHLIGHT = 'background:#FFFFFF;';


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

// Create(oTile, iIndex, bToggle, fSignal)
// Creates a component which displays a tile with a colored shape.
// 		oTile		- Object with color and shape properties for tile.
// 		iIndex	- Index of tile within enclosing puzzle.
// 		bToggle	- Tiles toggle when clicked (for memory task).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(oTile, iIndex, bToggle, fSignal) {
	let _self, _shape;

	function _handleClick(oEvt) {
		if (bToggle) {
			_shape.setAttribute('style', SHOW);
		} else {
			_shape.setAttribute('style', HIGHLIGHT);
		}

		if (fSignal) {
			fSignal('selected', Object.assign({index:iIndex}, oTile));
		}
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
			_shape = Dom.div(_class.shape, {style:bToggle ? HIDE : SHOW}, Svg.shape(oTile.shape, oTile.color));

			this.dom = Dom.div(_class.base, {click:_handleClick}, _shape);
			return this.dom;
		},

		show() {
			_shape.setAttribute('style', SHOW);
		}

	}
}