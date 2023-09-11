import "react-native-gesture-handler";
// Polyfill for URLSearchParams
import "react-native-url-polyfill/auto";
import { registerRootComponent } from 'expo';
import App from './src/App';

registerRootComponent(App);
