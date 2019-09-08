import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableHighlight, Modal, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Container, Header, Button, Content, Body, Left, Right, ListItem } from 'native-base';
import { List } from 'react-native-paper';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';

import config from '../config';
import theme from '../assets/styles/theme';

import * as actionCategory from '../redux/actions/category';
import * as actionMenu from '../redux/actions/menu';
import * as actionOrder from '../redux/actions/order';
import * as actionTransaction from '../redux/actions/transaction';

class ChooseMenu extends Component {
    constructor() {
        super()
        this.state = {
            tableNumber: null,
            transactionId: null,
            categoryActive: null,
            orders: [1,2,3,4,5],
            confirmVisible: false,
            viewBillDisabled: true,
            viewBillVisible: false
        }
    }

    async componentDidMount() {

        // GET CATEGORIES
        this.props.getCategoriesPending()
        Axios.get(`${config.API_URL}/categories`).then(res => {
            const categories = res.data
            this.props.getCategories(categories)
        })

        // GET MENUS
        this.props.getMenuPending()
        Axios.get(`${config.API_URL}/menus`).then(res => {
            const menus = res.data
            this.props.getMenu(menus)
        })

        // GET ASYNC STORAGE ITEM
        let values = await AsyncStorage.multiGet(['tableNumber', 'transactionId'])
        this.setState({
            tableNumber: values[0][1],
            transactionId: values[1][1]
        })
    }

    handleMenuByCategory = (categoryId) => {
        this.props.getMenuByCategory(categoryId)
        this.setState({categoryActive: categoryId})
    }

    addOrderItem = (item, transactionId) => {
        const dataOrder = this.props.orders.data.filter(order => {
            if (order.menuId == item.id) 
                return true
        })
        
        if (dataOrder.length == 0) {
            this.props.addOrder(item, transactionId)
        } else {
            this.handleAddQuantity(item.id, item.price)
        }

        this.props.getOrder()
        this.calculateTransaction(transactionId, this.state.tableNumber)
    }

    removeOrderItem = (menuId, qty, index) => {
        if (qty === 1) {
            this.props.orders.data.splice(index, 1)
        } else {
            this.handleRemoveQuantity(menuId, price)
        }

        this.props.getOrder()
    }

    handleAddQuantity = (menuId, price) => {
        this.props.addQuantity(menuId, price)
    }

    handleRemoveQuantity = (menuId, price) => {
        this.props.removeQuantity(menuId, price)
    }

    showConfirmModal = (visible) => (
        this.setState({confirmVisible: visible})
    )

    showViewBillModal = (visible) => (
        this.setState({
            viewBillVisible: visible
        })
    )

    calculateTransaction = async (transactionId, tableNumber) => {
        let subTotalPrice, discount, serviceCharge, tax, total

        subTotalPrice = 0

        this.props.orders.data.map(item => {
            subTotalPrice += item.totalPrice
            console.log(subTotalPrice)
        })

        discount = 0
        serviceCharge = subTotalPrice * 5 / 100
        tax = subTotalPrice * 10 / 100
        total = subTotalPrice - discount + serviceCharge + tax

        console.log('Transaction : ', subTotalPrice, discount, serviceCharge, tax, total)
        
        this.props.getTransaction({
            id: transactionId,
            tableNumber,
            finishedTime: new Date(),
            subTotal: subTotalPrice,
            discount,
            serviceCharge,
            tax,
            isPaid: 0
        })
    }

    render() {
        const { tableNumber, transactionId, categoryActive } = this.state

        return (
            <Container>
                <Header style={{backgroundColor: theme.colors.primary}}>
                    <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'white', fontSize: 14}}>Meja :</Text>
                            <Text style={{backgroundColor: 'white', color: theme.colors.primary, width: 20, borderRadius: 10, textAlign: 'center', fontSize: 14, marginLeft: 8}}>{tableNumber}</Text>
                        </View>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>Kedai Kito</Text>
                        <Text style={{color: 'white'}}>05 : 00</Text>
                    </View>
                </Header>

                <View style={{marginTop: 8, flex: 1}}>
                    {/* Categories */}
                    <View>
                        <ScrollView style={{marginBottom: 8}} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity onPress={() => this.handleMenuByCategory(null)}
                            style={[styles.category, {
                                backgroundColor: categoryActive == null ? theme.colors.primary : 'rgba(0,0,0,.3)'
                            }]}>
                                <Text style={{color: 'white'}}>Semua</Text>
                            </TouchableOpacity>

