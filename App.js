import React, { Component } from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as AppProvider } from 'react-redux';

import store from './src/redux/store';

import WelcomeScreen from './src/screens/Welcome'
import ChooseTable from './src/screens/ChooseTable';
import ChooseMenu from './src/screens/ChooseMenu';
import OrderDetail from './src/screens/OrderDetail';
import ViewBill from './src/screens/ViewBill';
import OrderDone from './src/screens/OrderDone';

import theme from './src/assets/styles/theme';

const StackNavigator = createStackNavigator(
  {
    Table: { screen: ChooseTable },
    Menu: { screen: ChooseMenu },
    OrderDetail: { screen: OrderDetail },
    ViewBill: { screen: ViewBill },
    OrderDone: { screen: OrderDone },
  },
  {
    initialRouteName: 'Table',
    defaultNavigationOptions: {
      header: null
    }
  }
)

const SwitchNavigator = createSwitchNavigator(
  {
    Welcome: { screen: WelcomeScreen },
    MainApp: StackNavigator,
  },
)

const AppContainer = createAppContainer(SwitchNavigator)

export default class App extends Component {
  render() {
    return (
      <AppProvider store={store}>
        <PaperProvider theme={theme}>
          <AppContainer />
        </PaperProvider>
      </AppProvider>
    )
  }
}