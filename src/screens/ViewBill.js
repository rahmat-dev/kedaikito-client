import React, { Component } from 'react'
import { Text, View, BackHandler } from 'react-native'
import { Button, Container, Content, Header, Body } from 'native-base'
import { connect } from 'react-redux'
import Axios from 'axios'

import config from '../config'
import theme from '../assets/styles/theme'
import priceFormat from '../utils/priceFormat'

import * as actionTimer from '../redux/actions/timer'

class OrderDetail extends Component {
  constructor() {
    super()

    this.state = {
      timer: null
    }
  }

  async componentDidMount() {
    setTimeout(() => {
      this.props.orders.data.map(item => {
        Axios.patch(`${config.API_URL}/orders/${item.transactionId}/${item.menuId}`, { status: 1 }).then(res => item.status = res.data.status)
      })
    }, 10000)


    this.props.orders.data.map(item => {
      Axios.post(`${config.API_URL}/orders`, { ...item, price: item.totalPrice })
    })

    this.setState({ timer: this.props.timers.timerFormat })
    this.props.transactions.finishedTime = this.props.timers.timerFormat

    await Axios.patch(`${config.API_URL}/transactions/${this.props.transactions.data.id}`, {
      finishedTime: this.props.timers.timerFormat
    })
  }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', null);
  // }

  handleBackButton() {
    alert('Harap selesaikan pembayaran terlebih dahulu');
    return true;
  }

  render() {
    const colorPrimary = theme.colors.primary
    const transactions = this.props.transactions.data

    return (
      <Container>
        <Header androidStatusBarColor={colorPrimary} style={{ backgroundColor: 'white' }}>
          <Body style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontFamily: 'Montserrat-SemiBold', marginLeft: 8 }}>Bill Detail</Text>
          </Body>
        </Header>

        <Content>
          <View style={{ backgroundColor: 'white', paddingHorizontal: 8, paddingVertical: 16 }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>Status</Text>
              <Text style={{ flex: 3, textAlign: 'center', fontWeight: 'bold' }}>Name</Text>
              <Text style={{ width: '7%', textAlign: 'center', fontWeight: 'bold' }}>Qty</Text>
              <Text style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Price</Text>
            </View>
            {this.props.orders.data.map((item, index) =>
              <View style={{ flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 4 }} key={index}>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: item.status == 0 ? 'tomato' : 'teal' }}>{item.status == 0 ? 'WAITING' : 'SENT'}</Text>
                <Text style={{ flex: 3, textAlign: 'center', paddingHorizontal: 4 }}>{item.name}</Text>
                <Text style={{ width: '7%', textAlign: 'center' }}>x{item.qty}</Text>
                <Text style={{ flex: 1, textAlign: 'right' }}>{item.totalPrice}</Text>
              </View>
            )}
          </View>
        </Content>

        <View style={{ backgroundColor: 'white', elevation: 12, padding: 16 }}>
          <View style={{ fontWeight: 'bold', borderBottomWidth: 2, paddingBottom: 8, borderColor: colorPrimary, marginBottom: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Meja : 6</Text>
            <Text>{this.state.timer}</Text>
          </View>

          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Sub Total</Text>
              <Text>{priceFormat(transactions.subTotal)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Discount</Text>
              <Text>{priceFormat(transactions.discount)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Service Charge</Text>
              <Text>{priceFormat(transactions.serviceCharge)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Tax</Text>
              <Text>{priceFormat(transactions.tax)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text style={{ fontWeight: 'bold' }}>TOTAL</Text>
              <Text style={{ fontWeight: 'bold' }}>{priceFormat(transactions.total)}</Text>
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
    transactions: state.transactions,
    timers: state.timers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTimer: (seconds) => dispatch(actionTimer.addTimer(seconds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)