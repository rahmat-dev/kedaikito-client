import React, {Component} from 'react';
import { View, Text } from 'react-native';
import { Container } from 'native-base';

export default class OrderDone extends Component {
    render() {
        return (
            <Container style={{backgroundColor: '#3949AB', justifyContent: 'center', alignItems: 'center', padding: 16}}>
                <Text style={{color: 'white', textAlign: 'center', fontSize: 16}}>Silahkan tunjukkan nomor orderan ke kasir untuk melakukan pembayaran.</Text>
                <Text style={{fontSize: 18, color: 'white'}}>273404691</Text>
                <Text style={{fontSize: 48, color: 'white'}}>#6</Text>
            </Container>
        )
    }
}
