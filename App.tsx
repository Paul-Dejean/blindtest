import { BlindTestGame } from 'components/BlindTestGame';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import './global.css';
import { EqualizerAnimation } from 'components/EqualizerAnimation';

export default function App() {
  return (
    <View className="flex-1">
      <BlindTestGame />
      <StatusBar style="auto" />
      {/* <EqualizerAnimation isPlaying={true} /> */}
    </View>
  );
}
