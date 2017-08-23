import Engine from '../../engine'
import Dom from '../../dom'
import Tile from '../shape_tile'

const COLORS = ['#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF','#808000','#8000880','#008080','#FF8080'];
const SHAPES = ['gear','octagon','pacman','pentagon','reuleaux','ring','star','starburst','triangleDown','triangleUp'];

const _class = {
	base: Dom.addStyle('$task-memory', {
		'align-items': 'center',
		'display': 'flex',
		'height': '100%',
		'justify-content': 'center',
		'position': 'relative',
		'width': '100%'
	}),
	grid: Dom.addStyle('$memory-grid', {
		'display': 'flex',
		'flex-direction': 'column',
		'height': 30,
		'position': 'relative',
		'width': 30
	}),
	gridCol: Dom.addStyle('$memory-col', {
		// background: '#A0A0A0',
		display: 'flex',
		flex: '1',
		margin: '1px'
	}),
	gridRow: Dom.addStyle('$memory-row', {
		// background: 'blue',
		display: 'flex',
		flex: '1'
	})
};

let _nextLevel = 1;
let _tileSet = [];

COLORS.forEach(sColor => {
	SHAPES.forEach(sShape => {
		_tileSet.push({color:sColor, shape:sShape});
	});
});


// _createTiles(iCount, fSignal)
function _createTiles(iCount, fSignal) {
	let oSame = _tileSet.splice(Engine.randomInt(0, _tileSet.length - 1), 1)[0];
	let aRet = Engine.randomItems(_tileSet, iCount - 2);

	aRet = aRet.concat(oSame, oSame);
	Engine.randomize(aRet);
	
	return aRet.map((oTile, iNdx) => oTile ? Tile(oTile, iNdx, false, fSignal) : '');
}


// Create(iIndex, fSignal)
// Creates a component representing a "Same Tiles" task.
// 		iIndex	- Index of task window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(iIndex, fSignal) {
	let _first;
	let _levelInfo = Engine.getLevelInfo('same', _nextLevel++);
	let _tiles = _createTiles(_levelInfo.size * _levelInfo.size, _handleSignal);

	function _handleSignal(sSignal, oData) {
		if (!_first) {
			_first = oData;
		} else {
			if (oData.shape === _first.shape && oData.color === _first.color) {
				fSignal('solved');
			} else {
				_first = null;
				_tiles[oData.index].show();
				_tiles[_first.index].show();
			}
		}
	}

	return {
		attempt: 1,
		dom: null,
		levelInfo: _levelInfo,

		remove() {
			_tiles.forEach(mTile => {
				if (mTile) {
					mTile.remove();
				}
			});
		},

		render() {
			let iIndex = 0;
			let aRows = [];

			for (let iRow = 0; iRow < _levelInfo.size; ++iRow) {
				let aCols = [];

				for (let iCol = 0; iCol < _levelInfo.size; ++iCol) {
					aCols.push(Dom.div(_class.gridCol, null, _tiles[iIndex++]));
				};

				aRows.push(Dom.div(_class.gridRow, null, aCols));
			}

			this.dom = Dom.div(_class.base, null, Dom.div(_class.grid, null, aRows));

			return this.dom;
		},

		update(iCounter) {

		}
	};
}