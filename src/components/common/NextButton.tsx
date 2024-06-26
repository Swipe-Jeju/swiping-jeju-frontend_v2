import React from 'react';

interface NextButtonProps {
  onClick: () => void; // Define other props as needed
  text: string;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick, text }) => {
  return (
    <div className="fixed inset-x-0 bottom-5 flex w-full items-center justify-center pb-4">
      <button
        className="mx-10 h-12 w-full max-w-sm cursor-pointer rounded-lg border border-[#00FF66] bg-[#80FFB2] text-center text-xl font-black text-gray-800"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default NextButton;
