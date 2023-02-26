import { chipImages } from './chip.js';
import {
	createDeck,
	shuffleDeck,
	drawCard,
	getHandValue,
	getCardValue,
	checkAce,
} from './deck.js';

// background
let gameBackground;
let startBackground;
let playerChips = 1000;
let betAmount = 0;
let canvasWidth = 960;
let canvasHeight = 640;

// betting UI variables
let bettingUI;
let bettingUIHeadingText;
let bettingUIChipsTotalText;

// game UI variables
let dealerHandTotal = 0;
let playerHandTotal = 0;
let dealerHandTotalText = new createjs.Text(
	'Dealer Total:',
	'20px Press Start',
	'#ffffff'
);
let playerHandTotalText = new createjs.Text(
	'Player Total:',
	'20px Press Start',
	'#ffffff'
);
dealerHandTotalText.x = 50;
dealerHandTotalText.y = 60;
playerHandTotalText.x = 50;
playerHandTotalText.y = 360;

// play UI variables
let playUI;
let playUIBorder;
let playerChipsDisplay;
let betAmountDisplay;
let hitButton = new createjs.Shape();
let hitButtonText = new createjs.Text('', '20px Press Start', '#808080');
let standButton = new createjs.Shape();
let standButtonText = new createjs.Text('', '20px Press Start', '#808080');
let doubleButton = new createjs.Shape();
let doubleButtonText = new createjs.Text('', '20px Press Start', '#808080');

// game initial state
const deck = [];
const playerHand = [];
const dealerHand = [];

// Background Music
const backgroundMusic = new Audio('assets/audio/background.mp3');
backgroundMusic.volume = 0.3;
backgroundMusic.currentTime = 1;
backgroundMusic.loop = true;

// Shuffle Sound
const shuffleSound = new Audio('assets/audio/shuffle.mp3');
shuffleSound.volume = 0.5;
shuffleSound.currentTime = 1;

// Card Drop Sound
const cardDropSound = new Audio('assets/audio/cardDrop.mp3');
cardDropSound.volume = 0.5;

// chips sound
const chipSound = new Audio('assets/audio/coins.mp3');
chipSound.volume = 0.5;

// START SCREEN
export const renderStartScreen = (canvas) => {
	canvas.removeAllChildren();
	canvas.enableMouseOver(10);

	// NOTE: Render on screen load
	// Background
	startBackground = new createjs.Shape();
	startBackground.graphics.beginFill('#000000').drawRect(0, 0, 960, 640);
	const startBackgroundWidth = startBackground.graphics.command.w;
	const startBackgroundHeight = startBackground.graphics.command.h;

	// Title Text
	let titleText = new createjs.Text(
		'8 Bit Blackjack',
		'40px Press Start',
		'red'
	);
	titleText.textAlign = 'center';
	titleText.textBaseline = 'middle';
	titleText.x = startBackgroundWidth / 2;
	titleText.y = startBackgroundHeight / 4;

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
		titleText,
		startButton
	);
	canvas.update();
};

// GAME SCREEN
export const renderGameScreen = (canvas) => {
	canvas.enableMouseOver(10);
	canvas.removeAllChildren();

	gameBackground = new createjs.Shape();
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

	// play shuffle sound when game starts
	shuffleSound.play();

	shuffleSound.addEventListener('ended', () => {
		// render betting UI once the game ends and play music
		renderBettingUI(canvas);
		backgroundMusic.play();
	});

	canvas.addChild(gameBackground, text1, text2);
	canvas.update();
};

