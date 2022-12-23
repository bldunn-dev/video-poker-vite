import React from 'react';

type CardProps = {
  value: string;
  isSelected: boolean;
  handleSelect: (value: string) => void;
};

const Card = ({ value, isSelected, handleSelect }: CardProps) => {
  return (
    <div
      className={`card${isSelected ? ' selected' : ''}`}
      onClick={() => handleSelect(value)}
    >
      <img src={`/images/${value}.svg`} alt={value} />
    </div>
  );
};

export default Card;
