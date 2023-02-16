// START SCREEN
export const renderStartScreen = (canvas) => {
	canvas.removeAllChildren();
	canvas.enableMouseOver(50);

	// NOTE: Render on screen load
	// Background
	let startBackground = new createjs.Shape();
	startBackground.graphics.beginFill('black').drawRect(0, 0, 960, 640);
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
		'white'
	);
	creditText.textAlign = 'center';
	creditText.textBaseline = 'middle';
	creditText.x = startBackgroundWidth / 2;
	creditText.y = startBackgroundHeight / 1.1;
	creditText.alpha = 0;

	// Start Sound
	const startSound = new Audio('assets/audio/gameboy.mp3');
	startSound.volume = 0.1;

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
		startButton.color = 'white';
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
const renderGameScreen = (canvas) => {
	canvas.removeAllChildren();

	// Background
	let gameBackground = new createjs.Shape();
	gameBackground.graphics.beginFill('green').drawRect(0, 0, 960, 640);

	// shuffle sound when initialized
	const shuffleSound = new Audio('assets/audio/shuffle.mp3');
	shuffleSound.volume = 0.1;
	shuffleSound.currentTime = 2;
	shuffleSound.play();

	canvas.addChild(gameBackground);
	canvas.update();
};
