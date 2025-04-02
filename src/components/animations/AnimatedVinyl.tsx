import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// const { width, height } = Dimensions.get('window');
const NUM_GROOVES = 50;

interface AnimatedVinylProps {
  isPlaying: boolean;
}

export function AnimatedVinyl({ isPlaying = false }: AnimatedVinylProps) {
  const rotation = useSharedValue(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Debug logging
  useEffect(() => {
    console.log('AnimatedVinyl isPlaying:', isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    // Cancel any existing animation
    cancelAnimation(rotation);

    // Only animate when isPlaying is true
    if (isPlaying) {
      console.log('Starting vinyl animation');
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 4000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      console.log('Stopping vinyl animation');
    }

    return () => {
      cancelAnimation(rotation);
    };
  }, [isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    opacity: 1, // Slightly reduce opacity when buffering
  }));

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <View
          style={styles.vinylContainer}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setContainerSize({ width, height });
          }}>
          <Animated.View
            style={[
              styles.vinyl,
              animatedStyle,
              {
                width: Math.min(containerSize.width, containerSize.height) * 0.9,
                height: Math.min(containerSize.width, containerSize.height) * 0.9,
              },
            ]}>
            <View style={styles.outerRing} />
            {[...Array(NUM_GROOVES)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.groove,
                  {
                    width: '100%',
                    height: '100%',

                    borderRadius: 9999,
                    borderWidth: 0.5,
                    borderColor: '#444',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: [{ scale: 1 - (i / NUM_GROOVES) * 0.5 }],
                  },
                ]}
              />
            ))}
            <View style={styles.label}>
              <View style={styles.labelInner}>
                <View style={styles.labelText}>
                  <View style={styles.labelLine} />
                  <View style={styles.labelLine} />
                  <View style={styles.labelLine} />
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    zIndex: -1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vinylContainer: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vinyl: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  outerRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#333',
  },
  groove: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  label: {
    width: '40%',
    aspectRatio: 1,
    borderRadius: 9999,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelInner: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 9999,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    width: '80%',
    alignItems: 'center',
  },
  labelLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#444',
    marginVertical: 4,
    borderRadius: 1,
  },
});
