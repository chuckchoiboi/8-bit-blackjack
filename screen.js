import {
	chipImages,
	placeBet,
	doubleDown,
	winBet,
	isBettable,
} from './chip.js';
import { createDeck, shuffleDeck, drawCard, getHandValue } from './deck.js';

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
	let jack = new createjs.Bitmap('assets/img/cards/jack-spades.gif');
	jack.scaleX = 3;
	jack.scaleY = 3;
	jack.x = startBackgroundWidth / 2 - (32 * 3) / 2;
	jack.y = startBackgroundHeight / 1.8 - (48 * 3) / 2;

	// Ace of Spades
	let ace = new createjs.Bitmap('assets/img/cards/ace-spades.gif');
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
	startButton.cursor = 'pointer';
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

	let playerChips = 1000;
	let betAmount = 0;

	// Background
	let gameBackground = new createjs.Shape();
	gameBackground.graphics.beginFill('#008000').drawRect(0, 0, 960, 640);

	// Initial load text
	let text1 = new createjs.Text(
		"Draw cards and beat the dealer's hand",
		'20px Press Start',
		'#ffffff'
	);
	let text2 = new createjs.Text(
		'without going over 21!',
		'20px Press Start',
		'#ffffff'
	);

	// Set the text's position on the stage
	text1.textAlign = 'center';
	text1.textBaseline = 'middle';
	text1.x = 480;
	text1.y = 200;
	text1.alpha = 0;
	text2.textAlign = 'center';
	text2.textBaseline = 'middle';
	text2.x = 480;
	text2.y = 300;
	text2.alpha = 0;

	// Make text1 appear for 4 seconds and remove
	createjs.Tween.get(text1)
		.wait(1000)
		.to({ alpha: 1 }, 0)
		.wait(4000)
		.to({ alpha: 0 }, 0)
		.call(() => {
			canvas.removeChild(text1);
		});

	// Make text2 appear for 3 seconds and remove
	createjs.Tween.get(text2)
		.wait(2000)
		.to({ alpha: 1 }, 0)
		.wait(3000)
		.to({ alpha: 0 }, 0)
		.call(() => {
			canvas.removeChild(text2);
		});

	// Play shuffle sound when initialized
	const shuffleSound = new Audio('assets/audio/shuffle.mp3');
	shuffleSound.volume = 0.5;
	shuffleSound.currentTime = 1;
	shuffleSound.play();

	// Play background music once shuffle is finished
	const backgroundMusic = new Audio('assets/audio/background.mp3');
	backgroundMusic.volume = 0.3;
	backgroundMusic.currentTime = 1;
	backgroundMusic.loop = true;

	shuffleSound.addEventListener('ended', () => {
		// render betting UI
		renderBettingUI(canvas, playerChips, betAmount);
		backgroundMusic.play();
	});

	canvas.addChild(gameBackground, text1, text2);
	canvas.update();
};

