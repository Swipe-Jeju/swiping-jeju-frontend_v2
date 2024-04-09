import React from 'react';

interface KeywordTitleProps {
  headText: string;
  highlightText: string;
  tailText: string;
  etc1?: string;
  etc2?: string;
}

const KeywordTitle: React.FC<KeywordTitleProps> = ({
  headText,
  highlightText,
  tailText,
  etc1,
  etc2,
}) => (
  <div className="mb-0 flex w-full justify-start">
    <h1 className="mt-1 text-2xl font-bold text-white">
      {headText} <span className="text-[#80FFB2]">{highlightText}</span>
      {tailText}
      {etc1 && (
        <span className="text-[#80FFB2]">
          <br />
          {etc1}
        </span>
      )}
      {etc2 && etc2}
    </h1>
  </div>
);

export default KeywordTitle;
