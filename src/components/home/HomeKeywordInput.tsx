// Import necessary modules and types
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { GrPowerReset } from 'react-icons/gr';

import Loading from '@/components/common/Loading';
import { useKeywords } from '@/hooks/home/useKeywords';
import { HomeKeywordInputProps } from '@/interfaces/home/home';

import NextButton from '../common/NextButton';
import KeywordTitle from './HomeTitle';

const HomeKeywordInput: React.FC<HomeKeywordInputProps> = ({
  swipingAlbum,
  setSwipingAlbum,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 커스텀 훅(useKeywords)
  const { randomKeywords, refreshKeywords } = useKeywords(10);
  const router = useRouter();

  const handleGetKeyword = async () => {
    try {
      const result = await axios
        .post('/api/keywords', { question: inputText })
        .then((res) => res.data);

      const keywords = result.response.split(', ');

      console.log('API 호추 결과: ', keywords);
      router.push('/swiping');
    } catch (error) {
      console.error('API 호출 에러: ', error);
    }
  };

  // 제출
  const handleSubmit = async () => {
    setIsLoading(true);

    const updatedAlbum = {
      ...swipingAlbum,
      title: inputText,
    };

    // 상태 업데이트
    setSwipingAlbum(updatedAlbum);

    await handleGetKeyword();

    setIsLoading(false);
    console.log('submitAlbum' + swipingAlbum);
  };
  return (
    <>
      <div className="flex size-full flex-col items-center justify-center space-y-4 p-11">
        <KeywordTitle text1="어떤" text2="장소를" text3="추천 받고 싶으세요?" />
        <input
          type="text"
          className="w-full rounded-full border border-green-500 bg-white px-4 py-2 text-base font-medium text-gray-900"
          placeholder="ex. 맛있는 고기국수가 있다고 해서 먹어보고 싶어"
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          maxLength={30}
        />
        <div className="flex justify-end font-medium text-white">
          {inputText.length} / 30
        </div>
        {/* --------------------------------------------------------- */}
        {/* --------------------새로 고침/ 키워드 ---------------------- */}
        {/* --------------------------------------------------------- */}
        <div className="mt-5 flex flex-wrap gap-2">
          {randomKeywords.map((keyword, idx) => (
            <button
              key={idx}
              className="cursor-pointer rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-800"
              onClick={() => {
                // Handle keyword addition
                if (inputText.length + keyword.length > 30) {
                  alert('30자 이하로 입력해주세요');
                  return;
                }
                if (inputText.length === 0) {
                  setInputText(keyword);
                  return;
                } else {
                  setInputText(`${inputText}, ${keyword}`);
                }
              }}
            >
              {keyword}
            </button>
          ))}
        </div>
        {/* --------------------------------------------------------- */}
        {/* --------------------refresh Button ---------------------- */}
        {/* --------------------------------------------------------- */}
        <button
          className="mt-4 flex items-center rounded-full border border-green-500 px-5 py-2 text-white"
          onClick={() => {
            refreshKeywords(10);
          }}
        >
          <GrPowerReset />
          <span className="ml-2">새로 고침</span>
        </button>
        {/* --------------------------------------------------------- */}
        {/* -----------------------Next Button ---------------------- */}
        {/* --------------------------------------------------------- */}
        <NextButton onClick={handleSubmit} text={'추천 받기 '} />
      </div>

      {isLoading && <Loading />}
    </>
  );
};

export default HomeKeywordInput;
