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
      {/*Adding the explicit URL to make this images display on GitHub Pages (can figure out the reason later)*/}
      <img
        src={`https://bldunn-dev.github.io/video-poker-vite/images/${value}.svg`}
        alt={value}
      />
    </div>
  );
};

export default Card;
