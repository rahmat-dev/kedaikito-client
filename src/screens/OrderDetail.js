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

  componentDidMount = async () => {
    await this.props.getOrder()
  }

  removeOrderItem = (item, index) => {
    this.props.orders.qtyTotal -= 1
    this.props.orders.priceTotal -= item.pricePerItem

    if (item.qty === 1) {
      this.props.orders.data.splice(index, 1)
    } else {
      this.handleRemoveQuantity(item.menuId, item.price)
    }

    this.props.getOrder()

  }

  handleAddQuantity = (menuId, price) => {
    this.props.addQuantity(menuId, price)
  }

  handleRemoveQuantity = (menuId, price) => {
    this.props.removeQuantity(menuId, price)
  }

  render() {
    const colorPrimary = theme.colors.primary
    return (
      <Container style={{ backgroundColor: 'rgba(125, 125, 125, .2)', position: 'relative' }}>
        <Header androidStatusBarColor={colorPrimary} style={{ backgroundColor: colorPrimary }}>
          <Body style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='arrow-back' style={{ color: 'white' }} />
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
                    {/* <Button style={{ width: 20, height: 20, justifyContent: 'center', backgroundColor: 'white' }} onPress={() => this.removeOrderItem(item, index)}> */}
                    <Text style={{ fontWeight: 'bold', paddingHorizontal: 8, color: colorPrimary }} onPress={() => this.removeOrderItem(item, index)}>-</Text>
                    {/* </Button> */}
                    <Text style={{ width: 30, textAlign: 'center' }}>{item.qty}</Text>
                    <Text style={{ fontWeight: 'bold', paddingHorizontal: 8, color: colorPrimary }} onPress={() => this.handleAddQuantity(item.menuId, item.pricePerItem)}>+</Text>
                    {/* </Button> */}
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

          <Button style={{ backgroundColor: colorPrimary, justifyContent: 'center', borderRadius: 8 }}>
            <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold' }} onPress={() => this.props.navigation.navigate('ViewBill')}>Konfirmasi Pembayaran</Text>
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
    addOrder: (item, tableNumber) => dispatch(actionOrder.addOrder(item, tableNumber)),
    getOrder: () => dispatch(actionOrder.getOrder()),
    removeOrder: (index) => dispatch(actionOrder.removeOrder(index)),
    addQuantity: (menuId, price) => dispatch(actionOrder.addQuantity(menuId, price)),
    removeQuantity: (menuId, price) => dispatch(actionOrder.removeQuantity(menuId, price)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)