                            {this.props.categories.data.map((item, index) => (
                            <TouchableOpacity onPress={() => this.handleMenuByCategory(item.id)} key={index} style={[styles.category, {
                                backgroundColor: categoryActive == item.id ? theme.colors.primary : 'rgba(0,0,0,.3)'
                            }]}>
                                <Text style={{color: 'white'}}>{item.name}</Text>
                            </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <Content style={{flex: 1, paddingHorizontal: 4}}>
                        {/* Menus */}
                        {/* <List> */}
                            {/* All Menus */}
                            {this.props.menus.isLoading == false && this.props.menus.isCategory != true && this.props.menus.data.map((item, index) => (
                                <List.Item
                                    title={item.name}
                                    description={props => <Text>{item.price}</Text>}
                                    left={props => <Image source={{ uri: item.image }} style={{width: 100, height: 70, borderRadius: 4}} />}
                                    key={index}
                                    onPress={() => this.addOrderItem(item, transactionId)}
                                />
                            ))}

                            {/* Menus By Category */}
                            {this.props.menus.isCategory == true && this.props.menus.dataByCategory.map((item, index) => (
                                <List.Item
                                    title={item.name}
                                    titleStyle={{top: 0}}
                                    description={props => <Text>{item.price}</Text>}
                                    left={props => <Image source={{ uri: item.image }} style={{width: 100, height: 70, borderRadius: 4}} />}
                                    key={index}
                                    onPress={() => this.addOrderItem(item, transactionId)}
                                />
                            ))}

                            {/* No Menu */}
                            {this.props.menus.isCategory == true && this.props.menus.dataByCategory.length == 0 ? (
                                <Text style={{color: 'red', fontStyle: 'italic'}}>Tidak ada menu</Text>
                            ) : null}
                        {/* </List> */}
                    </Content>

                    {this.props.orders.data.length != 0
                    ?
                        <Button
                            style={{
                                backgroundColor: theme.colors.primary,
                                width: '60%',
                                alignSelf: 'center',
                                position: 'absolute',
                                bottom: 8,
                                paddingHorizontal: 16,
                                // paddingVertical: 
                                borderRadius: 8,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}
                            onPress={() => this.props.navigation.navigate('OrderDetail')}
                        >
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('../assets/images/shopping-basket.png')} style={{width: 24, height: 24}} />
                                <Text style={{color: 'white', marginLeft: 8}}>{`x${this.props.orders.qtyTotal} item`}</Text>
                            </View>
                            <View style={{}}>
                                <Text style={{color: 'white'}}>Rp {this.props.orders.priceTotal}</Text>
                                <Text style={{color: 'white', fontSize: 8}}>*Belum termasuk PPN</Text>
                            </View>
                        </Button>
                    : null }
                </View>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        categories: state.categories,
        menus: state.menus,
        orders: state.orders,
        transactions: state.transactions,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // Category
        getCategories: (categories) => dispatch(actionCategory.getCategories(categories)),
        getCategoriesPending: () => dispatch(actionCategory.getCategoriesPending()),

        // Menu
        getMenu: (menus) => dispatch(actionMenu.getMenu(menus)),
        getMenuPending: () => dispatch(actionMenu.getMenuPending()),
        getMenuByCategory: (categoryId) => dispatch(actionMenu.getMenuByCategory(categoryId)),

        // Order
        addOrder: (item, tableNumber) => dispatch(actionOrder.addOrder(item, tableNumber)),
        getOrder: () => dispatch(actionOrder.getOrder()),
        removeOrder: (index) => dispatch(actionOrder.removeOrder(index)),
        addQuantity: (menuId, price) => dispatch(actionOrder.addQuantity(menuId, price)),
        removeQuantity: (menuId) => dispatch(actionOrder.removeQuantity(menuId)),

        // Transaction
        getTransaction: (dataTransaction) => dispatch(actionTransaction.getTransaction(dataTransaction)),
    }
}

const styles = StyleSheet.create({
    category: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 50,
        marginHorizontal: 4,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center'
    },
    menu: {
        borderWidth: 1,
        marginVertical: 8,
        flexDirection: 'row'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ChooseMenu)
