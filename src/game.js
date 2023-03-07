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

		// Add all 52 cards to the asset manager
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
		game.player.reset();
		game.dealer.reset();

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
				alert("You and Dealer both have blackjack! It's a tie!");
				return;
			}

			alert('Blackjack! You win!');
			return;
		}
		if (game.dealer.isBlackjack()) {
			await dealerCard2.flip();
			alert('Dealer has blackjack! You lose!');
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
			alert('Bust! You lose!');
			game.endRound();
		}
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
			alert('Bust! You lose!');

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
			await drawnCard.renderCard(game.dealer.hand.length - 1, false);
			game.dealer.container.addChild(drawnCard);
		}

		if (game.player.handValue > game.dealer.handValue) {
			alert('You win!');
		} else if (game.player.handValue == game.dealer.handValue) {
			alert("Push! It's a tie!");
		} else {
			alert('You lose!');
		}

		game.endRound();
	},

	endRound: () => {
		// Disable buttons
		betButton.disabled = false;
		hitButton.disabled = true;
		standButton.disabled = true;
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
