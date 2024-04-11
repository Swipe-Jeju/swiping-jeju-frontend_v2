// Import necessary modules and types
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { GrPowerReset } from 'react-icons/gr';

import Loading from '@/components/common/Loading';
import { useAppDataStore } from '@/context/store';
import { useKeywords } from '@/hooks/home/useKeywords';
import { useMutate } from '@/hooks/useMutate';
import {
  AlbumApplyRequest,
  AlbumResponse,
  HomeKeywordInputProps,
} from '@/interfaces/home/home';
import { log } from '@/utils/log';

import NextButton from '../common/NextButton';
import { ProgressBar } from './HomeProgressbar';
import KeywordTitle from './HomeTitle';

const HomeKeywordInput: React.FC<HomeKeywordInputProps> = ({
  swipingAlbum,
  setSwipingAlbum,
  step,
}) => {
  const [inputText, setInputText] = useState('');

  // 커스텀 훅(useKeywords)
  const { randomKeywords, refreshKeywords } = useKeywords(10);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetKeyword = async () => {
    try {
      const result = await axios
        .post('/api/keywords', { question: inputText })
        .then((res) => res.data);

      const keywords = result.response.split(', ');

      return keywords;
    } catch (error) {
      console.error('API 호출 에러: ', error);
    }
  };

  const { trigger: getCollections, isLoading } = useMutate<
    AlbumApplyRequest,
    AlbumResponse
  >('/album/apply', 'POST');

  // 제출
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const updatedAlbum = {
      ...swipingAlbum,
      title: inputText,
    };

    // 상태 업데이트
    setSwipingAlbum(updatedAlbum);

    // 키워드랑 지도 push 하기
    const keywords = await handleGetKeyword();

    // 키워드 토대로 id, hotplaceList 받아오기
    const response = await getCollections({
      mapList: [4, 5, 6, 7],
      keywordList: keywords,
    });

    if (response) {
      const { id, hotPlaceList } = response;
      useAppDataStore.getState().setAppData({ id, hotPlaceList });
      log('data :', response);
    }

    // data 불러오기

    // 키워드 추가
    // POST /api/keywords

    router.push('/swiping');

    setIsSubmitting(false);
    log('submitAlbum' + swipingAlbum);
  };

  return (
    <>
      <div className="flex size-full flex-col items-center justify-center space-y-4 p-11">
        {ProgressBar({ step })}
        <KeywordTitle
          headText="어떤"
          highlightText="여행을"
          tailText="하고싶나요?"
          etc1="여행의 목적"
          etc2="을 알려주세요!"
        />
        <span className="text-xs">
          스와이프가 끝나면 여행 목적을 달성할 수 있을지 알려드려요.
        </span>
        <input
          type="text"
          className="w-full rounded-[10px] border border-green-500 bg-white px-4 py-3 text-xs font-medium text-gray-900 "
          placeholder="ex. 맛있는 고기국수가 있다고 해서 먹어보고 싶어"
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          maxLength={30}
        />
        <div className="flex  w-full justify-end  text-xs text-white">
          {inputText.length} / 30
        </div>
        {/* --------------------------------------------------------- */}
        {/* --------------------새로 고침/ 키워드 ---------------------- */}
        {/* --------------------------------------------------------- */}
        {/* <h1 className="w-full font-bold text-white text-2xl">
          방문하고 싶은 관광지들을 <br />
          키워드로 선택해 주세요!
        </h1> */}
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
        <NextButton onClick={handleSubmit} text={'스와이프 시작하기 '} />
      </div>

      {(isLoading || isSubmitting) && <Loading />}
    </>
  );
};

export default HomeKeywordInput;
