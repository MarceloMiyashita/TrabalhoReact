import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';

import GooglePlaces from './components/GooglePlaces';

export default class App extends Component {
  render() {
    return (
      <View>
        <GooglePlaces />
      </View>
    );
  }
}

AppRegistry.registerComponent('WebDevAvaliacao', () => App);
