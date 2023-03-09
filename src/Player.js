import { deckLogic } from './deckLogic.js';

class Player extends createjs.Container {
	constructor() {
		super();

		this.hand = [];
		this.handValue = 0;
		this.chips = 1000;
		this.betAmount = 0;
		this.container = new createjs.Container();
	}

	addCard(card) {
		this.hand.push(card);
		this.handValue = deckLogic.getHandValue(this.hand);
	}

	isBlackjack() {
		return deckLogic.isBlackjack(this);
	}

	isBust() {
		return deckLogic.isBust(this);
	}

	getHandValue() {
		let handValue = this.handValue;
		let hasAce = deckLogic.hasAce(this.hand);

		if (hasAce) {
			return `${handValue} (${handValue - 10})`;
		}

		return handValue;
	}

	resetHand() {
		this.hand = [];
		this.handValue = 0;
		this.container.removeAllChildren();
	}

	resetGame() {
		this.chips = 1000;
		this.betAmount = 0;
		this.resetHand();
	}
}

class Dealer extends createjs.Container {
	constructor() {
		super();

		this.hand = [];
		this.handValue = 0;
		this.container = new createjs.Container();
	}

	addCard(card) {
		this.hand.push(card);
		this.handValue = deckLogic.getHandValue(this.hand);
	}

	isBlackjack() {
		return deckLogic.isBlackjack(this);
	}

	isBust() {
		return deckLogic.isBust(this);
	}

	getHandValue(revealCard = false) {
		let handValue = this.handValue;
		let hasAce = deckLogic.hasAce(this.hand);

		if (!revealCard && this.hand.length === 2) {
			handValue = deckLogic.getHandValue([this.hand[0]]);
			hasAce = deckLogic.hasAce([this.hand[0]]);
		}

		if (hasAce) {
			return `${handValue} (${handValue - 10})`;
		}

		return handValue;
	}

	resetHand() {
		this.hand = [];
		this.handValue = 0;
		this.container.removeAllChildren();
	}
}

export { Player, Dealer };
