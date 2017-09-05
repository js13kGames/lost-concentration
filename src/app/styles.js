// Creates a number of dynamic styles which cannot be determined until runtime because they rely on size or positions 
// which are dependent on the height to width ratio of the document body.
// Positions and sizes use the smaller of 'vh' or 'vw'.

import Dom from './dom'

Dom.addStyles({
	'button': {'font-size':2, 'margin-top':1},
	'h3': {'font-size':1.9, 'margin-top':1, 'margin-bottom':1},
	'li': {'padding-bottom':.3},
	'ul': {'font-size':1.9, 'margin-bottom':.3, 'margin-top':.5, 'padding-right':'10px'},

	'.tutorial': {background:'#B8860B', 
			'box-shadow':'2px 2px 4px black', color:'#FFFFFF', position:'absolute', width:50, 'z-index':'9999'},

	'.window-inactive': {
		background: '#000000',
		height: '100%',
		left: '0',
		opacity: '0.65',
		position: 'absolute',
		top: '0',
		transition: 'opacity .6s ease-out',
		width: '100%'
	}
})
