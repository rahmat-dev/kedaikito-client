import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Container } from 'native-base';
import { Button } from 'react-native-paper';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import config from '../config';

class ChooseTable extends Component {
    constructor() {
        super()

        this.state = {
            tableNumber: null
        }
    }

    chooseTable = async () => {
        const { tableNumber } = this.state

        await Axios.post(`${config.API_URL}/transactions`, {tableNumber})
            .then(res => {
                const transaction = res.data.transaction

                console.log(transaction.id)

                AsyncStorage.multiSet([
                    ['tableNumber', tableNumber],
                    ['transactionId', transaction.id.toString()],
                ])

                this.props.navigation.navigate('Menu')
            }).catch(err => {
                console.log(err)
            })
    }
    render() {
        return (
            <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{marginBottom: 36}}>
                    <Text style={{fontSize: 48, fontWeight: 'bold', color: 'blue', textAlign: 'center'}}>KEDAI KITO</Text>
                </View>

                <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, width: '80%' }}>
                    <Text style={{textAlign: 'center'}}>Masukkan Nomor Meja</Text>
                    <View>
                        <TextInput
                            style={{ borderWidth: 1, paddingVertical: 0, textAlign: 'center', marginVertical: 8, borderRadius: 4, height: 40 }}
                            value={this.state.tableNumber}
                            onChangeText={tableNumber => this.setState({ tableNumber })}
                        />
                        <Button mode='contained'
                            style={{backgroundColor: 'blue', paddingVertical: 4}}
                            onPress={() => this.chooseTable()}
                            >
                            <Text>SIMPAN</Text>
                        </Button>
                    </View>
                </View>
            </Container>
        );
    }
}

export default ChooseTable;
