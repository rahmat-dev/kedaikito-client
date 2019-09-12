import React, { Component } from 'react'
import { Text, View, Image, Alert } from 'react-native'
import { List } from 'react-native-paper'
import { Button, Container, Content, Header, Body, Icon } from 'native-base'
import { connect } from 'react-redux'
import Axios from 'axios';

import * as actionOrder from '../redux/actions/order'
import * as actionTransaction from '../redux/actions/transaction';

import config from '../config'
import theme from '../assets/styles/theme'
import priceFormat from '../utils/priceFormat'
import AsyncStorage from '@react-native-community/async-storage';

class OrderDetail extends Component {
  constructor() {
    super()
    this.state = {
      tableNumber: 0,
      transactionId: 0,
      subTotal: 0,
      discount: 0,
      serviceCharge: 0,
      tax: 0,
      total: 0
    }
  }

  componentDidMount = async () => {
    await this.props.getOrder()
    
    // GET ASYNC STORAGE ITEM
    let values = await AsyncStorage.multiGet(['tableNumber', 'transactionId'])
    this.setState({
      tableNumber: values[0][1],
      transactionId: values[1][1],
    })
    
    this.calculateAll()
  }

  removeOrderItem = (item, index) => {
    this.props.orders.qtyTotal -= 1
    this.props.orders.priceTotal -= item.pricePerItem

    if (item.qty === 1) {
      this.props.orders.data.splice(index, 1)
    } else {
      this.handleRemoveQuantity(item.menuId, item.price)
    }

    this.calculateAll()

    if (this.props.orders.data.length == 0) {
      this.props.getOrder()
      this.props.navigation.goBack()
    }
  }

  handleAddQuantity = (menuId, price) => {
    this.props.addQuantity(menuId, price)
    this.calculateAll()
  }

  handleRemoveQuantity = (menuId, price) => {
    this.props.removeQuantity(menuId, price)
  }

  calculateAll = async () => {
    const { tableNumber, transactionId } = this.state

    await this.props.getOrder()

    const subTotal = this.props.orders.priceTotal
    const discount = 10000
    const serviceCharge = 5000
    const tax = subTotal * 5 / 100
    const total = subTotal - discount + serviceCharge + tax

    this.setState({
      subTotal, discount, serviceCharge, tax, total
    })

    const dataTransaction = {
      id: transactionId,
      tableNumber,
      subTotal,
      discount,
      serviceCharge,
      tax,
      total,
      isPaid: 0
    }

    Axios.patch(`${config.API_URL}/transactions/${transactionId}`, {...dataTransaction})
      .then(res => {
        const data = res.data
        this.props.addTransaction(data)
      })
  }

  confirmOrder() {
    Alert.alert(
      'Order',
      'Apakah orderan sudah pas?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya', onPress: () => {
            this.props.navigation.navigate('ViewBill')
          }
        },
      ]
    );
  }

  render() {
    const colorPrimary = theme.colors.primary
    const { subTotal, discount, serviceCharge, tax, total } = this.state

    return (
      <Container style={{ backgroundColor: 'rgba(125, 125, 125, .2)', position: 'relative' }}>
        <Header androidStatusBarColor={colorPrimary} style={{ backgroundColor: colorPrimary }}>
          <Body style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='arrow-back' style={{ color: 'white' }} onPress={() => this.props.navigation.goBack()} />
            <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Montserrat-SemiBold', marginLeft: 16 }}>Detail Pesanan</Text>
          </Body>
        </Header>

        <Content>
          <View style={{ backgroundColor: 'white', paddingHorizontal: 8, paddingVertical: 16 }}>
            <Text style={{ marginLeft: 8, fontWeight: 'bold', borderBottomWidth: 2, paddingBottom: 8, borderColor: colorPrimary, marginBottom: 4, fontSize: 16 }}>Pesanan</Text>
            {this.props.orders.data.map((item, index) =>
              <List.Item
                key={index}
                title={item.name}
                description={() => <Text>{item.pricePerItem}</Text>}
                left={() => <Image source={{ uri: item.image }} style={{ width: 100, height: 70, borderRadius: 4 }} />}
                right={() => (
                  <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: 8, elevation: 2, backgroundColor: 'white', paddingVertical: 4 }}>
                    <Button style={{ width: 20, height: 20, justifyContent: 'center', backgroundColor: 'white', elevation: 0 }} onPress={() => this.removeOrderItem(item, index)}>
                      <Text style={{ fontWeight: 'bold', color: colorPrimary }}>-</Text>
                    </Button>
                    <Text style={{ width: 30, textAlign: 'center' }}>{item.qty}</Text>
                    <Button style={{ width: 20, height: 20, justifyContent: 'center', backgroundColor: 'white', elevation: 0 }} onPress={() => this.handleAddQuantity(item.menuId, item.pricePerItem)}>
                      <Text style={{ fontWeight: 'bold', color: colorPrimary }}>+</Text>
                    </Button>
                  </View>
                )}
              />
            )}

            {this.props.orders.data.length == 0
              ? <Text style={{ marginLeft: 8, fontStyle: 'italic' }}>Tidak ada item terpilih</Text>
              : null}
          </View>
        </Content>

        <View style={{ backgroundColor: 'white', elevation: 12, padding: 16 }}>
          <Text style={{ fontWeight: 'bold', borderBottomWidth: 2, paddingBottom: 8, borderColor: colorPrimary, marginBottom: 4, fontSize: 16 }}>Detail Pembayaran</Text>

          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Sub Total</Text>
              <Text>{priceFormat(subTotal)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Discount</Text>
              <Text>{priceFormat(discount)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Service Charge</Text>
              <Text>{priceFormat(serviceCharge)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text>Tax</Text>
              <Text>{priceFormat(tax)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
              <Text style={{ fontWeight: 'bold' }}>TOTAL</Text>
              <Text style={{ fontWeight: 'bold' }}>{priceFormat(total)}</Text>
            </View>
          </View>

          <Button style={{ backgroundColor: colorPrimary, justifyContent: 'center', borderRadius: 8 }} onPress={() => this.confirmOrder()}>
            <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold' }}>Konfirmasi Pembayaran</Text>
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
    getOrder: () => dispatch(actionOrder.getOrder()),
    removeOrder: (index) => dispatch(actionOrder.removeOrder(index)),
    addQuantity: (menuId, price) => dispatch(actionOrder.addQuantity(menuId, price)),
    removeQuantity: (menuId, price) => dispatch(actionOrder.removeQuantity(menuId, price)),

    addTransaction: (dataTransaction) => dispatch(actionTransaction.addTransaction(dataTransaction))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)