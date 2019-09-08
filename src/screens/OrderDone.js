import React, {Component} from 'react';
import { View, Text } from 'react-native';
import { Container, Button } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import theme from '../assets/styles/theme';

export default class OrderDone extends Component {
    constructor() {
        super()
        this.state = {
            tableNumber: 0
        }
    }

    async componentDidMount() {
        // GET ASYNC STORAGE ITEM
        let values = await AsyncStorage.multiGet(['tableNumber', 'transactionId'])
        this.setState({
            tableNumber: values[0][1],
        })
    }

    render() {
        const colorPrimary = theme.colors.primary

        return (
            <Container style={{justifyContent: 'center', padding: 16}}>
                <View style={{alignItems: 'center'}}>
                    <Text style={{color: colorPrimary, textAlign: 'center', fontSize: 24, fontWeight: 'bold'}}>PLEASE BRING THE IPAD TO THE CASHIER TO PROCEED WITH THE PAYMENT</Text>
                    <Text style={{fontSize: 48, marginVertical: 16}}>#{this.state.tableNumber}</Text>
                    <Button style={{width: '60%', backgroundColor: colorPrimary, borderRadius: 8, justifyContent: 'center'}} onPress={() => this.props.navigation.navigate('Table')}>
                        <Text style={{color: 'white', fontFamily: 'Montserrat-SemiBold'}}>Ke Halaman Utama</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}