const renderBettingUI = (canvas) => {
	bettingUI = new createjs.Shape();
	bettingUI.graphics
		.beginFill('#000000')
		.drawRect(
			canvasWidth / 4,
			canvasHeight / 4,
			canvasWidth / 2,
			canvasHeight / 2
		);
	// Heading text
	bettingUIHeadingText = new createjs.Text(
		'Place your bet: $0',
		'20px Press Start',
		'#ffffff'
	);
	bettingUIHeadingText.textAlign = 'center';
	bettingUIHeadingText.x = canvasWidth / 2;
	bettingUIHeadingText.y = canvasHeight / 4 + 200;

	// Player chips total
	bettingUIChipsTotalText = new createjs.Text(
		`Chips total: $${playerChips}`,
		'20px Press Start',
		'#ffffff'
	);
	bettingUIChipsTotalText.textAlign = 'center';
	bettingUIChipsTotalText.x = canvasWidth / 2;
	bettingUIChipsTotalText.y = canvasHeight / 4 + 40;

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
		bettingUIHeadingText.text = `Place your bet: $${betAmount}`;
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
		bettingUIHeadingText.text = `Place your bet: $${betAmount}`;
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
		bettingUIHeadingText.text = `Place your bet: $${betAmount}`;
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
		bettingUIHeadingText.text = `Place your bet: $${betAmount}`;
		canvas.update();
	});

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
			playerChips -= betAmount;

			canvas.removeChild(
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
			renderGame(canvas);
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
		bettingUIHeadingText.text = `Place your bet: $${betAmount}`;
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

const renderHandTotal = (
	canvas,
	totalText,
	hasFaceDown = false,
	isDealer = false
) => {
	let textToShow = isDealer
		? `Dealer Total: ${dealerHandTotal}`
		: `Player Total: ${playerHandTotal}`;

	if (isDealer && checkAce(dealerHand)) {
		textToShow =
			dealerHandTotal + 10 <= 21
				? `Dealer Total: ${dealerHandTotal + 10} (${dealerHandTotal})`
				: `Dealer Total: ${dealerHandTotal}`;
	} else if (!isDealer && checkAce(playerHand)) {
		textToShow =
			playerHandTotal + 10 <= 21
				? `Player Total: ${playerHandTotal + 10} (${playerHandTotal})`
				: `Player Total: ${playerHandTotal}`;
	}

	if (hasFaceDown) {
		textToShow += ' + ?';
	}
	totalText.text = textToShow;
	canvas.addChild(totalText);
	canvas.update();
};

const renderCard = (canvas, card, position, isDealer = false) => {
	card.x = 50 + 40 * position;
	card.y = isDealer ? 100 : 400;
	card.scaleX = 3;
	card.scaleY = 3;
	cardDropSound.play();
	canvas.addChild(card);
	canvas.update();
};

const clearTableAndRenderBetUI = (canvas) => {
	betAmount = 0;
	dealerHandTotalText.text = 'Dealer Total:';
	playerHandTotalText.text = 'Player Total:';
	playerHandTotal = 0;
	dealerHandTotal = 0;
	hitButton = new createjs.Shape();
	hitButtonText = new createjs.Text('', '20px Press Start', '#808080');
	standButton = new createjs.Shape();
	standButtonText = new createjs.Text('', '20px Press Start', '#808080');
	doubleButton = new createjs.Shape();
	doubleButtonText = new createjs.Text('', '20px Press Start', '#808080');
	canvas.removeAllChildren();
	canvas.addChild(gameBackground);
	renderBettingUI(canvas);
};

const checkWinner = (
	isPlayerBusted = false,
	isBlackjack = false,
	isDealerBlackjack = false
) => {
	if (isDealerBlackjack) return 'Dealer got Blackjack.\nDealer Wins';
	if (isPlayerBusted) return 'Player Busted.\nDealer Wins';

	let playerTotal = getHandValue(playerHand);
	let dealerTotal = getHandValue(dealerHand);

	if (isBlackjack) {
		if (playerTotal === dealerTotal) {
			playerChips += betAmount;
			return 'Push';
		} else {
			playerChips += betAmount + Math.floor(betAmount * (3 / 2));
			return `Player got Blackjack!\nPlayer Wins $${Math.floor(
				betAmount * (3 / 2)
			)}`;
		}
	}

	if (dealerTotal > 21) {
		playerChips += betAmount * 2;
		return `Dealer Busted.\nPlayer Wins $${betAmount}`;
	}

	if (playerTotal === dealerTotal) {
		playerChips += betAmount;
		return 'Push';
	} else if (playerTotal > dealerTotal) {
		playerChips += betAmount * 2;
		return `Player Wins $${betAmount}`;
	} else {
		return 'Dealer Wins';
	}
};

const showWinner = (
	canvas,
	isPlayerBusted = false,
	isBlackjack = false,
	isDoubled = false,
	isDealerBlackjack = false
) => {
	if (isDoubled && getHandValue(playerHand) > 21) isPlayerBusted = true;

	let winnerDisplay = new createjs.Text(
		`${checkWinner(isPlayerBusted, isBlackjack, isDealerBlackjack)}`,
		'20px Press Start',
		'#ffffff'
	);
	winnerDisplay.textAlign = 'center';
	winnerDisplay.textBaseline = 'middle';
	winnerDisplay.x = 960 / 2;
	winnerDisplay.y = 640 / 2;

	if (isDoubled) {
		const doubledCard = new createjs.Bitmap(
			`assets/img/cards/${playerHand[playerHand.length - 1].value}-${
				playerHand[playerHand.length - 1].suit
			}.gif`
		);
		playerHandTotal += getCardValue(
			playerHand[playerHand.length - 1].value
		);
		renderHandTotal(canvas, playerHandTotalText, false, false);
		renderCard(canvas, doubledCard, playerHand.length - 1);
	}

	setTimeout(
		() => {
			canvas.addChild(winnerDisplay);
			canvas.update();
		},
		isDoubled || isDealerBlackjack ? 1000 : 0
	);

	setTimeout(() => {
		clearTableAndRenderBetUI(canvas);
	}, 2000 + (isDoubled || isDealerBlackjack ? 1000 : 0));
};

const renderGame = (canvas) => {
	canvas.addChild(dealerHandTotalText, playerHandTotalText);
	canvas.update();
	deck.length = 0;
	playerHand.length = 0;
	dealerHand.length = 0;

	deck.push(...createDeck());

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
		playerCard1,
		dealerCard1,
		playerCard2,
		dealerCard2,
	];

	for (let i = 0; i < initialRenderStack.length; i++) {
		setTimeout(() => {
			renderCard(
				canvas,
				initialRenderStack[i],
				i <= 1 ? 0 : 1,
				i % 2 !== 0
			);
			if (i === 0) {
				playerHandTotal += getCardValue(playerHand[0].value);
			} else if (i === 1) {
				dealerHandTotal += getCardValue(dealerHand[0].value);
			} else if (i === 2) {
				playerHandTotal += getCardValue(playerHand[1].value);
			}
			renderHandTotal(
				canvas,
				i % 2 !== 0 ? dealerHandTotalText : playerHandTotalText,
				i === 3,
				i % 2 !== 0
			);
		}, 1000 * (i + 1));
	}
	setTimeout(() => {
		if (getHandValue(playerHand) === 21) {
			showWinner(canvas, false, true);
		} else {
			if (getHandValue(dealerHand) === 21) {
				setTimeout(() => {
					const dealerBackCard = new createjs.Bitmap(
						`assets/img/cards/${
							dealerHand[dealerHand.length - 1].value
						}-${dealerHand[dealerHand.length - 1].suit}.gif`
					);
					renderCard(
						canvas,
						dealerBackCard,
						dealerHand.length - 1,
						true
					);
					dealerHandTotal += getCardValue(
						dealerHand[dealerHand.length - 1].value
					);
					renderHandTotal(canvas, dealerHandTotalText, false, true);
				}, 1000);
				showWinner(canvas, false, false, false, true);
			} else {
				renderPlayUI(canvas);
			}
		}
	}, 4500);
};

