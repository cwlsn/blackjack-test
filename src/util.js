function cardValue(rank) {
	let value = parseInt(rank);
	if (rank === 'A') {
		value = 11;
	} else if (isNaN(value)) {
		value = 10;
	}
	return value;
}

function calculateScore(hand) {
	// this desctructure is madness, don't do this at your job
	const [{ rank: firstRank }, { rank: secondRank }] = hand;
	if (firstRank === 'A' && secondRank === 'A') {
		return 'Soft 12';
	}

	let soft = false;
	if (firstRank === 'A' || secondRank === 'A') {
		soft = true;
	}

	const total = cardValue(firstRank) + cardValue(secondRank);
	return total === 21 ? 'Blackjack!' : `${soft ? 'Soft' : 'Hard'} ${total}`;
}

export { cardValue, calculateScore };
