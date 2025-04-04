import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface EqualizerAnimationProps {
  isPlaying: boolean;
  height?: number;
}

interface BarProps {
  index: number;
  maxHeight: number;
  color: string;
}

function Bar({ index, maxHeight, color }: BarProps) {
  // Random values for each bar
  const initialDelay = Math.random() * 1000; // Random initial delay between 0-1000ms
  const randomDelay = 30 + Math.random() * 40; // Random delay between 30-70ms
  const randomDuration = 800 + Math.random() * 400; // Random duration between 800-1200ms
  const randomHeight1 = 0.6 + Math.random() * 0.4; // Random height between 60-100%
  const randomHeight2 = 0.1 + Math.random() * 0.2; // Random height between 10-30%

  const animatedStyle = useAnimatedStyle(() => ({
    height: withRepeat(
      withSequence(
        withDelay(
          initialDelay + randomDelay,
          withTiming(maxHeight * randomHeight1, {
            duration: randomDuration,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        withTiming(maxHeight * randomHeight2, {
          duration: randomDuration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    ),
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function EqualizerAnimation({ isPlaying, height = 100 }: EqualizerAnimationProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: 30 }, (_, i) => (
        <Bar key={i} index={i} maxHeight={height} color="#00ff00" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    gap: 3,
  },
  bar: {
    width: 4,
    borderRadius: 2,
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 15,
  },
});