const renderBettingUI = (canvas, playerChips, betAmount) => {
	let canvasWidth = 960;
	let canvasHeight = 640;
	let bettingUI = new createjs.Shape();
	bettingUI.graphics
		.beginFill('#000000')
		.drawRect(
			canvasWidth / 4,
			canvasHeight / 4,
			canvasWidth / 2,
			canvasHeight / 2
		);
	// Heading text
	let headingText = new createjs.Text(
		'Place your bet: $0',
		'20px Press Start',
		'#ffffff'
	);
	headingText.textAlign = 'center';
	headingText.x = canvasWidth / 2;
	headingText.y = canvasHeight / 4 + 200;

	// Player chips total
	let chipsTotalText = new createjs.Text(
		`Chips total: $${playerChips}`,
		'20px Press Start',
		'#ffffff'
	);
	chipsTotalText.textAlign = 'center';
	chipsTotalText.x = canvasWidth / 2;
	chipsTotalText.y = canvasHeight / 4 + 40;

	// chips: $5, $10, $25, $100
	const chipSound = new Audio('assets/audio/coins.mp3');
	chipSound.volume = 0.5;

	let chip5 = new createjs.Bitmap(chipImages['5']);
	chip5.x = canvasWidth / 4 + 50;
	chip5.y = canvasHeight / 4 + 90;
	chip5.cursor = 'pointer';
	chip5.addEventListener('click', () => {
		if (playerChips - (betAmount + 5) >= 0) {
			betAmount += 5;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		headingText.text = `Place your bet: $${betAmount}`;
		canvas.update();
	});

	let chip10 = new createjs.Bitmap(chipImages['10']);
	chip10.x = canvasWidth / 4 + 150;
	chip10.y = canvasHeight / 4 + 90;
	chip10.cursor = 'pointer';
	chip10.addEventListener('click', () => {
		if (playerChips - (betAmount + 10) >= 0) {
			betAmount += 10;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		headingText.text = `Place your bet: $${betAmount}`;
		canvas.update();
	});

	let chip25 = new createjs.Bitmap(chipImages['25']);
	chip25.x = canvasWidth / 4 + 250;
	chip25.y = canvasHeight / 4 + 90;
	chip25.cursor = 'pointer';
	chip25.addEventListener('click', () => {
		if (playerChips - (betAmount + 25) >= 0) {
			betAmount += 25;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		headingText.text = `Place your bet: $${betAmount}`;
		canvas.update();
	});

	let chip100 = new createjs.Bitmap(chipImages['100']);
	chip100.x = canvasWidth / 4 + 350;
	chip100.y = canvasHeight / 4 + 90;
	chip100.cursor = 'pointer';
	chip100.addEventListener('click', () => {
		if (playerChips - (betAmount + 100) >= 0) {
			betAmount += 100;
			chipSound.pause();
			chipSound.currentTime = 0;
			chipSound.play();
		}
		headingText.text = `Place your bet: $${betAmount}`;
		canvas.update();
	});

	const cardDropSound = new Audio('assets/audio/cardDrop.mp3');
	cardDropSound.volume = 0.5;

	let bettingButton = new createjs.Shape();
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
		cardDropSound.play();

		if (betAmount > 0) {
			placeBet(betAmount, playerChips);
			canvas.removeChild(
				bettingUI,
				headingText,
				chipsTotalText,
				chip5,
				chip10,
				chip25,
				chip100,
				bettingButton,
				bettingButtonText,
				clearBetButton,
				clearBetButtonText
			);
			renderGame(canvas, playerChips, betAmount);
		}
	});

	let bettingButtonText = new createjs.Text(
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

	let clearBetButton = new createjs.Shape();
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
		betAmount = 0;
		headingText.text = `Place your bet: $${betAmount}`;
		canvas.update();
		cardDropSound.play();
	});

	let clearBetButtonText = new createjs.Text(
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

	canvas.addChild(
		bettingUI,
		headingText,
		chipsTotalText,
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

const renderGame = (canvas, playerChips, betAmount) => {
	const deck = createDeck();
	const playerHand = [];
	const dealerHand = [];

	shuffleDeck(deck);

	playerHand.push(drawCard(deck));
	dealerHand.push(drawCard(deck));
	playerHand.push(drawCard(deck));
	dealerHand.push(drawCard(deck));

	// initial render logic
	const playerCard1 = new createjs.Bitmap(
		`assets/img/cards/${playerHand[0].value}-${playerHand[0].suit}.gif`
	);
	const playerCard2 = new createjs.Bitmap(
		`assets/img/cards/${playerHand[1].value}-${playerHand[1].suit}.gif`
	);
	const dealerCard1 = new createjs.Bitmap(
		`assets/img/cards/${dealerHand[0].value}-${dealerHand[0].suit}.gif`
	);
	const dealerCard2 = new createjs.Bitmap('assets/img/cards/back01.gif');

	const initialRenderStack = [
		playerCard1, // 0, false
		dealerCard1, // 0, true
		playerCard2, // 1, false
		dealerCard2, // 1, true
	];

	for (let i = 0; i < initialRenderStack.length; i++) {
		setTimeout(() => {
			renderCard(
				canvas,
				initialRenderStack[i],
				i <= 1 ? 0 : 1,
				i % 2 !== 0
			);
		}, 1000 * (i + 1));
	}
	setTimeout(() => {
		renderPlayUI(canvas, playerChips, betAmount);
	}, 4500);
};

const renderCard = (canvas, hand, position, isDealer = false) => {
	const cardDropSound = new Audio('assets/audio/cardDrop.mp3');

	hand.x = 50 + 40 * position;
	hand.y = isDealer ? 100 : 400;
	hand.scaleX = 3;
	hand.scaleY = 3;
	cardDropSound.play();
	canvas.addChild(hand);
	canvas.update();
};

const renderPlayUI = (canvas, playerChips, betAmount) => {
	// playUI and border
	let playUI = new createjs.Shape();
	playUI.graphics.beginFill('#000000').drawRect(745, 15, 200, 610);
	let playUIBorder = new createjs.Shape();
	playUIBorder.graphics.setStrokeStyle(2).beginStroke('#ffffff');
	playUIBorder.graphics.drawRect(755, 25, 180, 590);

	// display player chips
	let playerChipsDisplay = new createjs.Text(
		`Chips:\n\n$${playerChips}`,
		'20px Press Start',
		'#ffffff'
	);
	playerChipsDisplay.textAlign = 'center';
	playerChipsDisplay.textBaseline = 'middle';
	playerChipsDisplay.x = 845;
	playerChipsDisplay.y = 80;

	// display bet amount
	let betAmountDisplay = new createjs.Text(
		`Bet:\n\n$${betAmount}`,
		'20px Press Start',
		'#ffffff'
	);
	betAmountDisplay.textAlign = 'center';
	betAmountDisplay.textBaseline = 'middle';
	betAmountDisplay.x = 845;
	betAmountDisplay.y = 220;

	canvas.addChild(playUI, playUIBorder, playerChipsDisplay, betAmountDisplay);
	renderPlayButton(canvas, 'HIT', { x: 760, y: 320, width: 170, height: 50 });
	renderPlayButton(canvas, 'STAND', {
		x: 760,
		y: 395,
		width: 170,
		height: 50,
	});
	renderPlayButton(canvas, 'DOUBLE', {
		x: 760,
		y: 470,
		width: 170,
		height: 50,
	});
	renderPlayButton(canvas, 'SPLIT', {
		x: 760,
		y: 545,
		width: 170,
		height: 50,
	});
	canvas.update();
};

const renderPlayButton = (canvas, text, { x, y, width, height }) => {
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
