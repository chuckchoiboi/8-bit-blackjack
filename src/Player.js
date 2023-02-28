import { deckLogic } from './deckLogic';

class Player extends createjs.Container {
	constructor() {
		super();

		this.hand = [];
		this.handValue = 0;

		// Add graphics for the player's cards
		this.cardsContainer = new createjs.Container();
		this.addChild(this.cardsContainer);
	}

	addCard(card) {
		this.hand.push(card);
		this.handValue = deckLogic.getHandValue(this.hand);

		// Update the player's graphics
		let cardSprite = deckLogic.getCardSprite(card);
		cardSprite.x = 50 + 40 * (this.hand.length - 1);
		cardSprite.y = 400;
		this.cardsContainer.addChild(cardSprite);
	}

	reset() {
		this.hand = [];
		this.handValue = 0;

		// Reset the graphics for the player's cards
		this.cardsContainer.removeAllChildren();
	}
}

class Dealer extends createjs.Container {
	constructor() {
		super();

		this.hand = [];
		this.handValue = 0;

		// Add graphics for the dealer's cards
		this.cardsContainer = new createjs.Container();
		this.addChild(this.cardsContainer);
	}

	addCard(card) {
		this.hand.push(card);
		this.handValue = deckLogic.getHandValue(this.hand);

		// Update the dealer's graphics
		let cardSprite = deckLogic.getCardSprite(card);
		cardSprite.x = 50 + 40 * (this.hand.length - 1);
		cardSprite.y = 100;
		this.cardsContainer.addChild(cardSprite);
	}

	reset() {
		this.hand = [];
		this.handValue = 0;

		// Reset the graphics for the dealer's cards
		this.cardsContainer.removeAllChildren();
	}

	revealHand() {
		// Flip all cards in the hand
		this.hand.forEach((card) => (card.hidden = false));

		// Update the graphics of the cards in the dealer's hand
		this.cardsContainer.removeAllChildren();
		this.hand.forEach((card, index) => {
			const cardSprite = deckLogic.getCardSprite(card);
			cardSprite.x = 50 + 40 * index;
			cardSprite.y = 100;
			this.cardsContainer.addChild(cardSprite);
		});
	}
}

export { Player, Dealer };
