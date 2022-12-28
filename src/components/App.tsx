import '../styles.css';
import { useState } from 'react';
import Scoreboard from './Scoreboard';
import Hand from './Hand';
import {
  addOrRemove,
  shuffledDeck,
  deal,
  redraw,
  evaluate,
  calculate,
  BestHand
} from '../utils';
import ActionRow from './ActionRow';

function App() {
  const [status, setStatus] = useState('finished');
  const [discards, setDiscards] = useState<string[]>([]);
  const [deck, setDeck] = useState<string[]>(shuffledDeck());
  const [hand, setHand] = useState<string[]>([]);
  const [result, setResult] = useState<BestHand | null>(null);
  const [bet, setBet] = useState<number>(0);
  const [won, setWon] = useState<number>(0);
  const [bank, setBank] = useState<number>(100);

  const handleSelect = (value: string) => {
    setDiscards(addOrRemove(discards, value));
  };

  const handleDraw = () => {
    const finalHand = redraw(hand, discards, deck);
    const result = evaluate(finalHand);
    setHand(finalHand);
    setResult(result);
    const winnings = calculate(result, bet);
    setWon(winnings);
    setBank(bank + winnings);
    setStatus('finished');
  };

  const handleBet = (value = 5) => {
    const shuffled = shuffledDeck();
    setDeck(shuffled);
    setHand(deal(shuffled, 5));
    setDiscards([]);
    setStatus('initial');
    setResult(null);
    setBet(value);
    setBank(bank - value);
  };

  return (
    <div className="App">
      <Scoreboard result={result} bank={bank} bet={bet} won={won} />
      <div className="card-table">
        <Hand hand={hand} discards={discards} handleSelect={handleSelect} />
        <ActionRow
          handleDraw={handleDraw}
          status={status}
          handleBet={handleBet}
        />
        <div className="instructions">
          <ul>
            <li>To start a hand, click the amount you wish to bet.</li>
            <li>
              Click on the cards you wish to discard. They will turn grey.
            </li>
            <li>Click "Draw" to see your new cards and the result.</li>
            <li>Win big!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