const playDealer = (canvas, isPlayerBusted = false, isDoubled = false) => {
	const faceDownCard = new createjs.Bitmap(
		`assets/img/cards/${dealerHand[1].value}-${dealerHand[1].suit}.gif`
	);
	const drawDealerCard = () => {
		setTimeout(() => {
			if (getHandValue(dealerHand) < 17) {
				dealerHand.push(drawCard(deck));
				const drawnCard = new createjs.Bitmap(
					`assets/img/cards/${
						dealerHand[dealerHand.length - 1].value
					}-${dealerHand[dealerHand.length - 1].suit}.gif`
				);
				dealerHandTotal += getCardValue(
					dealerHand[dealerHand.length - 1].value
				);
				renderHandTotal(canvas, dealerHandTotalText, false, true);
				renderCard(canvas, drawnCard, dealerHand.length - 1, true);
				// recursion until dealer card is over 17
				drawDealerCard();
			} else {
				// dealer card is over 17
				showWinner(canvas, false, false, isDoubled);
			}
		}, 1000);
	};
	setTimeout(() => {
		dealerHandTotal += getCardValue(
			dealerHand[dealerHand.length - 1].value
		);
		renderHandTotal(canvas, dealerHandTotalText, false, true);
		if (isPlayerBusted) {
			renderCard(canvas, faceDownCard, 1, true);
			showWinner(canvas, isPlayerBusted);
		} else {
			renderCard(canvas, faceDownCard, 1, true);
			drawDealerCard();
		}
	}, 1000);
};

