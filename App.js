import { createAppContainer } from 'react-navigation';
import { createStackNavigator, StackViewTransitionConfigs } from 'react-navigation-stack';
import MainApp from './src/components/screens/MainApp';
import SplashScreen from './src/components/screens/SplashScreen';


const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

const MainNavigator = createStackNavigator({
    Splash: {
        screen: SplashScreen
    },
    Home: {
        screen: MainApp
    }
}, {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
            transitionSpec: {
                open: config,
                close: config,
            }
        }
});

const App = createAppContainer(MainNavigator);

export default App;