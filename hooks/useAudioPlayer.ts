import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';

interface UseAudioPlayerProps {
  onPlaybackStatusUpdate?: (status: any) => void;
}

export const useAudioPlayer = ({ onPlaybackStatusUpdate }: UseAudioPlayerProps = {}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playTrack = async (previewUrl: string) => {
    // Stop current track if playing
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (err) {
        console.error('Error stopping current track:', err);
      } finally {
        setSound(null);
        setIsPlaying(false);
      }
    }

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: previewUrl },
        { shouldPlay: true, volume: 1.0 }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setSound(null);
          } else if (status.isPlaying) {
            setIsPlaying(true);
          }
          onPlaybackStatusUpdate?.(status);
        }
      });
    } catch (err) {
      console.error('Error playing track:', err);
      setIsPlaying(false);
    }
  };

  const stopPlaying = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (err) {
        console.error('Error stopping sound:', err);
      } finally {
        setSound(null);
        setIsPlaying(false);
      }
    }
  };

  return {
    sound,
    isPlaying,
    playTrack,
    stopPlaying,
  };
};
