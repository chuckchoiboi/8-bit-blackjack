// This module exports functions to create and manipulate a deck of cards.

// Returns a new deck of cards.
export const createDeck = () => {
	const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
	const values = [
		'ace',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'10',
		'jack',
		'queen',
		'king',
	];

	const deck = [];

	for (let i = 0; i < suits.length; i++) {
		for (let j = 0; j < values.length; j++) {
			const card = {
				suit: suits[i],
				value: values[j],
			};
			deck.push(card);
		}
	}

	return deck;
};

// Shuffles the given deck of cards.
export const shuffleDeck = (deck) => {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
};

// Draws a card from the given deck of cards.
export const drawCard = (deck) => {
	return deck.pop();
};

// Calculates the value of the given hand of cards.
export const getHandValue = (hand) => {
	let handValue = 0;
	let hasAce = false;

	for (let i = 0; i < hand.length; i++) {
		const cardValue = hand[i].value;

		if (
			cardValue === 'jack' ||
			cardValue === 'queen' ||
			cardValue === 'king'
		) {
			handValue += 10;
		} else if (cardValue === 'ace') {
			handValue++;
			hasAce = true;
		} else {
			handValue += parseInt(cardValue);
		}
	}

	if (hasAce && handValue + 10 <= 21) {
		handValue += 10;
	}

	return handValue;
};

// Calculates the value of the given hand of cards.
export const getCardValue = (handValue) => {
	if (handValue === 'jack' || handValue === 'queen' || handValue === 'king') {
		return 10;
	} else if (handValue === 'ace') {
		return 1;
	} else {
		return parseInt(handValue);
	}
};

export const checkAce = (hand) => {
	for (let i = 0; i < hand.length; i++) {
		if (hand[i].value === 'ace') {
			return true;
		}
	}
	return false;
};
