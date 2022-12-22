import shuffle from 'just-shuffle';

// prettier-ignore
const freshDeck = ['AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS'];

type Card = {
  suit: string | undefined;
  value: number;
};

export enum BestHand {
  ROYAL_FLUSH = 'Royal Flush',
  STRAIGHT_FLUSH = 'Straight Flush',
  FLUSH = 'Flush',
  STRAIGHT = 'Straight',
  FOUR_OF_A_KIND = 'Four of a Kind',
  FULL_HOUSE = 'Full House',
  THREE_OF_A_KIND = 'Three of a Kind',
  TWO_PAIR = 'Two Pair',
  JACKS_OR_BETTER = 'Jacks or Better',
  ONE_PAIR = 'One Pair',
  HIGH_CARD = 'High Card'
}

export const getFreshDeck = (): string[] => {
  return freshDeck.slice();
};

export const shuffledDeck = (): string[] => {
  return shuffle(getFreshDeck());
};

/*
  returns: array of given number of cards
 */
export const deal = (deck: string[], number: number): string[] => {
  return deck.splice(0, number);
};

/*
  Will add or remove given card from given array of cards, returning new array
 */
export const addOrRemove = (cards: string[], value: string) => {
  const clone = cards.slice();
  const foundIndex = clone.findIndex((val) => val === value);
  if (foundIndex === -1) {
    clone.push(value);
  } else {
    clone.splice(foundIndex, 1);
  }
  return clone;
};

/*
  hand: array of cards
  discards: array of cards to replace
  returns: new hand
 */
export const redraw = (hand: string[], discards: string[], deck: string[]) => {
  let newHand = hand.slice();
  discards.forEach((value) => {
    const findIndex = newHand.findIndex((val) => val === value);
    if (findIndex > -1) {
      newHand[findIndex] = deal(deck, 1)[0];
    } else {
      throw new Error('You tried to replace cards you did not have');
    }
  });
  return newHand;
};

export const getSortedHand = (hand: string[]): Card[] => {
  const getNumericValue = (value: string): number => {
    if (value === 'A') return 14;
    if (value === 'K') return 13;
    if (value === 'Q') return 12;
    if (value === 'J') return 11;
    return parseInt(value, 10);
  };

  const cards: { suit: string | undefined; value: number }[] = hand.map(
    (card) => {
      const suit = card.slice(-1);
      const stringValue = card.slice(-3, -1);
      const value = getNumericValue(stringValue);

      return { suit, value };
    }
  );

  return cards.sort((a, b) => a.value - b.value);
};

export const getFlush = (cards: Card[]): boolean => {
  const firstSuit = cards[0].suit;
  return cards.every((card) => card.suit === firstSuit);
};

export const getStraight = (hand: Card[]): boolean => {
  const values = hand.map((card) => card.value);

  function checkForStraight(values: number[]) {
    return values.every((value, index, array) => {
      if (index === 0) return true;
      return array[index - 1] === value - 1;
    });
  }

  // typical straight
  if (checkForStraight(values)) {
    return true;
  }

  // low straight
  if (values[4] === 14) {
    let copy = values.slice();
    copy.pop();
    copy.unshift(1);
    return checkForStraight(copy);
  }

  return false;
};

/*
 * Converts to array of arrays for each pair, three-of-a-kind, and four-of-a-kind
 * */
export const getGroups = (cards: Card[]): number[][] => {
  const values = cards.map((card) => card.value);
  let result = [];

  for (let i = 1; i <= 14; i++) {
    let pairOrHigher = values.filter((val) => val === i);
    if (pairOrHigher.length > 1) {
      result.push(pairOrHigher);
    }
  }
  return result;
};

/*
  hand: array of five cards
  returns: highest value of hand
*/
export const evaluate = (hand: string[]): BestHand => {
  const sortedHand = getSortedHand(hand);

  const isFlush = getFlush(sortedHand);
  const isStraight = getStraight(sortedHand);

  if (isFlush && isStraight && sortedHand[0].value === 10) {
    return BestHand.ROYAL_FLUSH;
  }

  if (isFlush && isStraight) {
    return BestHand.STRAIGHT_FLUSH;
  }

  if (isFlush) {
    return BestHand.FLUSH;
  }

  if (isStraight) {
    return BestHand.STRAIGHT;
  }

  const groups = getGroups(sortedHand);

  // four of a kind
  if (groups.length === 1 && groups[0].length === 4) {
    return BestHand.FOUR_OF_A_KIND;
  }

  // full house
  if (
    groups.length === 2 &&
    ((groups[0].length === 3 && groups[1].length === 2) ||
      (groups[0].length === 2 && groups[1].length === 3))
  ) {
    return BestHand.FULL_HOUSE;
  }

  // three of a kind
  if (groups.length === 1 && groups[0].length === 3) {
    return BestHand.THREE_OF_A_KIND;
  }

  // two pair
  if (groups.length === 2 && groups[0].length === 2 && groups[1].length === 2) {
    return BestHand.TWO_PAIR;
  }

  // jacks or better or one pair
  if (groups.length === 1 && groups[0].length === 2) {
    if (groups[0][0] >= 11) {
      return BestHand.JACKS_OR_BETTER;
    }
    return BestHand.ONE_PAIR;
  }

  // high card
  return BestHand.HIGH_CARD;
};

export const calculate = (result: BestHand, bet = 5) => {
  switch (result) {
    case BestHand.ROYAL_FLUSH:
      return bet * 250;
    case BestHand.STRAIGHT_FLUSH:
      return bet * 50;
    case BestHand.FOUR_OF_A_KIND:
      return bet * 25;
    case BestHand.FULL_HOUSE:
      return bet * 9;
    case BestHand.FLUSH:
      return bet * 6;
    case BestHand.STRAIGHT:
      return bet * 4;
    case BestHand.THREE_OF_A_KIND:
      return bet * 3;
    case BestHand.TWO_PAIR:
      return bet * 2;
    case BestHand.JACKS_OR_BETTER:
      return bet;
    default:
      return 0;
  }
};
