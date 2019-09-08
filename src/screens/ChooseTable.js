import React, { Component } from 'react';
import { View, Text, TextInput, Image, StatusBar } from 'react-native';
import { Container } from 'native-base';
import { Button } from 'react-native-paper';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import config from '../config';
import theme from '../assets/styles/theme';

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
            <Container style={{ flex: 1}}>
                <StatusBar backgroundColor='transparent' barStyle="dark-content" />
                <View style={{flex: 2, backgroundColor: theme.colors.primary, overflow: 'hidden'}}>
                    <Image source={{uri: 'https://cdn.vox-cdn.com/thumbor/8RxlxKE3a8cctSTEn6cISXQITx8=/0x0:2000x1335/1570x883/filters:focal(840x508:1160x828):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/58184123/2017_06_13_TheExchange_004.0.jpg'}} style={{width: '100%', height: '100%'}} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: 'white', marginTop: -28 }}>
                    <Text style={{textAlign: 'center', fontWeight: 'bold'}}>MASUKKAN NOMOR MEJA</Text>
                    <View style={{width: '80%'}}>
                        <TextInput
                            style={{ borderWidth: 1, paddingVertical: 0, textAlign: 'center', marginVertical: 8, borderRadius: 4, height: 40 }}
                            value={this.state.tableNumber}
                            onChangeText={tableNumber => this.setState({ tableNumber })}
                            keyboardType='number-pad'
                        />
                        <Button mode='contained'
                            style={{ paddingVertical: 4}}
                            onPress={() => this.chooseTable()}
                            >
                            <Text style={{fontFamily: 'Montserrat-SemiBold'}}>SIMPAN</Text>
                        </Button>
                    </View>
                </View>
            </Container>
        );
    }
}

export default ChooseTable;
