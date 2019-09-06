import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableHighlight, Modal, ScrollView, StyleSheet } from 'react-native';
import { Container, Header, Button, Content, Body, Left, Right, ListItem } from 'native-base';
import { List } from 'react-native-paper';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';

import config from '../config';
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
        
        console.log(dataOrder)
        if (dataOrder.length == 0) {
            return this.props.addOrder(item, transactionId)
        } else {
            return this.handleAddQuantity(item.id)
        }
    }

    removeOrderItem = (menuId, qty, index) => {
        if (qty === 1) {
            this.props.orders.data.splice(index, 1)
        } else {
            this.handleRemoveQuantity(menuId)
        }

        this.props.getOrder()
    }

    handleAddQuantity = (menuId) => {
        this.props.addQuantity(menuId)
    }

    handleRemoveQuantity = (menuId) => {
        this.props.removeQuantity(menuId)
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
        let subTotal = 0;

        this.props.getOrder()
        this.props.orders.data.map(item => {
            subTotal += item.totalPrice
        })

        const transaction = {
            id: transactionId,
            tableNumber,
            finishedTime: new Date(),
            subTotal: subTotal,
            discount: 0,
            serviceCharge: subTotal * 5 / 100,
            tax: subTotal * 10 / 100,
            isPaid: 0
        }

        let total = transaction.subTotal - transaction.discount + transaction.serviceCharge + transaction.tax

        await Axios.patch(`${config.API_URL}/transactions/${transactionId}`, {...transaction, total})
            .then(res => {
                const dataTransaction = res.data
                this.props.addTransaction(dataTransaction)
            })

    }

    render() {
        const { tableNumber, transactionId, categoryActive } = this.state

        return (
            <Container>
                {/* Confirm Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.confirmVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                }}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .5)'}}>
                        <View style={{width: '60%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 12, overflow: 'hidden', borderWidth: 1, padding: 12}}>
                            <Text style={{fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize: 18, marginBottom: 8}}>Confirm Order</Text>
                            <Text>Are you sure to order this?</Text>

                            <View style={{flexDirection: 'row', marginTop: 16, justifyContent: 'space-between'}}>
                                <TouchableHighlight
                                    onPress={() => {
                                    this.showConfirmModal(!this.state.confirmVisible);
                                    }}
                                    style={{flex: 1, alignItems: 'center'}}>
                                    <Text style={{color: 'blue'}}>No</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => {
                                        this.setState({viewBillDisabled: false})
                                        this.showConfirmModal(!this.state.confirmVisible);
                                        this.calculateTransaction(transactionId, tableNumber)
                                    }}
                                    style={{flex: 1, alignItems: 'center'}}>
                                    <Text style={{color: 'blue'}}>Yes</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.viewBillVisible}
                >
                    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,.5)', padding: 16, justifyContent: 'center'}}>
                        <View style={{flex: 1, backgroundColor: 'white', position: 'relative'}}>
                            <Header style={{backgroundColor: 'white'}}>
                                <Right>
                                    <TouchableHighlight
                                        style={{paddingHorizontal: 12}}
                                        onPress={() => this.showViewBillModal(!this.state.viewBillVisible)}
                                    >
                                        <Text style={{color: 'blue'}}>Close</Text>
                                    </TouchableHighlight>
                                </Right>
                            </Header>

                            <View style={{marginTop: 8}}>
                                {this.props.orders.data.length != null && this.props.orders.data.map((item, index) => (
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 4}} key={index}>
                                        <Text style={{flex: 1, color: item.status == 0 ? 'red' : 'green'}}>{item.status == 0 ? 'WAITING' : 'SENT'}</Text>
                                        <Text style={{flex: 1, textTransform: 'capitalize'}}>{item.name}</Text>
                                        <Text style={{flex: 1, textAlign: 'right'}}>{'x' + item.qty}</Text>
                                        <Text style={{flex: 1, textAlign: 'right'}}>{item.totalPrice}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white'}}>
                                <View style={{paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#eaeaea'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{flex: 1, textAlign: 'right'}}>Sub Total</Text>
                                        <Text style={{width: 100, textAlign: 'right'}}>{this.props.transactions.data.subTotal}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{flex: 1, textAlign: 'right'}}>Discount</Text>
                                        <Text style={{width: 100, textAlign: 'right'}}>{this.props.transactions.data.discount}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{flex: 1, textAlign: 'right'}}>Service Charge (5%)</Text>
                                        <Text style={{width: 100, textAlign: 'right'}}>{this.props.transactions.data.serviceCharge}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{flex: 1, textAlign: 'right'}}>Tax (10%)</Text>
                                        <Text style={{width: 100, textAlign: 'right'}}>{this.props.transactions.data.tax}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{flex: 1, textAlign: 'right', fontWeight: 'bold'}}>TOTAL</Text>
                                        <Text style={{width: 100, textAlign: 'right', fontWeight: 'bold'}}>Rp {this.props.transactions.data.total}</Text>
                                    </View>
                                </View>

                                <TouchableHighlight style={{backgroundColor: 'blue', height: 40, justifyContent: 'center', alignItems: 'center', margin: 8}} onPress={() => {
                                    this.showViewBillModal(!this.state.viewBillVisible)
                                    this.props.navigation.navigate('OrderDone')
                                    }}>
                                    <Text style={{color: 'white', fontWeight: 'bold'}}>CALL BILL</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Header>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'white', fontSize: 14}}>Meja :</Text>
                            <Text style={{backgroundColor: 'white', color: 'blue', width: 20, borderRadius: 10, textAlign: 'center', fontSize: 14, marginLeft: 8}}>{tableNumber}</Text>
                        </View>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>Kedai Kito</Text>
                        <Text style={{color: 'white'}}>05 : 00</Text>
                    </View>
                </Header>

                <View style={{padding: 16, flex: 1}}>
                    {/* Categories */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                        <TouchableOpacity onPress={() => this.handleMenuByCategory(null)} style={categoryActive == null ? styles.categoryActive : null}>
                            <Text style={{color: categoryActive == null ? 'white' : null}}>All</Text>
                        </TouchableOpacity>
                        {this.props.categories.data.map((item, index) => (
                            <TouchableOpacity onPress={() => this.handleMenuByCategory(item.id)} key={index} style={item.id == categoryActive ? styles.categoryActive : null}>
                                <Text style={{color: item.id == categoryActive ? 'white' : null}}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Content style={{flex: 1}}>
                        {/* Menus */}
                        {/* <List> */}
                            {/* All Menus */}
                            {this.props.menus.isLoading == false && this.props.menus.isCategory != true && this.props.menus.data.map((item, index) => (
                                // <ListItem key={index}
                                //     style={{marginLeft: 0}}
                                //     onPress={() => this.addOrderItem(item, transactionId)}
                                // >
                                //     <Left style={{backgroundColor: 'red', marginEnd: 0}}>
                                //         <Image source={{ uri: item.image }} style={{width: 100, height: 70}} />
                                //     </Left>
                                //     <Body>
                                //         <Text style={{textTransform: 'capitalize'}}>{item.name}</Text>
                                //         <Text>{item.price}</Text>
                                //     </Body>
                                //     <Right />
                                // </ListItem>
                                <List.Item
                                    title={item.name}
                                    titleStyle={{top: 0}}
                                    description={props => <Text>{item.price}</Text>}
                                    left={props => <Image source={{ uri: item.image }} style={{width: 60, height: 60}} />}
                                    style={{marginVertical: 4}}
                                    key={index}
                                    onPress={() => this.addOrderItem(item, transactionId)}
                                />
                            ))}

                            {/* Menus By Category */}
                            {this.props.menus.isCategory == true && this.props.menus.dataByCategory.map((item, index) => (
                                <TouchableOpacity key={index}
                                    style={[styles.menu, {borderColor: 'black'}]}
                                    onPress={() => this.addOrderItem(item, transactionId)}
                                >
                                    <Image source={{ uri: item.image }} style={{width: 50, height: 50}} />
                                    <View>
                                        <Text style={{textTransform: 'capitalize'}}>{item.name}</Text>
                                        <Text>{item.price}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            {/* No Menu */}
                            {this.props.menus.isCategory == true && this.props.menus.dataByCategory.length == 0 ? (
                                <Text style={{color: 'red', fontStyle: 'italic'}}>Tidak ada menu</Text>
                            ) : null}
                        {/* </List> */}
                    </Content>
                    
                    <View>
                        <ScrollView style={{borderWidth: 1, height: 120, marginVertical: 8, borderRadius: 8}} horizontal={true}>
                            {this.props.orders.data.map((item, index) =>
                                <View style={{width: 80, alignItems: 'center', marginHorizontal: 4, marginVertical: 12}} key={index}>
                                    <Image
                                        source={{uri: item.image}}
                                        style={{width: 40, height: 40}}
                                    />
                                    <Text style={{textTransform: 'capitalize'}}>{item.name}</Text>
                                    <View style={{flexDirection: 'row', marginTop: 8}}>
                                        <Button style={{width: 20, height: 20, justifyContent: 'center', backgroundColor: 'white'}} onPress={() => this.removeOrderItem(item.menuId, item.qty, index)}>
                                            <Text style={{fontWeight: 'bold'}}>-</Text>
                                        </Button>
                                        <Text style={{width: 30, textAlign: 'center'}}>{item.qty}</Text>
                                        <Button style={{width: 20, height: 20, justifyContent: 'center', backgroundColor: 'white'}} onPress={() => this.handleAddQuantity(item.menuId)}>
                                            <Text style={{fontWeight: 'bold'}}>+</Text>
                                        </Button>
                                    </View>
                                </View>
                            )}
                        </ScrollView>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Button primary
                                style={{height: 40, justifyContent: 'center', flex: 1}}
                                disabled={this.props.orders.data.length == 0 ? true : false}
                                onPress={() => this.showConfirmModal(!this.state.confirmVisible)}
                            >
                                <Text style={{color: 'white'}}>Confirm</Text>
                            </Button>
                            <Button primary
                                style={{height: 40, justifyContent: 'center', flex: 1, marginHorizontal: 8}}
                                disabled={this.props.orders.data.length == 0 ? true : false}
                            >
                                <Text style={{color: 'white'}}>Call</Text>
                            </Button>
                            <Button primary
                                style={{height: 40, justifyContent: 'center', flex: 1}}
                                disabled={this.state.viewBillDisabled}
                                onPress={() => this.showViewBillModal(!this.state.viewBillVisible)}
                            >
                                <Text style={{color: 'white'}}>View Bill</Text>
                            </Button>
                        </View>
                    </View>
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
        addQuantity: (menuId) => dispatch(actionOrder.addQuantity(menuId)),
        removeQuantity: (menuId) => dispatch(actionOrder.removeQuantity(menuId)),

        // Transaction
        addTransaction: (dataTransaction) => dispatch(actionTransaction.addTransaction(dataTransaction))
    }
}

const styles = StyleSheet.create({
    categoryActive: {
        backgroundColor: 'blue',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 50,
    },
    menu: {
        // padding: 8,
        borderWidth: 1,
        // borderRadius: 4,
        marginVertical: 8,
        flexDirection: 'row'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ChooseMenu)
