import Audio from './audio'
import Engine from './engine'
import Menu from './components/menu'
import Stage from './components/stage'
import DynamicStyles from './styles'

// localStorage.clear();

// Create the menu and define a callback function which is called when one of the "play" buttons is clicked.
let mMenu = Menu((oSettings) => {
	// The oSettings object contains properties indicating the level (Easy|Hard|Insane) and whether sounds are muted.
	localStorage.setItem('settings', JSON.stringify(oSettings));
	Audio.muted = !oSettings.sound;

	// Remove the menu
	mMenu.remove();
	document.body.removeChild(mMenu.dom);
	mMenu = null;

	// Create the game stage for the specified level and use it to initialize the game engine (which adds the stage to 
	// the dom)
	Engine.init(Stage(oSettings.level));
});

// The mMenu object's render function returns an HTML element which represents the entire menu.
document.body.appendChild(mMenu.render());
