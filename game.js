import { renderStartScreen, renderGameScreen } from './screen.js';

const init = () => {
	let stage = new createjs.Stage('gameCanvas');
	renderStartScreen(stage);
	// renderGameScreen(stage);
};

document.addEventListener('DOMContentLoaded', init);
