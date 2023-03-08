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

	const handleStartButtonToggleWhite = () => {
		startButton.color = '#ffffff';
		game.stage.update();
	};

	const handleStartButtonToggleRed = () => {
		startButton.color = '#ff0000';
		game.stage.update();
	};

	const handleStartButtonClick = () => {
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
	};

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
	startButton.removeEventListener('click', handleStartButtonClick);
	startButton.addEventListener('mouseover', handleStartButtonToggleWhite);
	startButton.addEventListener('mouseout', handleStartButtonToggleRed);
	startButton.addEventListener('click', handleStartButtonClick);

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

	const handleGameStart = () => {
		// render betting UI once the game ends and play music
		game.backgroundMusic = game.assets.getAsset('backgroundMusic');
		game.backgroundMusic.volume = 0.5;
		game.backgroundMusic.play();

		// render betting UI
		game.startGame();
		shuffleSound.removeEventListener('ended', handleGameStart);
	};

	shuffleSound.volume = 0.5;
	shuffleSound.play();
	shuffleSound.addEventListener('ended', handleGameStart);

	container.addChild(gameBackground, startText1, startText2);

	return container;
};

export const renderBettingUI = (game) => {
	const container = game.stage.getChildAt(0);
	const canvasWidth = game.stage.canvas.width;
	const canvasHeight = game.stage.canvas.height;
	const chipSound = game.assets.getAsset('chipSound');
	const cardDropSound = game.assets.getAsset('cardDropSound');

	game.player.betAmount = 0;

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

	const chip5ClickHandler = () => {
		if (game.player.chips - (game.player.betAmount + 5) >= 0) {
			game.player.betAmount += 5;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		bettingUIHeadingText.text = `Place your bet: $${game.player.betAmount}`;
		game.stage.update();
	};

	const chip5 = new createjs.Bitmap(game.assets.getAsset('chip5'));
	chip5.x = canvasWidth / 4 + 50;
	chip5.y = canvasHeight / 4 + 90;
	chip5.cursor = 'pointer';
	chip5.removeEventListener('click', chip5ClickHandler);
	chip5.addEventListener('click', chip5ClickHandler);

	const chip10ClickHandler = () => {
		if (game.player.chips - (game.player.betAmount + 10) >= 0) {
			game.player.betAmount += 10;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		bettingUIHeadingText.text = `Place your bet: $${game.player.betAmount}`;
		game.stage.update();
	};

	const chip10 = new createjs.Bitmap(game.assets.getAsset('chip10'));
	chip10.x = canvasWidth / 4 + 150;
	chip10.y = canvasHeight / 4 + 90;
	chip10.cursor = 'pointer';
	chip10.removeEventListener('click', chip10ClickHandler);
	chip10.addEventListener('click', chip10ClickHandler);

	const chip25ClickHandler = () => {
		if (game.player.chips - (game.player.betAmount + 25) >= 0) {
			game.player.betAmount += 25;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		bettingUIHeadingText.text = `Place your bet: $${game.player.betAmount}`;
		game.stage.update();
	};

	const chip25 = new createjs.Bitmap(game.assets.getAsset('chip25'));
	chip25.x = canvasWidth / 4 + 250;
	chip25.y = canvasHeight / 4 + 90;
	chip25.cursor = 'pointer';
	chip25.removeEventListener('click', chip25ClickHandler);
	chip25.addEventListener('click', chip25ClickHandler);

	const chip100ClickHandler = () => {
		if (game.player.chips - (game.player.betAmount + 100) >= 0) {
			game.player.betAmount += 100;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		bettingUIHeadingText.text = `Place your bet: $${game.player.betAmount}`;
		game.stage.update();
	};
	const chip100 = new createjs.Bitmap(game.assets.getAsset('chip100'));
	chip100.x = canvasWidth / 4 + 350;
	chip100.y = canvasHeight / 4 + 90;
	chip100.cursor = 'pointer';
	chip100.removeEventListener('click', chip100ClickHandler);
	chip100.addEventListener('click', chip100ClickHandler);

	const bettingButtonClickHandler = () => {
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
	};

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
	bettingButton.removeEventListener('click', bettingButtonClickHandler);
	bettingButton.addEventListener('click', bettingButtonClickHandler);

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

	const clearButtonClickHandler = () => {
		game.player.betAmount = 0;
		bettingUIHeadingText.text = `Place your bet: $${game.player.betAmount}`;
		game.stage.update();
		cardDropSound.pause();
		cardDropSound.currentTime = 0;
		cardDropSound.play();
	};

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
	clearBetButton.removeEventListener('click', clearButtonClickHandler);
	clearBetButton.addEventListener('click', clearButtonClickHandler);

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

export const renderPlayUI = (game) => {
	const container = game.stage.getChildAt(0);

	// playUI and border
	const playUI = new createjs.Shape();
	playUI.graphics.beginFill('#000000').drawRect(745, 15, 200, 610);

	const playUIBorder = new createjs.Shape();
	playUIBorder.graphics.setStrokeStyle(2).beginStroke('#ffffff');
	playUIBorder.graphics.drawRect(755, 25, 180, 590);

	// display player chips
	const playerChipsDisplay = new createjs.Text(
		`Chips:\n\n$${game.player.chips}`,
		'20px Press Start',
		'#ffffff'
	);
	playerChipsDisplay.textAlign = 'center';
	playerChipsDisplay.textBaseline = 'middle';
	playerChipsDisplay.x = 845;
	playerChipsDisplay.y = 80;

	// display bet amount
	const betAmountDisplay = new createjs.Text(
		`Bet:\n\n$${game.player.betAmount}`,
		'20px Press Start',
		'#ffffff'
	);
	betAmountDisplay.textAlign = 'center';
	betAmountDisplay.textBaseline = 'middle';
	betAmountDisplay.x = 845;
	betAmountDisplay.y = 220;

	const hitButton = new createjs.Shape();
	const hitButtonText = new createjs.Text('', '20px Press Start', '#808080');
	const standButton = new createjs.Shape();
	const standButtonText = new createjs.Text(
		'',
		'20px Press Start',
		'#808080'
	);
	const doubleButton = new createjs.Shape();
	const doubleButtonText = new createjs.Text(
		'',
		'20px Press Start',
		'#808080'
	);

	container.addChild(
		playUI,
		playUIBorder,
		playerChipsDisplay,
		betAmountDisplay
	);

	const hidePlayUI = () => {
		container.removeChild(
			playUI,
			playUIBorder,
			playerChipsDisplay,
			betAmountDisplay,
			hitButton,
			hitButtonText,
			standButton,
			standButtonText,
			doubleButton,
			doubleButtonText
		);
		game.stage.update();
	};

	const renderPlayButton = (
		button,
		buttonText,
		text,
		{ x, y, width, height },
		buttonAction
	) => {
		// create button
		button.graphics
			.setStrokeStyle(3)
			.beginStroke('#808080')
			.beginFill('#000000')
			.drawRoundRect(x, y, width, height, 10);

		// add text to button
		buttonText.text = text;
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
			game.stage.update();
		});
		button.addEventListener('mouseout', () => {
			button.graphics
				.clear()
				.setStrokeStyle(3)
				.beginStroke('#808080')
				.beginFill('#000000')
				.drawRoundRect(x, y, width, height, 10);
			buttonText.color = '#808080';
			game.stage.update();
		});

		// add button to stage
		container.addChild(button, buttonText);

		// handle button click event
		button.on('click', function () {
			buttonAction();
		});
	};

	// HIT BUTTON
	renderPlayButton(
		hitButton,
		hitButtonText,
		'HIT',
		{ x: 760, y: 395, width: 170, height: 50 },
		() => {
			// If first time hitting, remove double options from the UI
			if (game.player.hand.length === 2) {
				container.removeChild(doubleButton, doubleButtonText);
			}
			hidePlayUI();
			game.hit();
		}
	);

	// STAND BUTTON
	renderPlayButton(
		standButton,
		standButtonText,
		'STAND',
		{
			x: 760,
			y: 470,
			width: 170,
			height: 50,
		},
		() => {
			hidePlayUI();
			game.stand();
		}
	);

	// DOULBLE BUTTON
	renderPlayButton(
		doubleButton,
		doubleButtonText,
		'DOUBLE',
		{
			x: 760,
			y: 545,
			width: 170,
			height: 50,
		},
		() => {
			console.log(game.player.betAmount);
			if (game.player.chips - game.player.betAmount >= 0) {
				hidePlayUI();
				// check if there's enough chips
				game.player.chips -= game.player.betAmount;
				game.player.betAmount *= 2;
				playerChipsDisplay.text = `Chips:\n\n$${game.player.chips}`;
				betAmountDisplay.text = `Bet:\n\n$${game.player.betAmount}`;
				game.double();
			}
		}
	);
	game.stage.update();
};
