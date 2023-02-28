export const getStartScreen = (game) => {
	const container = new createjs.Container();

	// Background
	const startBackground = new createjs.Shape();
	startBackground.graphics.beginFill('#000000').drawRect(0, 0, 960, 640);
	const startBackgroundWidth = startBackground.graphics.command.w;
	const startBackgroundHeight = startBackground.graphics.command.h;

	// Title Text
	const titleText = new createjs.Text(
		'8 Bit Blackjack',
		'40px Press Start',
		'#FF0000'
	);
	titleText.textAlign = 'center';
	titleText.textBaseline = 'middle';
	titleText.x = startBackgroundWidth / 2;
	titleText.y = startBackgroundHeight / 4;

	// Backcard
	const backCard = new createjs.Bitmap('assets/img/cards/back01.gif');
	backCard.scaleX = 3;
	backCard.scaleY = 3;
	backCard.x = startBackgroundWidth / 2 - (32 * 3) / 2;
	backCard.y = startBackgroundHeight / 1.8 - (48 * 3) / 2;

	// NOTE: Elements to render on start button click
	// Jack of Spades
	const jack = new createjs.Bitmap('assets/img/cards/J-spades.gif');
	jack.scaleX = 3;
	jack.scaleY = 3;
	jack.x = startBackgroundWidth / 2 - (32 * 3) / 2;
	jack.y = startBackgroundHeight / 1.8 - (48 * 3) / 2;

	// Ace of Spades
	const ace = new createjs.Bitmap('assets/img/cards/A-spades.gif');
	ace.scaleX = 3;
	ace.scaleY = 3;
	ace.x = startBackgroundWidth / 2 - (32 * 3) / 2 - 40;
	ace.y = startBackgroundHeight / 1.8 - (48 * 3) / 2 + 20;
	ace.rotation = -25;

	// Credit Text
	const creditText = new createjs.Text(
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
	const startButton = new createjs.Text(
		'START GAME',
		'20px Press Start',
		'#FF0000'
	);
	startButton.textAlign = 'center';
	startButton.textBaseline = 'middle';
	startButton.x = startBackgroundWidth / 2;
	startButton.y = startBackgroundHeight / 1.25;
	startButton.cursor = 'pointer';
	startButton.addEventListener('mouseover', () => {
		startButton.color = '#ffffff';
		game.stage.update();
	});
	startButton.addEventListener('mouseout', () => {
		startButton.color = '#FF0000';
		game.stage.update();
	});
	startButton.addEventListener('click', () => {
		startSound.play();

		container.addChild(ace, jack);
		container.removeChild(startButton);
		game.stage.update();

		createjs.Tween.get(creditText).to({ alpha: 1, y: 500 }, 1000);

		const tick = () => {
			game.stage.update();
		};

		createjs.Ticker.addEventListener('tick', tick);

		setTimeout(() => {
			renderGameScreen(canvas);
		}, 3000);
	});

	container.addChild(
		startBackground,
		backCard,
		creditText,
		titleText,
		startButton
	);

	return container;
};
