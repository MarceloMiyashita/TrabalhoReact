import React, { Component } from 'react';
import {
  Geolocation,
  TextInput,
  ActivityIndicator,
  Image,
  Modal,
  View,
  ScrollView,
  Text,
  Button,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';
const key = "AIzaSyCebmtundwnrFLrYPM0Fu6momFBbVm_ui8";
const base_url = "https://maps.googleapis.com/maps/api/place/";
const styles = require('./../Style/Style');




class GooglePlaces extends Component {

  state = {
    
    latitude: null,
    longitude: null,
    locais: null,
    exibirModal: false,
    itemModal: null,
    searching: false
  }

  componentDidMount = () => {
    const config = { enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, config);
  }

  locationSuccess = (position) => {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }

  locationError = () => {
    alert('Erro.')
  }

  openModal = (item) => {
    this.setState({
      exibirModal: true,
      itemModal: item
    })
  }

  searchInput = () => {
    return (
      <View>
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <TextInput
            placeholder="O que você busca..."
            onChangeText={(text) => this.setState({ text })}
            value={this.state.busca}
            onChangeText={this.onChangebusca}
          />
        </View>
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Button title="Search"
            onPress={this.buscar}
          />
        </View>
      </View>
    );
  }

  buscar = () => {
    const { latitude, longitude, busca } = this.state;
    let locais = null;

    this.setState({ searching: true });

    axios.get(
      base_url + 'textsearch/json?query=' + busca +
      '&location=' + latitude + ',' + longitude + '&key=' + key
    ).then((response) => {
      locais = response.data.results
    })
      .catch((err) => {
        alert('Erro.')
      })
      .finally(() => {
        this.setState({
          searching: false,
          locais
        });
      });
  }

  onChangebusca = (busca) => {
    this.setState({ busca })
  }

  result = () => {
    if (this.state.searching) {
      return (
        <ActivityIndicator />
      );
    }

    let content;
    if (this.state.locais) {
      content = this.state.locais.map((item, index) => {
        return (
          <View key={index} style={styles.itens}>
            <TouchableOpacity onPress={() => this.openModal(item)}>
              <View style={styles.picture} >
                {item.photos ? <Image style={styles.local} source={{ uri: base_url + 'photo?maxwidth=100&photoreference=' + item.photos[0].photo_reference + '&key=' + KEY_GOOGLE }} /> : null}
              </View>
              <View>
                <Text>{item.name}</Text>
                <Text>{item.formatted_address}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      });
    }
    return (
      <View>{content}</View>
    )
  }

  render() {
    const { latitude, longitude, exibirModal } = this.state;
    if (latitude && longitude) {
      return (
        <View>
          <Modal
            visible={this.state.exibirModal}
            transparent={true}
            onRequestClose={() => this.setState({ exibirModal: false })}
          >
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
              <Text style={{ fontSize: 12, padding: 10, textAlign: 'center' }}>{this.state.itemModal ? this.state.itemModal.name : null}</Text>
              <Text style={{ marginTop: 30, textAlign: 'center' }}>{this.state.itemModal ? this.state.itemModal.formatted_address : null}</Text>
              <Button title="X"
                onPress={() => this.setState({ exibirModal: false })} />
            </View>
          </Modal>
          {this.searchInput()}
          <ScrollView automaticallyAdjustContentInsets={false}>
            {this.result()}
          </ScrollView>
        </View>
      );
    }
    return (
      <View>
        <Text></Text>
      </View>
    )
  }
}

export default GooglePlaces;
