import React, { Component } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { Container, Button } from 'native-base';
import { connect } from 'react-redux';
import Axios from 'axios';

import config from '../config';
import theme from '../assets/styles/theme';

class OrderDone extends Component {
    componentDidMount() {
        setTimeout(() => {
            Axios.patch(`${config.API_URL}/transactions/${this.props.transactions.data.id}`, { isPaid: 1 })
            alert('Pembayaran berhasil!! Terima kasih sudah makan di sini :)')
        }, 10000)
    }

    render() {
        const colorPrimary = theme.colors.primary
        const transactions = this.props.transactions.data

        return (
            <Container style={{ justifyContent: 'center', padding: 16 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: colorPrimary, textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>PLEASE BRING THE IPAD TO THE CASHIER TO PROCEED WITH THE PAYMENT</Text>
                    <Text style={{ fontSize: 48, marginVertical: 16 }}>#{transactions.tableNumber}</Text>
                    <Text>{`Transaction ID : ${transactions.id}`}</Text>
                    <Button style={{ width: '60%', marginTop: 8, backgroundColor: colorPrimary, borderRadius: 8, justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('Table')}>
                        <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold' }}>Ke Halaman Utama</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        orders: state.orders,
        transactions: state.transactions
    }
}

export default connect(mapStateToProps)(OrderDone)