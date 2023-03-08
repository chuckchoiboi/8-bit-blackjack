import { deckLogic } from './deckLogic.js';
import { Player, Dealer } from './Player.js';
import { Card } from './Card.js';
import {
	getStartScreen,
	getGameScreen,
	renderBettingUI,
	renderPlayUI,
} from './stage.js';
import { assetManager } from './assetManager.js';

export const game = {
	stage: null,
	backgroundMusic: null,
	player: null,
	dealer: null,
	assets: null,

	loadStartScreen: () => {
		game.assets = assetManager;

		if (!game.stage) {
			// Add all 52 cards to the asset manager on first time loading
			for (let rank of [
				'A',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9',
				'10',
				'J',
				'Q',
				'K',
			]) {
				for (let suit of ['clubs', 'diamonds', 'hearts', 'spades']) {
					const cardName = `${rank}-${suit}`;
					const cardPath = `assets/img/cards/${cardName}.gif`;
					game.assets.addAsset(cardName, cardPath);
				}
			}
		}

		// Create the game stage
		game.stage = new createjs.Stage('gameCanvas');
		game.stage.enableMouseOver(10);

		const startScreen = getStartScreen(game);

		game.stage.addChild(startScreen);

		game.stage.update();
	},

	loadGameScreen: () => {
		const gameScreen = getGameScreen(game);

		game.stage.addChild(gameScreen);
		game.stage.update();
	},

	startGame: () => {
		// Create the player and dealer
		game.player = new Player();
		game.dealer = new Dealer();

		// Add them to the stage
		game.stage.addChild(game.player.container, game.dealer.container);

		renderBettingUI(game);
	},

	deal: async () => {
		deckLogic.resetDeck();
		deckLogic.shuffleDeck();
		game.player.resetHand();
		game.dealer.resetHand();

		// Deal the initial cards
		game.player.addCard(deckLogic.drawCard());
		game.dealer.addCard(deckLogic.drawCard());
		game.player.addCard(deckLogic.drawCard());
		game.dealer.addCard(deckLogic.drawCard(true));

		// Define card images to render
		const playerCard1 = new Card(game.player.hand[0]);
		const dealerCard1 = new Card(game.dealer.hand[0]);
		const playerCard2 = new Card(game.player.hand[1]);
		const dealerCard2 = new Card(game.dealer.hand[1]);

		// Render the cards one by one with a delay between each card
		await playerCard1.renderCard(0, false);
		game.player.container.addChild(playerCard1);
		await dealerCard1.renderCard(0, true);
		game.dealer.container.addChild(dealerCard1);
		await playerCard2.renderCard(1, false);
		game.player.container.addChild(playerCard2);
		await dealerCard2.renderCard(1, true);
		game.dealer.container.addChild(dealerCard2);

		// Check for natural blackjack
		if (game.player.isBlackjack()) {
			if (game.dealer.isBlackjack()) {
				await dealerCard2.flip();
				await game.showWinnerMessage(
					"You and Dealer both have blackjack!\nIt's a tie!"
				);
				game.player.chips += game.player.betAmount;
				game.endRound();
				return;
			}
			game.player.chips += (game.player.betAmount * 3) / 2;

			await game.showWinnerMessage('Blackjack! You win!');
			game.endRound();
			return;
		}
		if (game.dealer.isBlackjack()) {
			await dealerCard2.flip();
			await game.showWinnerMessage('Dealer has blackjack!\nYou lose!');
			game.endRound();
			return;
		}

		// render gameUI
		renderPlayUI(game);
	},

	hit: async () => {
		game.player.addCard(deckLogic.drawCard());
		const drawnCard = new Card(
			game.player.hand[game.player.hand.length - 1]
		);
		// animate card Render
		await drawnCard.renderCard(game.player.hand.length - 1, false);
		game.player.container.addChild(drawnCard);

		// Check for bust
		if (game.player.isBust()) {
			await game.showWinnerMessage('Bust! You lose!');
			game.endRound();
			return;
		}

		// render gameUI again if not bust
		renderPlayUI(game);
	},

	stand: async () => {
		game.playDealer();
	},

	double: async () => {
		game.player.addCard(deckLogic.drawCard());
		const drawnCard = new Card(
			game.player.hand[game.player.hand.length - 1]
		);
		// animate card Render
		await drawnCard.renderCard(game.player.hand.length - 1, false);
		game.player.container.addChild(drawnCard);

		// Check for bust
		if (game.player.isBust()) {
			await game.showWinnerMessage('Bust! You lose!');

			// reveal dealaer's card
			await game.dealer.container.children[
				game.dealer.container.children.length - 1
			].flip();

			game.endRound();
		} else {
			// Reveal dealer's second card
			game.playDealer();
		}
	},

	playDealer: async () => {
		// reveal dealaer's card
		await game.dealer.container.children[
			game.dealer.container.children.length - 1
		].flip();

		// dealer hits until his handValue is < 17
		while (game.dealer.handValue < 17) {
			game.dealer.addCard(deckLogic.drawCard());
			const drawnCard = new Card(
				game.dealer.hand[game.dealer.hand.length - 1]
			);
			// animate card Render
			await drawnCard.renderCard(game.dealer.hand.length - 1, true);
			game.dealer.container.addChild(drawnCard);
		}

		if (game.dealer.isBust()) {
			await game.showWinnerMessage('Dealer busts! You win!');
			game.player.chips += game.player.betAmount * 2;
		} else if (game.player.handValue > game.dealer.handValue) {
			await game.showWinnerMessage('You win!');
			game.player.chips += game.player.betAmount * 2;
		} else if (game.player.handValue == game.dealer.handValue) {
			await game.showWinnerMessage("Push! It's a tie!");
			game.player.chips += game.player.betAmount;
		} else {
			await game.showWinnerMessage('You lose!');
		}

		game.endRound();
	},

	showWinnerMessage: async (message) => {
		const container = game.stage.getChildAt(0);
		const winnerDisplay = new createjs.Text(
			message,
			'20px Press Start',
			'#ffffff'
		);
		winnerDisplay.textAlign = 'center';
		winnerDisplay.textBaseline = 'middle';
		winnerDisplay.x = 960 / 2;
		winnerDisplay.y = 640 / 2 - 50;

		container.addChild(winnerDisplay);

		return new Promise((resolve) => {
			setTimeout(() => {
				container.removeChild(winnerDisplay);
				resolve();
			}, 2000);
		});
	},

	endRound: () => {
		game.player.resetHand();
		game.dealer.resetHand();

		if (game.player.chips < 5) {
			// render message, stop the music, and reset games and load start screen
			game.backgroundMusic.pause();
			game.backgroundMusic.currentTime = 0;
			game.stage.getChildAt(0).removeAllChildren();
			game.stage.removeAllChildren();
			game.loadStartScreen();
			return;
		}

		renderBettingUI(game);
	},
};

// Load game assets
assetManager.loadAssets(
	[
		{ name: 'backCard', src: 'assets/img/cards/back01.gif' },
		{ name: 'chip5', src: 'assets/img/chips/white-chip.png' },
		{ name: 'chip10', src: 'assets/img/chips/red-chip.png' },
		{ name: 'chip25', src: 'assets/img/chips/green-chip.png' },
		{ name: 'chip100', src: 'assets/img/chips/black-chip.png' },
		{ name: 'startSound', src: 'assets/audio/gameboy.mp3' },
		{ name: 'shuffleSound', src: 'assets/audio/shuffle.mp3' },
		{ name: 'backgroundMusic', src: 'assets/audio/background.mp3' },
		{ name: 'chipSound', src: 'assets/audio/coins.mp3' },
		{ name: 'cardDropSound', src: 'assets/audio/cardDrop.mp3' },
	],
	() => {
		// load start screen
		game.loadStartScreen();
	}
);
