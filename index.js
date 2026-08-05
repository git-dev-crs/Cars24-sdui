import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('TempApp', () => App);
AppRegistry.registerComponent('Cars24SDUI', () => App);
