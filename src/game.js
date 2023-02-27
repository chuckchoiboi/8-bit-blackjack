import { deckLogic } from './deckLogic';

const game = {
	stage: null,
	player: null,
	dealer: null,

	start: () => {
		// Create the game stage
		game.stage = new createjs.Stage('gameCanvas');

		// Create the player and dealer
		game.player = new Player();
		game.dealer = new Dealer();

		// Add them to the stage
		game.stage.addChild(game.player, game.dealer);

		// // Connect bet button to betting UI's bet button
		// let betButton = document.getElementById('betButton');
		// betButton.addEventListener('click', game.deal);

		let hitButton = document.getElementById('hitButton');
		hitButton.addEventListener('click', game.hit);
		hitButton.mouseEnabled = false;

		let standButton = document.getElementById('standButton');
		standButton.addEventListener('click', game.stand);
		standButton.mouseEnabled = false;

		let doubleButton = document.getElementById('doubleButton');
		doubleButton.addEventListener('click', game.double);
		doubleButton.mouseEnabled = false;

		// Update the stage
		createjs.Ticker.framerate = 60;
		createjs.Ticker.addEventListener('tick', game.stage);
	},

	deal: () => {
		game.player.reset();
		game.dealer.reset();

		// Deal the initial cards
		game.player.addCard(deckLogic.drawCard());
		game.dealer.addCard(deckLogic.drawCard());
		game.player.addCard(deckLogic.drawCard());
		game.dealer.addCard(deckLogic.drawCard(true));

		// Check for natural blackjack
		if (deckLogic.isBlackjack(game.player)) {
			alert('Blackjack! You win!');
			return;
		}
		if (deckLogic.isBlackjack(game.dealer)) {
			alert('Dealer has blackjack! You lose!');
			return;
		}

		// Enable/disable buttons
		hitButton.disabled = false;
		standButton.disabled = false;
		doubleButton.disabled = false;
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
		game.dealer.revealCard();

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
			game.dealer.revealCard();
			game.endRound();
		} else {
			// Reveal dealer's second card
			game.dealer.revealCard();

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

window.onload = game.start;