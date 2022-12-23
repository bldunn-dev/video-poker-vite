import './styles.css';
import { useState } from 'react';
import Card from './Card';
import {
  addOrRemove,
  shuffledDeck,
  deal,
  redraw,
  evaluate,
  calculate,
  BestHand
} from './utils';

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
      <div className="scoreboard">
        <div className="result">{result}</div>
        <div className="bank">Bank: ${bank}</div>
        <div className="bet">Bet: ${bet}</div>
        <div className="won">Won: ${won}</div>
      </div>
      <div className="card-table">
        <div className="hand">
          {hand.map((value) => (
            <Card
              key={value}
              value={value}
              handleSelect={() => handleSelect(value)}
              isSelected={discards.includes(value)}
            />
          ))}
        </div>
        <div className="action-row">
          <button onClick={handleDraw} disabled={status === 'finished'}>
            Draw
          </button>
          <div className="bets">
            <span>BET: </span>
            {[5, 10, 15, 20, 25].map((val) => (
              <button
                key={val}
                onClick={() => handleBet(val)}
                disabled={status === 'initial'}
              >
                ${val}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
