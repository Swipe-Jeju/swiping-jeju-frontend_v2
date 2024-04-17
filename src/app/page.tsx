'use client';

import { animate, motion } from 'framer-motion';
import React, { MutableRefObject, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';

import SwipeCard from '@/components/swiper/SwipeCard';
import { ICardData } from '@/interfaces/swipe';

const db: ICardData[] = [
  {
    title: '성산어물정',
    img: '/images/0.jpeg',
    lng: 126.917306236842,
    lat: 33.4395648227551,
    content: `성산일출봉과 섭지코지 사이에 위치한 저희 제주 어물전은 제주도 특산물인 고등어회,딱새우회, 제주 갈치회 전문점으로 싱싱한 활어회와 함께 푸짐한 한상을 준비하였습니다. 주차 편의시설 또한 넓어서 불편함 없이 이용가능하십니다.`,
    keyword: ['성산일출봉', '전통시장', '해변'],
    placeId: '1',
  },
  {
    title: '어조횟집',
    img: '/images/1.jpeg',
    lng: 126.930809833027,
    lat: 33.4604386103906,
    content: `제주도 맛집 리스트 고민중이셨나요??
    제주 동쪽 가볼만한 곳 검색 후
    성산일출봉을 일정에 추가하셨다면
    꼭 방문해야할 성신맛집입니다!`,
    keyword: ['먹거리', '전통시장', '감귤체험'],
    placeId: '2',
  },
  {
    title: '호랑호랑카페',
    img: '/images/2.jpeg',
    lng: 126.921633330756,
    lat: 33.4495800115369,
    content: `제주도 핫플레이스 루프탑카페 ! 성산일출봉 오션뷰 카페 호랑호랑 입니다.
    전용비치를 보유하고있어 낮에는 포근한 햇살과, 밤에는 은은한 조명의 야경이 아름다운곳 입니다`,
    keyword: ['카페', '테마파크', '포토스팟'],
    placeId: '3',
  },
  {
    title: '삼다도식당',
    img: '/images/3.jpeg',
    lng: 126.915845324691,
    lat: 33.4484446960871,
    content: `성산일출봉근처에 위치한 갈치,고등어요리 전문점입니다!
    내 가족들이 먹는다고 생각하고 항상 깨끗하게 재료 손질하여 안심하고 드실 수 있습니다.
    지역주민들이 더 추천하는 로컬맛집!! 밑반찬최고!! 갈치조림맛집을 찾는다면 '삼다도식당'으로 오세요.`,
    keyword: ['먹거리', '전통시장', '한라산'],
    placeId: '4',
  },
];

const MainPage = () => {
  const [trash, setTrash] = useState<MutableRefObject<null>[]>([]);

  const restoreCard = async () => {
    const lastIndex = trash.length - 1;
    animate(trash[lastIndex].current, {
      x: 0,
      opacity: 1,
      transition: { duration: 1, ease: 'easeInOut' },
    });
    setTrash((prev) => prev.slice(0, -1));
  };

  const [rightMotionValue, setRightMotionValue] = useState<number>(0);
  const [leftMotionValue, setLeftMotionValue] = useState<number>(0);
  const swiped = (ref: React.MutableRefObject<null>) => {
    setTrash([...trash, ref]);
    setRightMotionValue(0);
    setLeftMotionValue(0);
  };

  const handleMotionValue = (dir: 'right' | 'left', m: number) => {
    if (dir === 'right') {
      setLeftMotionValue(0);
      setRightMotionValue(m);
    } else {
      setLeftMotionValue(m);
      setRightMotionValue(0);
    }
  };

  return (
    <section className="flex h-screen w-full flex-col items-center justify-center gap-2 bg-white">
      <div className="relative flex h-[500px] w-[300px] items-center justify-center bg-red-400">
        {db.map((item, index) => (
          <SwipeCard
            key={index}
            onLeftMotionValue={(m) => handleMotionValue('left', m)}
            onRightMotionValue={(m) => handleMotionValue('right', m)}
            onSwiped={swiped}
          >
            <div
              className={`h-[500px] w-[300px] rounded-lg ${index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'}`}
            ></div>
          </SwipeCard>
        ))}
      </div>
      <button
        type="button"
        onClick={async () => await restoreCard()}
        disabled={trash.length === 0}
        className="bg-yellow-400 px-4 py-2"
      >
        Undo
      </button>
      <div className="flex h-[60px] w-full justify-around bg-red-50">
        <motion.div
          className="flex size-10 items-center justify-center bg-white p-4 text-lg text-red-400"
          initial={{ y: -1000, opacity: 0, scale: 0 }}
          animate={{
            y: leftMotionValue * 100,
            opacity: leftMotionValue * -1,
            scale: leftMotionValue * -1,
          }}
        >
          <GrClose />
        </motion.div>
        <motion.div
          className="flex size-10 items-center justify-center bg-white p-4 text-green-400"
          initial={{ y: -1000, opacity: 0, scale: 0 }}
          animate={{
            y: rightMotionValue * -100,
            opacity: rightMotionValue,
            scale: rightMotionValue,
          }}
          exit={{ y: -1000, opacity: 0 }}
        >
          <FaCheck className="size-[16px]" />
        </motion.div>
      </div>
    </section>
  );
};

export default MainPage;
