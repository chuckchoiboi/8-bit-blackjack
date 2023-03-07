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

	resetHand() {
		this.hand = [];
		this.handValue = 0;
		this.betAmount = 0;
		this.container.removeAllChildren();
	}

	resetGame() {
		this.chips = 1000;
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

	resetHand() {
		this.hand = [];
		this.handValue = 0;
		this.container.removeAllChildren();
	}
}

export { Player, Dealer };
