import { deckLogic } from './deckLogic.js';
import { Player, Dealer } from './Player.js';
import { Card } from './Card.js';
import { getStartScreen, getGameScreen, renderBettingUI } from './stage.js';
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

		console.log(game.stage);

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
		if (deckLogic.isBlackjack(game.player)) {
			alert('Blackjack! You win!');
			return;
		}
		if (deckLogic.isBlackjack(game.dealer)) {
			alert('Dealer has blackjack! You lose!');
			return;
		}

		// // Enable/disable buttons
		// hitButton.disabled = false;
		// standButton.disabled = false;
		// doubleButton.disabled = false;
	},

	hit: () => {
		game.player.addCard(deckLogic.dealCard());

		// Check for bust
		if (deckLogic.isBust(game.player)) {
			alert('Bust! You lose!');
			game.endRound();
		}
	},

	stand: () => {
		// Reveal dealer's second card
		game.dealer.revealHand();

		// Dealer hits until at least 17
		while (deckLogic.getHandValue(game.dealer.hand) < 17) {
			game.dealer.addCard(deckLogic.dealCard());
		}

		// Check for bust or win
		if (deckLogic.isBust(game.dealer)) {
			alert('Dealer busts! You win!');
		} else if (
			deckLogic.getHandValue(game.player.hand) >
			deckLogic.getHandValue(game.dealer.hand)
		) {
			alert('You win!');
		} else if (
			deckLogic.getHandValue(game.player.hand) ==
			deckLogic.getHandValue(game.dealer.hand)
		) {
			alert("Push! It's a tie!");
		} else {
			alert('You lose!');
		}

		game.endRound();
	},

	double: () => {
		game.player.addCard(deckLogic.dealCard());

		// Check for bust
		if (deckLogic.isBust(game.player)) {
			alert('Bust! You lose!');

			// Reveal dealer's second card and end the game immediately
			game.dealer.revealHand();
			game.endRound();
		} else {
			// Reveal dealer's second card
			game.dealer.revealHand();

			// Dealer hits until at least 17
			while (deckLogic.getHandValue(game.dealer.hand) < 17) {
				game.dealer.addCard(deckLogic.dealCard());
			}

			// Check for bust or win
			if (deckLogic.isBust(game.dealer)) {
				alert('Dealer busts! You win!');
			} else if (
				deckLogic.getHandValue(game.player.hand) >
				deckLogic.getHandValue(game.dealer.hand)
			) {
				alert('You win!');
			} else if (
				deckLogic.getHandValue(game.player.hand) ==
				deckLogic.getHandValue(game.dealer.hand)
			) {
				alert("Push! It's a tie!");
			} else {
				alert('You lose!');
			}

			game.endRound();
		}
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
