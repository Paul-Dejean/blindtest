import { Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useState, useEffect, useRef } from 'react';

interface UseAudioPlayerProps {
  onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
}

export const useAudioPlayer = ({ onPlaybackStatusUpdate }: UseAudioPlayerProps = {}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track URL currently loaded
  const currentTrackRef = useRef<string | null>(null);

  // Initialize audio session on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    }).catch((err) => {
      console.error('Failed to initialize audio session:', err);
    });

    // Cleanup on unmount
    return () => {
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const playTrack = async (previewUrl: string) => {
    setError(null);

    // If we're already playing this track, don't reload it
    if (currentTrackRef.current === previewUrl && sound && isPlaying) {
      return;
    }

    // Clean up any previous sound
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (err) {
        console.error(`Error stopping track:`, err);
      }
      setSound(null);
    }

    // Set current track
    currentTrackRef.current = previewUrl;

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: previewUrl },
        { shouldPlay: true, volume: 1.0 },
        handleStatusUpdate
      );

      setSound(newSound);
    } catch (err) {
      console.error(`Error playing track:`, err);

      setError(`Error playing track: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleStatusUpdate = (status: AVPlaybackStatus) => {
    // console.log('****** handleStatusUpdate : ', status);
    if (!status.isLoaded) {
      if (status.error) {
        setError(`Playback error: ${status.error}`);
        setIsPlaying(false);
      }
      return;
    }

    if (status.didJustFinish) {
      setIsPlaying(false);
    } else if (status.isPlaying) {
      setIsPlaying(true);
    }

    // Forward the status update to any external handler
    onPlaybackStatusUpdate?.(status);
  };

  const stopTrack = async () => {
    if (!sound) return;

    try {
      await sound.stopAsync();
      await sound.unloadAsync();
    } catch (err) {
      console.error(`Error stopping track:`, err);
    }

    setSound(null);
    currentTrackRef.current = null;
  };

  return {
    sound,
    isPlaying,
    error,
    playTrack,
    stopTrack,
  };
};
