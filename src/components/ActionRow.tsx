function ActionRow({
  handleDraw,
  status,
  handleBet
}: {
  handleDraw: () => null;
  status: string;
  handleBet: (val: number) => null;
}) {
  return (
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
  );
}

export default ActionRow;
