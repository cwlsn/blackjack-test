import { uniqueId } from "lodash";

const suits = ["♠", "♣", "♦", "♥"];

const ranks = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
];

// https://stackoverflow.com/a/2450976/8643426
function shuffle(deck) {
  var currentIndex = deck.length,
    temporaryValue,
    randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = deck[currentIndex];
    deck[currentIndex] = deck[randomIndex];
    deck[randomIndex] = temporaryValue;
  }
  return deck;
}

function newDeck(n = 1, jokers = 0) {
  const deck = [];
  for (let i = 0; i < n; i++) {
    ranks.forEach(rank => {
      suits.forEach(suit => {
        deck.push({
          rank,
          suit,
          id: uniqueId(`${rank}-${suit}-`)
        });
      });
    });
  }
  return shuffle(deck);
}

export { newDeck, shuffle };
