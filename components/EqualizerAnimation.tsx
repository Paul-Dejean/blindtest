import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface EqualizerAnimationProps {
  isPlaying: boolean;
}

const createEqualizerAnimation = () => {
  const duration = 300 + Math.random() * 400; // 300–700ms
  const minHeight = 10;
  const maxHeight = 30;

  return withRepeat(
    withTiming(maxHeight, { duration }),
    -1,
    true // yoyo effect (up and down)
  );
};

export const EqualizerAnimation = ({ isPlaying }: EqualizerAnimationProps) => {
  const height1 = useSharedValue(10);
  const height2 = useSharedValue(10);
  const height3 = useSharedValue(10);
  const height4 = useSharedValue(10);

  useEffect(() => {
    if (!isPlaying) {
      height1.value = 10;
      height2.value = 10;
      height3.value = 10;
      height4.value = 10;
      return;
    }

    height1.value = createEqualizerAnimation();
    height2.value = createEqualizerAnimation();
    height3.value = createEqualizerAnimation();
    height4.value = createEqualizerAnimation();
  }, [isPlaying]);

  const useCreateAnimatedProps = (height: Animated.SharedValue<number>) =>
    useAnimatedProps(() => ({
      height: height.value,
      y: 40 - height.value,
    }));

  const animatedProps1 = useCreateAnimatedProps(height1);
  const animatedProps2 = useCreateAnimatedProps(height2);
  const animatedProps3 = useCreateAnimatedProps(height3);
  const animatedProps4 = useCreateAnimatedProps(height4);

  return (
    <View className="h-12 w-16 flex-row items-center justify-center space-x-1">
      <Svg height="40" width="60">
        <AnimatedRect x={0} width="10" fill="#1DB954" rx="2" animatedProps={animatedProps1} />
        <AnimatedRect x={15} width="10" fill="#1DB954" rx="2" animatedProps={animatedProps2} />
        <AnimatedRect x={30} width="10" fill="#1DB954" rx="2" animatedProps={animatedProps3} />
        <AnimatedRect x={45} width="10" fill="#1DB954" rx="2" animatedProps={animatedProps4} />
      </Svg>
    </View>
  );
};
