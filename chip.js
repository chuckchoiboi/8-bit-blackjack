export const chipImages = {
	5: './assets/img/chips/white-chip.png',
	10: './assets/img/chips/red-chip.png',
	25: './assets/img/chips/green-chip.png',
	100: './assets/img/chips/black-chip.png',
};

export const isBettable = (betAmount, playerChips) => {
	return betAmount <= playerChips ? true : false;
};

export const placeBet = (betAmount, playerChips) => {
	playerChips -= betAmount;
};

export const doubleDown = (betAmount, playerChips) => {
	playerChips -= betAmount;
	betAmount *= 2;
};

export const winBet = (betAmount, playerChips) => {
	playerChips += betAmount;
};
