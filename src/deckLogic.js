export const deckLogic = {
	deck: null,

	resetDeck: () => {
		deckLogic.deck = [
			{ suit: 'hearts', rank: '2', value: 2, hidden: false },
			{ suit: 'hearts', rank: '3', value: 3, hidden: false },
			{ suit: 'hearts', rank: '4', value: 4, hidden: false },
			{ suit: 'hearts', rank: '5', value: 5, hidden: false },
			{ suit: 'hearts', rank: '6', value: 6, hidden: false },
			{ suit: 'hearts', rank: '7', value: 7, hidden: false },
			{ suit: 'hearts', rank: '8', value: 8, hidden: false },
			{ suit: 'hearts', rank: '9', value: 9, hidden: false },
			{ suit: 'hearts', rank: '10', value: 10, hidden: false },
			{ suit: 'hearts', rank: 'J', value: 10, hidden: false },
			{ suit: 'hearts', rank: 'Q', value: 10, hidden: false },
			{ suit: 'hearts', rank: 'K', value: 10, hidden: false },
			{ suit: 'hearts', rank: 'A', value: 11, hidden: false },
			{ suit: 'diamonds', rank: '2', value: 2, hidden: false },
			{ suit: 'diamonds', rank: '3', value: 3, hidden: false },
			{ suit: 'diamonds', rank: '4', value: 4, hidden: false },
			{ suit: 'diamonds', rank: '5', value: 5, hidden: false },
			{ suit: 'diamonds', rank: '6', value: 6, hidden: false },
			{ suit: 'diamonds', rank: '7', value: 7, hidden: false },
			{ suit: 'diamonds', rank: '8', value: 8, hidden: false },
			{ suit: 'diamonds', rank: '9', value: 9, hidden: false },
			{ suit: 'diamonds', rank: '10', value: 10, hidden: false },
			{ suit: 'diamonds', rank: 'J', value: 10, hidden: false },
			{ suit: 'diamonds', rank: 'Q', value: 10, hidden: false },
			{ suit: 'diamonds', rank: 'K', value: 10, hidden: false },
			{ suit: 'diamonds', rank: 'A', value: 11, hidden: false },
			{ suit: 'clubs', rank: '2', value: 2, hidden: false },
			{ suit: 'clubs', rank: '3', value: 3, hidden: false },
			{ suit: 'clubs', rank: '4', value: 4, hidden: false },
			{ suit: 'clubs', rank: '5', value: 5, hidden: false },
			{ suit: 'clubs', rank: '6', value: 6, hidden: false },
			{ suit: 'clubs', rank: '7', value: 7, hidden: false },
			{ suit: 'clubs', rank: '8', value: 8, hidden: false },
			{ suit: 'clubs', rank: '9', value: 9, hidden: false },
			{ suit: 'clubs', rank: '10', value: 10, hidden: false },
			{ suit: 'clubs', rank: 'J', value: 10, hidden: false },
			{ suit: 'clubs', rank: 'Q', value: 10, hidden: false },
			{ suit: 'clubs', rank: 'K', value: 10, hidden: false },
			{ suit: 'clubs', rank: 'A', value: 11, hidden: false },
			{ suit: 'spades', rank: '2', value: 2, hidden: false },
			{ suit: 'spades', rank: '3', value: 3, hidden: false },
			{ suit: 'spades', rank: '4', value: 4, hidden: false },
			{ suit: 'spades', rank: '5', value: 5, hidden: false },
			{ suit: 'spades', rank: '6', value: 6, hidden: false },
			{ suit: 'spades', rank: '7', value: 7, hidden: false },
			{ suit: 'spades', rank: '8', value: 8, hidden: false },
			{ suit: 'spades', rank: '9', value: 9, hidden: false },
			{ suit: 'spades', rank: '10', value: 10, hidden: false },
			{ suit: 'spades', rank: 'J', value: 10, hidden: false },
			{ suit: 'spades', rank: 'Q', value: 10, hidden: false },
			{ suit: 'spades', rank: 'K', value: 10, hidden: false },
			{ suit: 'spades', rank: 'A', value: 11, hidden: false },
		];
	},

	shuffleDeck: () => {
		for (let i = 0; i < deckLogic.deck.length; i++) {
			let j = Math.floor(Math.random() * deckLogic.deck.length);
			let temp = deckLogic.deck[i];
			deckLogic.deck[i] = deckLogic.deck[j];
			deckLogic.deck[j] = temp;
		}
	},

	getHandValue: (hand) => {
		let value = 0;
		let aceCount = 0;

		for (let i = 0; i < hand.length; i++) {
			value += hand[i].value;
			if (hand[i].rank === 'A') {
				aceCount++;
			}
		}

		while (aceCount > 0 && value > 21) {
			value -= 10;
			aceCount--;
		}

		return value;
	},

	hasAce: (hand) => {
		let hasAce = false;

		for (let i = 0; i < hand.length; i++) {
			if (hand[i].rank === 'A') {
				hasAce = true;
			}
		}

		return hasAce;
	},

	getDisplayValue: (hand) => {
		let value = 0;
		let aceCount = 0;

		for (let i = 0; i < hand.length; i++) {
			if (!hand[i].hidden) {
				value += hand[i].value;
				if (hand[i].rank === 'A') {
					aceCount++;
				}
			}
		}

		while (aceCount > 0 && value > 21) {
			value -= 10;
			aceCount--;
		}

		if (aceCount) {
			return `${value} or ${value - 10}`;
		}

		return `${value}`;
	},

	drawCard: (isHidden = false) => {
		let drawnCard = deckLogic.deck.pop();
		drawnCard.hidden = isHidden;

		return drawnCard;
	},

	getCardSprite: (card) => {
		// Create a container to hold the card image and back image
		const container = new createjs.Container();

		// Create the back image and card image
		const backImage = new createjs.Bitmap('./assets/img/cards/back01.gif');
		const cardImage = new createjs.Bitmap(
			`./assets/img/cards/${card.rank}-${card.suit}.gif`
		);

		// Set the visibility of the images based on the "hidden" property
		backImage.visible = card.hidden;
		cardImage.visible = !card.hidden;

		// Add the images to the container
		container.addChild(backImage, cardImage);

		return container;
	},

	isBlackjack: (player) => {
		if (player.hand.length !== 2) {
			return false;
		}

		// Check if the hand contains an ace and a ten-point card
		let hasAce = false;
		let hasTen = false;
		for (let card of player.hand) {
			if (card.rank === 'A') {
				hasAce = true;
			} else if (['K', 'Q', 'J', '10'].includes(card.rank)) {
				hasTen = true;
			}
		}

		return hasAce && hasTen;
	},

	isBust: (player) => {
		let total = deckLogic.getHandValue(player.hand);
		return total > 21;
	},
};
