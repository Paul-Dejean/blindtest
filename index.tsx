import { registerRootComponent } from 'expo';
import { enableScreens } from 'react-native-screens';
import App from './App';

// Enable native screens for better performance
enableScreens();

registerRootComponent(App);
