import Card from './Card';

function Hand({
  hand,
  discards,
  handleSelect
}: {
  hand: string[];
  discards: string[];
  handleSelect: (value: string) => void;
}) {
  return (
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
  );
}

export default Hand;
