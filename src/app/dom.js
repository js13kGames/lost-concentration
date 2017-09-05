let _dynamicSelectors = {};
let _nextId = 0;


// _addContent(dParent, vContent)
function _addContent(dParent, vContent) {
	let dNode;

	if (vContent instanceof Element) {
		dNode = vContent;
	} else if (Array.isArray(vContent)) {
		vContent.forEach(vItem => _addContent(dParent, vItem));
	} else if (typeof vContent === 'object' && vContent.render) {
		dNode = vContent.render();
	} else {
		dNode = document.createTextNode(vContent);
	}

	if (dNode) {
		dParent.appendChild(dNode);
	}
}


export default {
	// UNIT
	// Contains the unit of measurement for all game components. Either 'vh' or 'vw' depending on the height to width 
	// ratio of the document. The smaller of the two units is always used.
	UNIT: document.body.clientHeight <= document.body.clientWidth ? 'vh' : 'vw',


	// addStyle(sSelector, vRules[, oPseudo])
	// Adds a new style rule to a global css stylesheet.
	// 		sSelector	- Selector for the new rule (e.g. '.my-class'). If first character is a dollar sign ($), a new class 
	// 								selector is generated using the pattern "d{index}" where index is a value which starts at 1 and is 
	// 								incremented every time a new selector is generated. This allows the system to generate short class 
	// 								names which are guaranteed to be unique.
	// 		vRules		- Object or string with rules for the style. See the resolveStyles() method for more info.
	// 		oPseudo		- [null] Additional generic object for defining pseudo classes for the class. The object's keys are 
	// 								the pseudo class names and the values are the rules.
	// Returns the selector used for the new rule which may be different from the one supplied (if $ prepended).
	addStyle(sSelector, vRules, oPseudo) {
		let sRet = sSelector;
		let bScoped = (sRet.charAt(0) === '$');
		let dStyle = document.getElementById('dynamicStylesheet');
		let sRules = typeof vRules === 'string' ? vRules : this.resolveStyles(vRules);

		if (bScoped) {
			sSelector = '.' + sSelector.substr(1);
			sRet = _dynamicSelectors[sSelector];
			if (!sRet) {
				sRet = _dynamicSelectors[sSelector] = `.d${++_nextId}`;
			}
		}

		if (!dStyle) {
			dStyle = document.createElement('style');
			dStyle.id = 'dynamicStylesheet';
			dStyle.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(dStyle);
		}

		if (!(dStyle.sheet || {}).insertRule) {
			(dStyle.styleSheet || dStyle.sheet).addRule(sRet, sRules);
		} else {
			dStyle.sheet.insertRule(`${sRet}{${sRules}}`, 0);
		}

		if (oPseudo) {
			Object.keys(oPseudo).forEach(sKey => {
				this.addStyle(sRet + sKey, oPseudo[sKey]);
			});
		}

		return bScoped ? sRet.substr(1) : sRet;
	},


	// addStyles(oStyles)
	// Adds multiple style rules in one call. See the .addStyle() method for more info.
	// 		oStyles	- Generic object where each key is used as a selector and the associated value is the rule.
	addStyles(oStyles) {
		Object.keys(oStyles).forEach(sSel => this.addStyle(sSel, oStyles[sSel]));
	},


	// button(vClass, oAttr, vContent[, iIndex])
	// Creates an HTML button element.
	// 		vClass		- Class or classes which are added to the new element. See .createElement() for more info.
	// 		oAttr			- Generic object defining attributes for the element. See .createElement() for more info.
	// 		vContent	- String with text for the button or an array of strings to automatically create a button which 
	// 								toggles state between the items provided when clicked.
	// 		iIndex		- [0] If an array is provided for the vContent argument, this is the index of the first string to 
	// 								display as the label of the button.
	// Returns the newly created element.
	button(vClass, oAttr, vContent, iIndex = 0) {
		let bArray = Array.isArray(vContent);
		let sLabel = bArray ? vContent[iIndex] : vContent;

		oAttr = oAttr || {};

		if (bArray) {
			oAttr.click = function(oEvt) {
				oEvt.target.innerText = vContent[++iIndex % vContent.length];
			}
		}

		return this.createElement('button', vClass, oAttr, sLabel);
	},


	// createElement(sTag[, vClass[, oAttr[, vContent]]])
	// Creates a new dom element.
	// 		sTag			- Tag for type of element to create (e.g. 'div', 'h1', etc).
	// 		vClass		- [null] Class or classes which are added to the new element.
	// 									Array		- Each array item is treated as a string with the name of a class and all are added.
	// 									Object	- The value for each key is added as the name of a class. This is intended for use with 
	// 														objects with values returned by the .addStyle() method.
	// 									other		- Treated as a string and added as the name of a class.
	// 		oAttr			- [null] Generic object where key/value pairs are are added to the new element using the 
	// 								Element.setAttribute() method. Any key whose value is a function is treated as an event and is 
	// 								added using the Element.addEventListener() method.
	// 		vContent	- [null] Content which is added to the element using the Element.appendChild() method.
	// 									Array		- All items are appended to the element in the order they appear in the array.
	// 									Element	- DOM elements are simply appended as is.
	// 									Object	- Objects must have a render() method which returns a DOM element. The element returned 
	// 														is then appended.
	// 									other		- Any other value is used to create a text node which is then appended.
	// Returns the newly created element.
	createElement(sTag, vClass, oAttr, vContent) {
		let dRet = document.createElement(sTag);

		if (vClass) {
			let aClasses = Array.isArray(vClass) ? vClass : (typeof vClass === 'object' ? Object.values(vClass) : [vClass]);
			aClasses.forEach(sClass => dRet.classList.add(sClass));
		}

		if (oAttr) {
			Object.keys(oAttr).forEach(sKey => {
				let vVal = oAttr[sKey];
				let sType = typeof vVal;

				if (sType === 'function') {
					dRet.addEventListener(sKey, vVal);
				} else {
					dRet.setAttribute(sKey, oAttr[sKey]);
				}
			});
		}

		if (vContent !== undefined) {
			_addContent(dRet, vContent);
		}

		return dRet;
	},


	// div([vClass[, oAttr[, vContent]]])
	// Shortcut for creating a 'div' element. See .createElement() for details.
	div(vClass, oAttr, vContent) {
		return this.createElement('div', vClass, oAttr, vContent);
	},


	// li([vClass[, oAttr[, vContent]]])
	// Shortcut for creating a 'li' element. See .createElement() for details.
	li(vClass, oAttr, vContent) {
		return this.createElement('li', vClass, oAttr, vContent);
	},


	// ul()
	// Creates an HTML UL element.
	// 		vClass	- Class or classes which are added to the new element. See .createElement() for more info.
	// 		oAttr		- Generic object defining attributes for the element. See .createElement() for more info.
	// 		aItems	- Array of strings used to create LI elements inside the UL element.
	// Returns the newly created element.
	ul(vClass, oAttr, aItems) {
		return this.createElement('ul', vClass, oAttr, aItems.map(sItem => this.li(null, null, sItem)));
	},


	// resolveStyles(oStyles[, oAddl])
	// Resolve styles which rely on units which are not known until game is launched.
	// 		oStyles	- Generic object where keys are the names of styles and values which need to be resolved. All numeric 
	// 							values are converted to strings with "vh" or "vw" appended to them. For string values, the system 
	// 							checks if the string is the name of a key on the oAddl argument and uses the value of the key if it 
	// 							is. Otherwise, the string is used as the value for the style. Any equal signs (=) in a string are 
	// 							also replaced by "vh" or "vw" so strings like "10= solid black" are resolved to "10vh solid black".
	// 							You can also mark a rule as important by prepending an exclamation mark (!) to the key. This will 
	// 							append the string "!important" to the rule value.
	// 							NOTE: Numeric values which should not have the default unit appended to them must be passed as 
	// 							strings instead.
	// 		oAddl		- [null] Generic object which can be used to provide additional values which must be set at run-time 
	// 							but which do not rely on "vh/vw" units. An example would be something which might be aligned to the 
	// 							left or right depending on other factors.
	// Returns a semi-colon (;) delimited string suitable for use as an HTML element's style attribute (e.g. 
	// "left:10vh;top:5vh;").
	resolveStyles(oStyles, oAddl = {}) {
		let sRet = '';

		Object.keys(oStyles).forEach(sKey => {
			let sImp, sVal;
			let vVal = oStyles[sKey];

			if (sKey[0] === '!') {
				sKey = sKey.substr(1);
				sImp = ' !important'
			} else {
				sImp = '';
			}

			if (typeof vVal === 'number') {
				sVal = vVal + this.UNIT;
			} else if (oAddl.hasOwnProperty(vVal)) {
				sVal = oAddl[vVal];
			} else if (vVal.indexOf('=') >= 0) {
				sVal = vVal.replace(/=/g, this.UNIT);
			} else {
				sVal = vVal;
			}

			sRet += `${sKey}:${sVal}${sImp};`;
		});

		return sRet;
	},


	// span([vClass[, oAttr[, vContent]]])
	// Shortcut for creating a 'span' element. See .createElement() for details.
	span(vClass, oAttr, vContent) {
		return this.createElement('span', vClass, oAttr, vContent);
	}


}