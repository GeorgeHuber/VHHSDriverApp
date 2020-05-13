// Loading.js
import {decode, encode} from 'base-64'

if (!global.btoa) {
global.btoa = encode;
}

if (!global.atob) {
global.atob = decode;
} 

import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

import * as firebase from "firebase";
var config = {
  
   };
   if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export default class Loading extends React.Component {
    componentDidMount =async() => {
        firebase.auth().onAuthStateChanged(user => {
          this.props.navigation.navigate(user ? 'Main' : 'SignUp')
        })}
    render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})