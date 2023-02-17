// START SCREEN
export const renderStartScreen = (canvas) => {
	canvas.removeAllChildren();
	canvas.enableMouseOver(10);

	// NOTE: Render on screen load
	// Background
	let startBackground = new createjs.Shape();
	startBackground.graphics.beginFill('#000000').drawRect(0, 0, 960, 640);
	const startBackgroundWidth = startBackground.graphics.command.w;
	const startBackgroundHeight = startBackground.graphics.command.h;

	// Title Text
	let TitleText = new createjs.Text(
		'8 Bit Blackjack',
		'40px Press Start',
		'red'
	);
	TitleText.textAlign = 'center';
	TitleText.textBaseline = 'middle';
	TitleText.x = startBackgroundWidth / 2;
	TitleText.y = startBackgroundHeight / 4;

	// Backcard
	let backCard = new createjs.Bitmap('assets/img/cards/back01.gif');
	backCard.scaleX = 3;
	backCard.scaleY = 3;
	backCard.x = startBackgroundWidth / 2 - (32 * 3) / 2;
	backCard.y = startBackgroundHeight / 1.8 - (48 * 3) / 2;

	// NOTE: Elements to render on start button click
	// Jack of Spades
	let jack = new createjs.Bitmap('assets/img/cards/11s.gif');
	jack.scaleX = 3;
	jack.scaleY = 3;
	jack.x = startBackgroundWidth / 2 - (32 * 3) / 2;
	jack.y = startBackgroundHeight / 1.8 - (48 * 3) / 2;

	// Ace of Spades
	let ace = new createjs.Bitmap('assets/img/cards/01s.gif');
	ace.scaleX = 3;
	ace.scaleY = 3;
	ace.x = startBackgroundWidth / 2 - (32 * 3) / 2 - 40;
	ace.y = startBackgroundHeight / 1.8 - (48 * 3) / 2 + 20;
	ace.rotation = -25;

	// Credit Text
	let creditText = new createjs.Text(
		'CREATED BY CHUCK CHOI',
		'20px Press Start',
		'#ffffff'
	);
	creditText.textAlign = 'center';
	creditText.textBaseline = 'middle';
	creditText.x = startBackgroundWidth / 2;
	creditText.y = startBackgroundHeight / 1.1;
	creditText.alpha = 0;

	// Start Sound
	const startSound = new Audio('assets/audio/gameboy.mp3');
	startSound.volume = 0.5;

	// Start Button
	let startButton = new createjs.Text(
		'START GAME',
		'20px Press Start',
		'red'
	);
	startButton.textAlign = 'center';
	startButton.textBaseline = 'middle';
	startButton.x = startBackgroundWidth / 2;
	startButton.y = startBackgroundHeight / 1.25;
	startButton.addEventListener('mouseover', () => {
		startButton.color = '#ffffff';
		canvas.update();
	});
	startButton.addEventListener('mouseout', () => {
		startButton.color = 'red';
		canvas.update();
	});
	startButton.addEventListener('click', () => {
		startSound.play();

		canvas.addChild(ace, jack);
		canvas.removeChild(startButton);
		canvas.update();

		createjs.Tween.get(creditText).to({ alpha: 1, y: 500 }, 1000);

		const tick = () => {
			canvas.update();
		};

		createjs.Ticker.addEventListener('tick', tick);

		setTimeout(() => {
			renderGameScreen(canvas);
		}, 3000);
	});

	canvas.addChild(
		startBackground,
		backCard,
		creditText,
		TitleText,
		startButton
	);
	canvas.update();
};

// GAME SCREEN
export const renderGameScreen = (canvas) => {
	canvas.enableMouseOver(10);
	canvas.removeAllChildren();

	// Background
	let gameBackground = new createjs.Shape();
	gameBackground.graphics.beginFill('#008000').drawRect(0, 0, 960, 640);

	// shuffle sound when initialized
	const shuffleSound = new Audio('assets/audio/shuffle.mp3');
	shuffleSound.volume = 0.5;
	shuffleSound.currentTime = 1;
	shuffleSound.play();
	shuffleSound.addEventListener('ended', () => {
		// renderGameBoard(canvas);
	});

	canvas.addChild(gameBackground);
	canvas.update();
	renderGameBoard(canvas);
};

const renderGameBoard = (canvas) => {
	// playUI and border
	let playUI = new createjs.Shape();
	playUI.graphics.beginFill('#000000').drawRect(745, 15, 200, 610);
	let playUIBorder = new createjs.Shape();
	playUIBorder.graphics.setStrokeStyle(1).beginStroke('#ffffff');
	playUIBorder.graphics.drawRect(755, 25, 180, 590);

	canvas.addChild(playUI, playUIBorder);
	renderButton(canvas, 'HIT', { x: 760, y: 320, width: 170, height: 50 });
	renderButton(canvas, 'STAND', { x: 760, y: 395, width: 170, height: 50 });
	renderButton(canvas, 'DOUBLE', { x: 760, y: 470, width: 170, height: 50 });
	renderButton(canvas, 'SPLIT', { x: 760, y: 545, width: 170, height: 50 });
	canvas.update();
};

const renderButton = (canvas, text, { x, y, width, height }) => {
	// create button
	let button = new createjs.Shape();
	button.graphics
		.setStrokeStyle(3)
		.beginStroke('#808080')
		.beginFill('#000000')
		.drawRoundRect(x, y, width, height, 10);

	// add text to button
	let buttonText = new createjs.Text(text, '20px Press Start', '#808080');
	buttonText.textAlign = 'center';
	buttonText.textBaseline = 'middle';
	buttonText.x = x + width / 2;
	buttonText.y = y + height / 2;

	// set button cursor style to "pointer" for user feedback
	button.cursor = 'pointer';

	// change button color on mouseover/out
	button.addEventListener('mouseover', () => {
		button.graphics
			.clear()
			.setStrokeStyle(3)
			.beginStroke('#ffffff')
			.beginFill('#000000')
			.drawRoundRect(x, y, width, height, 10);
		buttonText.color = '#ffffff';
		canvas.update();
	});
	button.addEventListener('mouseout', () => {
		button.graphics
			.clear()
			.setStrokeStyle(3)
			.beginStroke('#808080')
			.beginFill('#000000')
			.drawRoundRect(x, y, width, height, 10);
		buttonText.color = '#808080';
		canvas.update();
	});

	// add button to stage
	canvas.addChild(button, buttonText);

	// handle button click event
	button.on('click', function () {
		console.log(text);
	});
};
