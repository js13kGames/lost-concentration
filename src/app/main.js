import Audio from './audio'
import Engine from './engine'
import Menu from './components/menu'
import Stage from './components/stage'
import DynamicStyles from './styles'
import Tutorial from './components/tutorial'

// localStorage.clear();

let mMenu = Menu((oSettings) => {
	localStorage.setItem('settings', JSON.stringify(oSettings));
console.dir(oSettings);
	Audio.muted = !oSettings.sound;

	mMenu.remove();
	document.body.removeChild(mMenu.dom);
	mMenu = null;
	Engine.init(Stage());
});

document.body.appendChild(mMenu.render());
