import { expect, it } from 'vitest';
import {
  getFreshDeck,
  shuffledDeck,
  deal,
  addOrRemove,
  getSortedHand,
  evaluate,
  redraw,
  getFlush,
  getStraight,
  getGroups
} from '../src/utils';
import compare from 'just-compare';
import flatten from 'just-flatten-it';
import get = Reflect.get;

it('deals the given number of cards', () => {
  let deck = shuffledDeck();
  const expectedHand = deck.slice(0, 5);

  const hand = deal(deck, 5);

  expect(hand).toHaveLength(5);
  expect(deck).toHaveLength(47);
  expect(compare(hand, expectedHand)).toBeTruthy();
});

it('addOrRemove discards', () => {
  const result = addOrRemove([], '5S');
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual('5S');

  const result2 = addOrRemove(['4S'], 'AH');
  expect(result2).toHaveLength(2);
  expect(result2[1]).toEqual('AH');

  const result3 = addOrRemove(['10S', 'JH'], 'JH');
  expect(result3).toHaveLength(1);
  expect(result3[0]).toEqual('10S');
});

it('replenishes discards', () => {
  let deck = getFreshDeck();
  let hand = deal(deck, 5);
  const newHand = redraw(hand, ['2C', '4C'], deck);

  expect(newHand).toHaveLength(5);
  expect(deck).toHaveLength(45);
  expect(compare(newHand, ['AC', '6C', '3C', '7C', '5C'])).toBeTruthy();
});

it('sorts the hand by value', () => {
  const sorted = getSortedHand(['6S', '3S', '5S', '4H', '2S']);
  // prettier-ignore
  const expected = [
    { suit: 'S', value: 2 },
    { suit: 'S', value: 3 },
    { suit: 'H', value: 4 },
    { suit: 'S', value: 5 },
    { suit: 'S', value: 6 }
  ];
  expect(compare(sorted, expected)).toBeTruthy();

  const expectedFlush = [
    { suit: 'S', value: 2 },
    { suit: 'S', value: 4 },
    { suit: 'S', value: 7 },
    { suit: 'S', value: 10 },
    { suit: 'S', value: 12 }
  ];

  const flush = getSortedHand(['2S', '10S', 'QS', '4S', '7S']);
  expect(compare(flush, expectedFlush)).toBeTruthy();
});

it('determines a flush', () => {
  const flush = getSortedHand(['2S', '10S', 'QS', '4S', '7S']);
  expect(getFlush(flush)).toEqual(true);

  const straight = getSortedHand(['2S', '3S', '5S', '4H', '6S']);
  expect(getFlush(straight)).toEqual(false);
});

it('determines a straight', () => {
  const straight = getSortedHand(['6S', '10H', '7D', '9S', '8C']);
  expect(getStraight(straight)).toEqual(true);

  const highStraight = getSortedHand(['QS', '9C', 'KS', 'JH', '10D']);
  expect(getStraight(highStraight)).toEqual(true);

  const lowStraight = getSortedHand(['AS', '5C', '3S', '2H', '4D']);
  expect(getStraight(lowStraight)).toEqual(true);

  const flush = getSortedHand(['2S', '10S', 'QS', '4S', '7S']);
  expect(getStraight(flush)).toEqual(false);
});

it('determines high card', () => {
  const hand = getSortedHand(['QS', '7H', 'AD', '8S', '3C']);
  expect(flatten(getGroups(hand))).toEqual([]);
});

it('determines one pair', () => {
  const hand = getSortedHand(['6S', '7H', '8D', '7S', '10C']);
  expect(flatten(getGroups(hand))).toEqual([7, 7]);
});

it('determines two pair', () => {
  const hand = getSortedHand(['8S', '7H', '8D', '7S', '10C']);
  expect(flatten(getGroups(hand))).toEqual([7, 7, 8, 8]);
});

it('determines three of a kind', () => {
  const hand = getSortedHand(['8S', '7H', '8D', '8S', '10C']);
  expect(flatten(getGroups(hand))).toEqual([8, 8, 8]);
});

it('determines full house', () => {
  const hand = getSortedHand(['8S', '7H', '8D', '8S', '7C']);
  expect(flatten(getGroups(hand))).toEqual([7, 7, 8, 8, 8]);
});

it('determines four of a kind', () => {
  const hand = getSortedHand(['8S', '7H', '8D', '8S', '8C']);
  expect(flatten(getGroups(hand))).toEqual([8, 8, 8, 8]);
});

it('evaluate and discover a flush', () => {
  const isFlush = evaluate(['2S', '10S', 'QS', '4S', '7S']);
  expect(isFlush).toEqual('Flush');

  const isNotFlush = evaluate(['2S', '3S', '5S', '4H', '6S']);
  expect(isNotFlush).not.toEqual('Flush');
});

it('evaluate and discover a straight', () => {
  const isResult = evaluate(['JS', '10H', '7D', '9S', '8C']);
  expect(isResult).toEqual('Straight');

  const isNotResult = evaluate(['2S', '10S', 'QS', '4S', '7S']);
  expect(isNotResult).not.toEqual('Straight');
});

it('evaluate and discover a straight flush', () => {
  const isResult = evaluate(['JH', '10H', '7H', '9H', '8H']);
  expect(isResult).toEqual('Straight Flush');
});

it('evaluate and discover a royal flush', () => {
  const isResult = evaluate(['JH', '10H', 'AH', 'QH', 'KH']);
  expect(isResult).toEqual('Royal Flush');
});

it('evaluate and discover four of a kind', () => {
  const isResult = evaluate(['JH', '10H', 'JS', 'JD', 'JC']);
  expect(isResult).toEqual('Four of a Kind');
});

it('evaluate and discover a full house', () => {
  const isResult = evaluate(['JH', '10H', 'JS', '10D', 'JC']);
  expect(isResult).toEqual('Full House');

  const isResult2 = evaluate(['JH', '10H', 'JS', '10D', '10C']);
  expect(isResult2).toEqual('Full House');
});

it('evaluate and discover two pair', () => {
  const isResult = evaluate(['JH', '10H', 'JS', '10D', 'AC']);
  expect(isResult).toEqual('Two Pair');
});

it('evaluate and discover three of a kind', () => {
  const isResult = evaluate(['JH', '10H', 'JS', 'JD', 'AC']);
  expect(isResult).toEqual('Three of a Kind');
});

it('evaluate and discover one pair', () => {
  const isResult = evaluate(['JH', '10H', '3S', '10D', 'AC']);
  expect(isResult).toEqual('One Pair');
});

it('evaluate and discover jacks or better', () => {
  const isResult = evaluate(['JH', '10H', '3S', 'JD', 'AC']);
  expect(isResult).toEqual('Jacks or Better');
});

it('evaluate and discover high card', () => {
  const isResult = evaluate(['KH', '10H', '3S', 'JD', 'AC']);
  expect(isResult).toEqual('High Card');
});
