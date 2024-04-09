import React from 'react';

interface KeywordTitleProps {
  headText: string;
  highlightText: string;
  tailText: string;
}

const KeywordTitle: React.FC<KeywordTitleProps> = ({
  headText,
  highlightText,
  tailText,
}) => (
  <div className="mb-2 flex w-full justify-start">
    <h1 className="mb-4 mt-1 text-4xl font-bold text-white">
      {headText} <span className="text-[#00FF66]">{highlightText}</span>
      <br />
      {tailText}
    </h1>
  </div>
);

export default KeywordTitle;
