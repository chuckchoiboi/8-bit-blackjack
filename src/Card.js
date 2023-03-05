import { game } from './game.js';

export class Card extends createjs.Container {
	constructor(card) {
		super();

		// Create the front and back of the card
		this.front = new createjs.Bitmap(
			game.assets.getAsset(`${card.rank}-${card.suit}`)
		);
		this.front.scaleX = 3;
		this.front.scaleY = 3;

		this.back = new createjs.Bitmap(game.assets.getAsset('backCard'));
		this.back.scaleX = 3;
		this.back.scaleY = 3;

		// Add them to the container
		this.addChild(this.front, this.back);

		// Hide the front of the card
		this.front.visible = !card.hidden;
		this.back.visible = card.hidden;
	}

	flip() {
		const cardDropSound = game.assets.getAsset('cardDropSound');
		cardDropSound.volume = 0.5;

		// Animate card flip
		createjs.Tween.get(this.back)
			.to({ alpha: 0 }, 200)
			.call(() => {
				cardDropSound.play();
				this.back.visible = false;
				this.front.visible = true;
			})
			.to({ alpha: 1 }, 200);
	}

	renderCard(cardIndex, isDealer) {
		const cardDropSound = game.assets.getAsset('cardDropSound');
		cardDropSound.volume = 0.5;

		return new Promise((resolve) => {
			let x = 50 + 40 * cardIndex;
			let y = isDealer ? 100 : 400;
			createjs.Tween.get(this)
				.to({ x, y }, 1000)
				.call(() => {
					cardDropSound.play();
					resolve();
				});
		});
	}
}
