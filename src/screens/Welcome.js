import React, { Component } from 'react'
import { View, Text, Image, StatusBar } from 'react-native'

import theme from '../assets/styles/theme'

export default class Welcome extends Component {
  constructor() {
    super()
    this.redirectToChooseTable()
  }

  redirectToChooseTable = () => {
    setInterval(() => {
      this.props.navigation.navigate('MainApp')
    }, 3000)
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primary}}>
        <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
        <Image source={require('../assets/images/icon-white.png')} style={{width: 200, height: 200}} />
        <Text style={{marginTop: 8, fontSize: 36, color: 'white', fontFamily: 'Montserrat-SemiBold'}}>KEDAI KITO</Text>
      </View>
    )
  }
}
