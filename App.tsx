import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import './global.css';
import { View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 bg-black">
      <AppNavigator />
      <StatusBar style="light" />
    </View>
  );
}