const renderPlayUI = (canvas) => {
	// playUI and border
	playUI = new createjs.Shape();
	playUI.graphics.beginFill('#000000').drawRect(745, 15, 200, 610);
	playUIBorder = new createjs.Shape();
	playUIBorder.graphics.setStrokeStyle(2).beginStroke('#ffffff');
	playUIBorder.graphics.drawRect(755, 25, 180, 590);

	// display player chips
	playerChipsDisplay = new createjs.Text(
		`Chips:\n\n$${playerChips}`,
		'20px Press Start',
		'#ffffff'
	);
	playerChipsDisplay.textAlign = 'center';
	playerChipsDisplay.textBaseline = 'middle';
	playerChipsDisplay.x = 845;
	playerChipsDisplay.y = 80;

	// display bet amount
	betAmountDisplay = new createjs.Text(
		`Bet:\n\n$${betAmount}`,
		'20px Press Start',
		'#ffffff'
	);
	betAmountDisplay.textAlign = 'center';
	betAmountDisplay.textBaseline = 'middle';
	betAmountDisplay.x = 845;
	betAmountDisplay.y = 220;

	const renderPlayButton = (
		canvas,
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
			buttonAction();
		});
	};

	const hidePlayUI = (canvas) => {
		canvas.removeChild(
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
		canvas.update();
	};

	canvas.addChild(playUI, playUIBorder, playerChipsDisplay, betAmountDisplay);
	// HIT LOGIC
	renderPlayButton(
		canvas,
		hitButton,
		hitButtonText,
		'HIT',
		{ x: 760, y: 395, width: 170, height: 50 },
		() => {
			if (playerHand.length === 2) {
				canvas.removeChild(doubleButton, doubleButtonText);
			}
			playerHand.push(drawCard(deck));
			const drawnCard = new createjs.Bitmap(
				`assets/img/cards/${playerHand[playerHand.length - 1].value}-${
					playerHand[playerHand.length - 1].suit
				}.gif`
			);
			playerHandTotal += getCardValue(
				playerHand[playerHand.length - 1].value
			);
			renderHandTotal(canvas, playerHandTotalText, false, false);
			renderCard(canvas, drawnCard, playerHand.length - 1);

			// if player busts or gets to 21, check dealer cards. If player busts, player loses. If 21, check winner
			if (getHandValue(playerHand) > 21) {
				hidePlayUI(canvas);
				playDealer(canvas, true);
			} else if (getHandValue(playerHand) === 21) {
				hidePlayUI(canvas);
				playDealer(canvas);
			}
		}
	);
	// STAND LOGIC
	renderPlayButton(
		canvas,
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
			hidePlayUI(canvas);
			playDealer(canvas);
		}
	);
	// DOULBLE LOGIC
	renderPlayButton(
		canvas,
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
			if (playerChips - betAmount >= 0) {
				// check if there's enough chips
				playerChips -= betAmount;
				betAmount *= 2;
				playerChipsDisplay.text = `Chips:\n\n$${playerChips}`;
				betAmountDisplay.text = `Bet:\n\n$${betAmount}`;
				playerHand.push(drawCard(deck));
				const drawnCard = new createjs.Bitmap(
					'assets/img/cards/back01.gif'
				);
				let isDoubled = true;

				renderHandTotal(canvas, playerHandTotalText, true, false);
				renderCard(canvas, drawnCard, playerHand.length - 1);
				hidePlayUI(canvas);
				playDealer(canvas, false, isDoubled);
			}
		}
	);
	canvas.update();
};
