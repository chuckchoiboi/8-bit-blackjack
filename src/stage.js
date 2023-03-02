export const getStartScreen = (game) => {
	const container = new createjs.Container();

	// Background
	const startBackground = new createjs.Shape();
	startBackground.graphics.beginFill('#000000').drawRect(0, 0, 960, 640);
	const canvasWidth = game.stage.canvas.width;
	const canvasHeight = game.stage.canvas.height;

	// Title Text
	const titleText = new createjs.Text(
		'8 Bit Blackjack',
		'40px Press Start',
		'#FF0000'
	);
	titleText.textAlign = 'center';
	titleText.textBaseline = 'middle';
	titleText.x = canvasWidth / 2;
	titleText.y = canvasHeight / 4;

	// Backcard
	const backCard = new createjs.Bitmap(game.assets.getAsset('backCard'));
	backCard.scaleX = 3;
	backCard.scaleY = 3;
	backCard.x = canvasWidth / 2 - (32 * 3) / 2;
	backCard.y = canvasHeight / 1.8 - (48 * 3) / 2;

	// NOTE: Elements to render on start button click
	// Jack of Spades
	const jack = new createjs.Bitmap(game.assets.getAsset('J-spades'));
	jack.scaleX = 3;
	jack.scaleY = 3;
	jack.x = canvasWidth / 2 - (32 * 3) / 2;
	jack.y = canvasHeight / 1.8 - (48 * 3) / 2;

	// Ace of Spades
	const ace = new createjs.Bitmap(game.assets.getAsset('A-spades'));
	ace.scaleX = 3;
	ace.scaleY = 3;
	ace.x = canvasWidth / 2 - (32 * 3) / 2 - 40;
	ace.y = canvasHeight / 1.8 - (48 * 3) / 2 + 20;
	ace.rotation = -25;

	// Credit Text
	const creditText = new createjs.Text(
		'CREATED BY CHUCK CHOI',
		'20px Press Start',
		'#ffffff'
	);
	creditText.textAlign = 'center';
	creditText.textBaseline = 'middle';
	creditText.x = canvasWidth / 2;
	creditText.y = canvasHeight / 1.1;
	creditText.alpha = 0;

	// Start Sound
	const startSound = game.assets.getAsset('startSound');
	startSound.volume = 0.5;

	// Start Button
	const startButton = new createjs.Text(
		'START GAME',
		'20px Press Start',
		'#FF0000'
	);
	startButton.textAlign = 'center';
	startButton.textBaseline = 'middle';
	startButton.x = canvasWidth / 2;
	startButton.y = canvasHeight / 1.25;
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
			container.removeAllChildren();
			game.loadGameScreen();
		}, 3000);
	});

	// start button hit area
	const startButtonHitArea = new createjs.Shape();
	startButtonHitArea.graphics
		.beginFill('#000000')
		.drawRect(
			-startButton.getMeasuredWidth() / 2,
			-startButton.getMeasuredHeight() / 2,
			startButton.getMeasuredWidth(),
			startButton.getMeasuredHeight()
		);

	startButton.hitArea = startButtonHitArea;

	container.addChild(
		startBackground,
		backCard,
		creditText,
		titleText,
		startButton
	);

	return container;
};

export const getGameScreen = (game) => {
	const container = game.stage.getChildAt(0);

	const gameBackground = new createjs.Shape();
	gameBackground.graphics.beginFill('#008000').drawRect(0, 0, 960, 640);

	// Initial load text
	const startText1 = new createjs.Text(
		"Draw cards and beat the dealer's hand",
		'20px Press Start',
		'#ffffff'
	);
	startText1.textAlign = 'center';
	startText1.textBaseline = 'middle';
	startText1.x = 480;
	startText1.y = 200;
	startText1.alpha = 0;

	const startText2 = new createjs.Text(
		'without going over 21!',
		'20px Press Start',
		'#ffffff'
	);
	startText2.textAlign = 'center';
	startText2.textBaseline = 'middle';
	startText2.x = 480;
	startText2.y = 300;
	startText2.alpha = 0;

	// Make text1 appear for 4 seconds and remove
	createjs.Tween.get(startText1)
		.wait(1000)
		.to({ alpha: 1 }, 0)
		.wait(4000)
		.to({ alpha: 0 }, 0)
		.call(() => {
			container.removeChild(startText1);
		});

	// Make text2 appear for 3 seconds and remove
	createjs.Tween.get(startText2)
		.wait(2000)
		.to({ alpha: 1 }, 0)
		.wait(3000)
		.to({ alpha: 0 }, 0)
		.call(() => {
			container.removeChild(startText2);
		});

	// Play shuffle Sound
	const shuffleSound = game.assets.getAsset('shuffleSound');
	shuffleSound.volume = 0.5;
	shuffleSound.play();

	shuffleSound.addEventListener('ended', () => {
		// render betting UI once the game ends and play music
		const backgroundMusic = game.assets.getAsset('backgroundMusic');
		backgroundMusic.volume = 0.5;
		backgroundMusic.play();

		// render betting UI
		game.startGame();
	});

	container.addChild(gameBackground, startText1, startText2);

	return container;
};

