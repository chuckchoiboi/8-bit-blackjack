import { game } from './game.js';

export class Card extends createjs.Container {
	constructor(card) {
		super();

		// Create the front and back of the card
		this.back = new createjs.Bitmap(game.assets.getAsset('backCard'));
		this.front = new createjs.Bitmap(
			game.assets.getAsset(`${card.rank}-${card.suit}`)
		);

		// Add them to the container
		this.addChild(this.back, this.front);

		// Hide the front of the card
		this.front.visible = !card.hidden;
		this.back.visible = card.hidden;
	}

	flip() {
		// Animate card flip
		createjs.Tween.get(this.back)
			.to({ alpha: 0 }, 200)
			.call(() => {
				this.back.visible = false;
				this.front.visible = true;
			})
			.to({ alpha: 1 }, 200);
	}

	renderCard(cardIndex, isDealer) {
		return new Promise((resolve) => {
			let x = 50 + 40 * cardIndex;
			let y = isDealer ? 100 : 400;
			// Use createjs.Tween to animate the movement of the card
			createjs.Tween.get(this).to({ x, y }, 10000).call(resolve);
		});
	}
}
