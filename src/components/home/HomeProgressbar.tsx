// 프로그래스 바 컴포넌트
export const ProgressBar: React.FC<{ step: number }> = ({ step }) => {
  return (
    <div className="mb-4 flex w-full justify-center gap-2">
      {/* -------------------프로그래스 바 1단계 ---------------------- */}
      <div className="h-2 w-1/2 rounded-full bg-gray-300">
        <div
          className={`h-2 rounded-full bg-[#80FFB2] transition-all duration-300 ease-in-out ${step === 1 || step === 2 ? 'w-full' : 'w-0'}`}
        ></div>
      </div>
      {/* -------------------프로그래스 바 2단계 ---------------------- */}
      <div className="h-2 w-1/2 rounded-full bg-gray-300">
        <div
          className={`h-2 rounded-full bg-[#80FFB2] transition-all duration-300 ease-in-out ${step === 2 ? 'w-full' : 'w-0'}`}
        ></div>
      </div>
    </div>
  );
};
