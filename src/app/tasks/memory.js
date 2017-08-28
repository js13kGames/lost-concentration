import Dom from '../dom'
import Engine from '../engine'
import Tile from '../components/shape_tile'

const HIDE_TIME = 60;
const REMOVE_TIME = 20;

const COLORS = ['#0000FF', '#FFA080', '#FF0000', '#C000FF'];
const SHAPES = ['gear', 'pacman', 'ring', 'star', 'triangleUp'];

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

let _tileSet = [];

COLORS.forEach(sColor => {
	SHAPES.forEach(sShape => {
		_tileSet.push({color:sColor, shape:sShape});
	});
});


// _createTiles(iCount, fSignal)
function _createTiles(iCount, fSignal) {
	let iMax = Math.floor(iCount / 2)
	let aRet = Engine.randomItems(_tileSet, iMax);

	aRet = aRet.concat(aRet);
	Engine.randomize(aRet);
	
	if (iCount / 2 !== iMax) {
		aRet = [].concat(aRet.slice(0, iMax), null, aRet.slice(iMax));
	}

	return aRet.map((oTile, iNdx) => oTile ? Tile(oTile, iNdx, true, fSignal) : '');
}


// Create(iIndex, fSignal)
// Creates a component representing a "Memory" task.
// 		iIndex	- Index of task window (0:TopLeft, 1:TopRight, 2:BottomRight, 3:BottomLeft).
// 		fSignal	- Callback function for passing information back to parent.
// Returns an object which represents a component.
export default function(iIndex, fSignal) {
	let _hideTime, _levelInfo, _tiles;
	let _selections = [];
	let _hide = [];
	let _remove = [];
	let _found = 0;

	_levelInfo = Engine.getLevelInfo('memory');
	_tiles = _createTiles(_levelInfo.cols * _levelInfo.rows, _handleSignal);

	function _handleSignal(sSignal, oData) {
		_selections.push(oData)

		if (_selections.length === 2) {
			if (_selections[0].index === _selections[1].index) {
				_selections.pop();
			} else {
				if (_selections[0].shape === _selections[1].shape && _selections[0].color === _selections[1].color) {
					_selections[0].time = Engine.getCounter() + REMOVE_TIME;
					_remove = _remove.concat(_selections)
					if (++_found === Math.floor(_levelInfo.cols * _levelInfo.rows / 2)) {
						fSignal('solved');
					}
				} else {
					_hideTime = Engine.getCounter() + HIDE_TIME;
					_hide = _hide.concat(_selections);
				}
			}

			_selections = [];
		}
	}

	function _removeTile(oTile) {
		let mTile = _tiles[oTile.index];

		mTile.remove();
		mTile.dom.parentElement.removeChild(mTile.dom);
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

			for (let iRow = 0; iRow < _levelInfo.rows; ++iRow) {
				let aCols = [];

				for (let iCol = 0; iCol < _levelInfo.cols; ++iCol) {
					aCols.push(Dom.div(_class.gridCol, null, _tiles[iIndex++]));
				};

				aRows.push(Dom.div(_class.gridRow, null, aCols));
			}

			this.dom = Dom.div(_class.base, null, Dom.div(_class.grid, null, aRows));

			return this.dom;
		},

		update(iCounter) {
			if (_hide.length > 0 && iCounter >= _hideTime) {
				_tiles[_hide.shift().index].hide();
				_tiles[_hide.shift().index].hide();
			}

			if (_remove.length > 0) {
				if (iCounter >= _remove[0].time) {
					_removeTile(_remove.shift());
					_removeTile(_remove.shift());
				}
			}
		}
	};
}