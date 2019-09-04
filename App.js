import React, { Component } from 'react';
// import { StatusBar } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as AppProvider } from 'react-redux';

import store from './src/redux/store';

import ChooseTable from './src/screens/ChooseTable';
import ChooseMenu from './src/screens/ChooseMenu';
import OrderDone from './src/screens/OrderDone';

import theme from './src/assets/styles/theme';

const StackNavigator = createStackNavigator(
  {
    Table: {
      screen: ChooseTable
    },
    Menu: {
      screen: ChooseMenu
    },
    OrderDone: {
      screen: OrderDone
    }
  },
  {
    initialRouteName: 'Table',
    defaultNavigationOptions: {
      header: null
    }
  }
)

const AppContainer = createAppContainer(StackNavigator)

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