export const renderBettingUI = (game) => {
	const container = game.stage.getChildAt(0);
	const canvasWidth = game.stage.canvas.width;
	const canvasHeight = game.stage.canvas.height;
	const chipSound = game.assets.getAsset('chipSound');
	const cardDropSound = game.assets.getAsset('cardDropSound');

	// betting UI variables
	const bettingUI = new createjs.Shape();
	bettingUI.graphics
		.beginFill('#000000')
		.drawRect(
			canvasWidth / 4,
			canvasHeight / 4,
			canvasWidth / 2,
			canvasHeight / 2
		);

	// Heading text
	const bettingUIHeadingText = new createjs.Text(
		'Place your bet: $0',
		'20px Press Start',
		'#ffffff'
	);
	bettingUIHeadingText.textAlign = 'center';
	bettingUIHeadingText.x = canvasWidth / 2;
	bettingUIHeadingText.y = canvasHeight / 4 + 200;

	// Player chips total
	const bettingUIChipsTotalText = new createjs.Text(
		`Chips total: $${game.player.chips}`,
		'20px Press Start',
		'#ffffff'
	);
	bettingUIChipsTotalText.textAlign = 'center';
	bettingUIChipsTotalText.x = canvasWidth / 2;
	bettingUIChipsTotalText.y = canvasHeight / 4 + 40;

	const chip5 = new createjs.Bitmap(game.assets.getAsset('chip5'));
	chip5.x = canvasWidth / 4 + 50;
	chip5.y = canvasHeight / 4 + 90;
	chip5.cursor = 'pointer';
	chip5.addEventListener('click', () => {
		if (game.player.chips - (game.player.betAmount + 5) >= 0) {
			game.player.betAmount += 5;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		bettingUIHeadingText.text = `Place your bet: $${game.player.betAmount}`;
		game.stage.update();
	});

	const chip10 = new createjs.Bitmap(game.assets.getAsset('chip10'));
	chip10.x = canvasWidth / 4 + 150;
	chip10.y = canvasHeight / 4 + 90;
	chip10.cursor = 'pointer';
	chip10.addEventListener('click', () => {
		if (game.player.chips - (game.player.betAmount + 10) >= 0) {
			game.player.betAmount += 10;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		bettingUIHeadingText.text = `Place your bet: $${game.player.betAmount}`;
		game.stage.update();
	});

	const chip25 = new createjs.Bitmap(game.assets.getAsset('chip25'));
	chip25.x = canvasWidth / 4 + 250;
	chip25.y = canvasHeight / 4 + 90;
	chip25.cursor = 'pointer';
	chip25.addEventListener('click', () => {
		if (game.player.chips - (game.player.betAmount + 25) >= 0) {
			game.player.betAmount += 25;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		bettingUIHeadingText.text = `Place your bet: $${game.player.betAmount}`;
		game.stage.update();
	});

	const chip100 = new createjs.Bitmap(game.assets.getAsset('chip100'));
	chip100.x = canvasWidth / 4 + 350;
	chip100.y = canvasHeight / 4 + 90;
	chip100.cursor = 'pointer';
	chip100.addEventListener('click', () => {
		if (game.player.chips - (game.player.betAmount + 100) >= 0) {
			game.player.betAmount += 100;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		bettingUIHeadingText.text = `Place your bet: $${game.player.betAmount}`;
		game.stage.update();
	});

	const bettingButton = new createjs.Shape();
	bettingButton.graphics
		.beginFill('#000000')
		.beginStroke('#ffffff')
		.drawRect(
			canvasWidth / 4 + 20,
			(canvasHeight * 3) / 4 - 60,
			canvasWidth / 4 - 30,
			50
		);

	bettingButton.cursor = 'pointer';
	bettingButton.addEventListener('click', () => {
		cardDropSound.pause();
		cardDropSound.currentTime = 0;
		cardDropSound.play();

		if (game.player.betAmount > 0) {
			game.player.chips -= game.player.betAmount;
			container.removeChild(
				bettingUI,
				bettingUIHeadingText,
				bettingUIChipsTotalText,
				chip5,
				chip10,
				chip25,
				chip100,
				bettingButton,
				bettingButtonText,
				clearBetButton,
				clearBetButtonText
			);
			game.deal();
		}
	});

	const bettingButtonText = new createjs.Text(
		'Bet',
		'20px Press Start',
		'#ffffff'
	);
	bettingButtonText.textAlign = 'center';
	bettingButtonText.textBaseline = 'middle';
	bettingButtonText.x =
		bettingButton.graphics.command.x + bettingButton.graphics.command.w / 2;
	bettingButtonText.y =
		bettingButton.graphics.command.y + bettingButton.graphics.command.h / 2;

	const clearBetButton = new createjs.Shape();
	clearBetButton.graphics
		.beginFill('#000000')
		.beginStroke('#ffffff')
		.drawRect(
			canvasWidth / 2 + 10,
			(canvasHeight * 3) / 4 - 60,
			canvasWidth / 4 - 30,
			50
		);
	clearBetButton.cursor = 'pointer';
	clearBetButton.addEventListener('click', () => {
		game.player.betAmount = 0;
		bettingUIHeadingText.text = `Place your bet: $${game.player.betAmount}`;
		game.stage.update();
		cardDropSound.pause();
		cardDropSound.currentTime = 0;
		cardDropSound.play();
	});

	const clearBetButtonText = new createjs.Text(
		'Clear Bet',
		'20px Press Start',
		'#ffffff'
	);
	clearBetButtonText.textAlign = 'center';
	clearBetButtonText.textBaseline = 'middle';
	clearBetButtonText.x =
		clearBetButton.graphics.command.x +
		clearBetButton.graphics.command.w / 2;
	clearBetButtonText.y =
		clearBetButton.graphics.command.y +
		clearBetButton.graphics.command.h / 2;

	container.addChild(
		bettingUI,
		bettingUIHeadingText,
		bettingUIChipsTotalText,
		chip5,
		chip10,
		chip25,
		chip100,
		bettingButton,
		bettingButtonText,
		clearBetButton,
		clearBetButtonText
	);
};
