import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import { List } from 'react-native-paper'
import { Button, Container, Content, Header, Body, Icon } from 'native-base'
import { connect } from 'react-redux'

import * as actionOrder from '../redux/actions/order'

import theme from '../assets/styles/theme'

class OrderDetail extends Component {
  constructor() {
    super()
  }

  render() {
    const colorPrimary = theme.colors.primary
    return (
      <Container>
        <Header androidStatusBarColor={colorPrimary} style={{backgroundColor: 'white'}}>
          <Body style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontFamily: 'Montserrat-SemiBold', marginLeft: 8 }}>Bill Detail</Text>
          </Body>
        </Header>

        <Content>
          <View style={{ backgroundColor: 'white', paddingHorizontal: 8, paddingVertical: 16 }}>
            {this.props.orders.data.map((item, index) =>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 4}}>
                <Text style={{fontWeight: 'bold', color: item.status == 0 ? 'tomato' : 'teal'}}>{item.status == 0 ? 'WAITING' : 'SENT'}</Text>
                <Text>{item.name}</Text>
                <Text>x{item.qty}</Text>
              </View>
            )}
          </View>
        </Content>

        <View style={{ backgroundColor: 'white', elevation: 12, padding: 16 }}>
          <View style={{ fontWeight: 'bold', borderBottomWidth: 2, paddingBottom: 8, borderColor: colorPrimary, marginBottom: 4, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Meja : 6</Text>
            <Text>17 : 45</Text>
          </View>

          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Sub Total</Text>
              <Text>Rp 51.000</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Discount</Text>
              <Text>Rp 10.000</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Service Charge</Text>
              <Text>Rp 5.000</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Tax</Text>
              <Text>Rp 1.000</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text style={{ fontWeight: 'bold' }}>TOTAL</Text>
              <Text style={{ fontWeight: 'bold' }}>Rp 47.000</Text>
            </View>
          </View>

          <Button style={{ backgroundColor: colorPrimary, justifyContent: 'center', borderRadius: 8 }} onPress={() => this.props.navigation.navigate('OrderDone')}>
            <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold' }}>CALL BILL</Text>
          </Button>
        </View>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    orders: state.orders,
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)