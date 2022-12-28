import { BestHand } from '../utils';

function Scoreboard({
  result,
  bank,
  bet,
  won
}: {
  result: BestHand | null;
  bank: number;
  bet: number;
  won: number;
}) {
  return (
    <div className="scoreboard">
      <div className="result">{result}</div>
      <div className="bank">Bank: ${bank}</div>
      <div className="bet">Bet: ${bet}</div>
      <div className="won">Won: ${won}</div>
    </div>
  );
}

export default Scoreboard;
