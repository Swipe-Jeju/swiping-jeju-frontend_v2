import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { FC, HTMLAttributes, MutableRefObject, ReactNode, useRef } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onRightMotionValue?: (motionValue: number) => void;
  onLeftMotionValue?: (motionValue: number) => void;
  onSwiped?: (ref: MutableRefObject<null>) => void;
  rightTransForm?: { inputRange: number[]; outputRange: number[] };
  leftTransForm?: { inputRange: number[]; outputRange: number[] };
  rotateTransForm?: { inputRange: number[]; outputRange: number[] };
  moveRange?: number;
  className?: string;
}

export type RefProps = HTMLDivElement;

const SwipeCard: FC<Props> = ({
  children,
  onRightMotionValue,
  onLeftMotionValue,
  onSwiped,
  rightTransForm: {
    inputRange: rightInputRange,
    outputRange: rightOutputRange,
  } = {
    inputRange: [10, 100],
    outputRange: [0, 1],
  },
  leftTransForm: {
    inputRange: leftInputRange,
    outputRange: leftOutputRange,
  } = {
    inputRange: [-10, -100],
    outputRange: [0, -1],
  },
  rotateTransForm: {
    inputRange: rotateInputRange,
    outputRange: rotateOutputRange,
  } = {
    inputRange: [-100, 0, 100],
    outputRange: [-10, 0, 10],
  },
  moveRange = 500,
  className = '',
}) => {
  const x = useMotionValue(0);
  const cardRef = useRef(null);

  const handleswipe = async (dir: 'right' | 'left') => {
    onSwiped && onSwiped(cardRef);
    await animate(cardRef.current, {
      x: dir === 'left' ? -moveRange : moveRange,
      opacity: 0,
      transition: { duration: 1, ease: 'easeInOut' },
    });
  };

  const rotate = useTransform(x, rotateInputRange, rotateOutputRange);
  const rightValue = useTransform(x, rightInputRange, rightOutputRange);
  const leftValue = useTransform(x, leftInputRange, leftOutputRange);

  return (
    <motion.div
      ref={cardRef}
      className={`absolute left-0 top-0 ${className}`}
      whileDrag={{ boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.4)' }}
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      dragMomentum={false}
      onDrag={(_, info) => {
        if (info.offset.x > 0) {
          onRightMotionValue && onRightMotionValue(rightValue.get());
        } else {
          onLeftMotionValue && onLeftMotionValue(leftValue.get());
        }
      }}
      onDragEnd={async (event, info) => {
        if (info.offset.x > 100) {
          await handleswipe('right');
        } else if (info.offset.x < -100) {
          await handleswipe('left');
        }
        onRightMotionValue && onRightMotionValue(0);
        onLeftMotionValue && onLeftMotionValue(0);
      }}
    >
      {children}
    </motion.div>
  );
};

export default SwipeCard;
