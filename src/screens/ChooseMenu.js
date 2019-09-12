import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableHighlight, Modal, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Container, Header, Button, Content, Body, Left, Right, ListItem } from 'native-base';
import { List } from 'react-native-paper';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';

import * as actionCategory from '../redux/actions/category';
import * as actionMenu from '../redux/actions/menu';
import * as actionOrder from '../redux/actions/order';
import * as actionTimer from '../redux/actions/timer';

import config from '../config';
import theme from '../assets/styles/theme';
import priceFormat from '../utils/priceFormat'

class ChooseMenu extends Component {
    constructor() {
        super()
        this.state = {
            tableNumber: null,
            transactionId: null,
            categoryActive: null,
            confirmVisible: false,
            viewBillDisabled: true,
            viewBillVisible: false
        }
        
    }
    
    async componentDidMount() {
        this.props.getTimer()

        setInterval(() => {
            this.props.addTimer(this.props.timers.seconds + 1)
        }, 1000);

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
        this.setState({ categoryActive: categoryId })
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
    }

    handleAddQuantity = (menuId, price) => {
        this.props.addQuantity(menuId, price)
    }

    showConfirmModal = (visible) => (
        this.setState({ confirmVisible: visible })
    )

    showViewBillModal = (visible) => (
        this.setState({
            viewBillVisible: visible
        })
    )

    render() {
        const { tableNumber, transactionId, categoryActive } = this.state

        return (
            <Container>
                <Header style={{ backgroundColor: theme.colors.primary, justifyContent: 'space-between' }}>
                    <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
                    <Left style={{ flexDirection: 'row', minWidth: '25%', maxWidth: '25%' }}>
                        <Text style={{ color: 'white', fontSize: 14 }}>Meja :</Text>
                        <Text style={{ backgroundColor: 'white', color: theme.colors.primary, width: 20, borderRadius: 10, textAlign: 'center', fontSize: 14, marginLeft: 8 }}>{tableNumber}</Text>
                    </Left>
                    <Body style={{ alignItems: 'center', width: '50%' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Kedai Kito</Text>
                    </Body>
                    <Right style={{ maxWidth: '25%' }}>
                        <Text style={{ color: 'white' }}>{this.props.timers.timerFormat}</Text>
                    </Right>
                </Header>

                <View style={{ marginTop: 8, flex: 1 }}>
                    {/* Categories */}
                    <View>
                        <ScrollView style={{ marginBottom: 8 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity onPress={() => this.handleMenuByCategory(null)}
                                style={[styles.category, {
                                    backgroundColor: categoryActive == null ? theme.colors.primary : 'rgba(0,0,0,.3)'
                                }]}>
                                <Text style={{ color: 'white' }}>Semua</Text>
                            </TouchableOpacity>

                            {this.props.categories.data.map((item, index) => (
                                <TouchableOpacity onPress={() => this.handleMenuByCategory(item.id)} key={index} style={[styles.category, {
                                    backgroundColor: categoryActive == item.id ? theme.colors.primary : 'rgba(0,0,0,.3)'
                                }]}>
                                    <Text style={{ color: 'white' }}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <Content style={{ flex: 1, paddingHorizontal: 4 }}>
                        {/* All Menus */}
                        {this.props.menus.isCategory != true && this.props.menus.data.map((item, index) => (
                            <List.Item
                                title={item.name}
                                description={props => <Text>{item.price}</Text>}
                                left={props => <Image source={{ uri: item.image }} style={{ width: 100, height: 70, borderRadius: 4 }} />}
                                key={index}
                                right={() => (
                                    <Button style={{ justifyContent: 'center', alignSelf: 'flex-end', marginRight: 8, backgroundColor: theme.colors.primary, height: 25, padding: 4 }} onPress={() => this.addOrderItem(item, transactionId)}>
                                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 12 }}>Tambah</Text>
                                    </Button>
                                )}
                            />
                        ))}

                        {/* Menus By Category */}
                        {this.props.menus.isCategory == true && this.props.menus.dataByCategory.map((item, index) => (
                            <List.Item
                                title={item.name}
                                titleStyle={{ top: 0 }}
                                description={props => <Text>{item.price}</Text>}
                                left={props => <Image source={{ uri: item.image }} style={{ width: 100, height: 70, borderRadius: 4 }} />}
                                key={index}
                                right={() => (
                                    <Button style={{ justifyContent: 'center', alignSelf: 'flex-end', marginRight: 8, backgroundColor: theme.colors.primary, height: 25, padding: 4 }} onPress={() => this.addOrderItem(item, transactionId)}>
                                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 12 }}>Tambah</Text>
                                    </Button>
                                )}
                            />
                        ))}

                        {/* No Menu */}
                        {this.props.menus.isCategory == true && this.props.menus.dataByCategory.length == 0 ? (
                            <Text style={{ color: 'red', fontStyle: 'italic' }}>Tidak ada menu</Text>
                        ) : null}
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
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../assets/images/shopping-basket.png')} style={{ width: 24, height: 24 }} />
                                <Text style={{ color: 'white', marginLeft: 8 }}>{`x${this.props.orders.qtyTotal} item`}</Text>
                            </View>
                            <View style={{}}>
                                <Text style={{ color: 'white' }}>{priceFormat(this.props.orders.priceTotal)}</Text>
                                <Text style={{ color: 'white', fontSize: 8 }}>*Belum termasuk PPN</Text>
                            </View>
                        </Button>
                        : null}
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
        timers: state.timers,
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
        addQuantity: (menuId, price) => dispatch(actionOrder.addQuantity(menuId, price)),

        // Timer
        getTimer: () => dispatch(actionTimer.getTimer()),
        addTimer: (seconds) => dispatch(actionTimer.addTimer(seconds)),
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
