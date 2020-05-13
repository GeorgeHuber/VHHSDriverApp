// SignUp.js
import React from 'react'
import { StyleSheet, Text, Image, TextInput, View, TouchableOpacity,Button } from 'react-native'

import firebase from "firebase";
import "firebase/firestore"
import styles from './styles.js';


var config = {
  
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}



export default class SignUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: null
    };
  }

  handleSignUp = (email, password) => {
    // TODO: Firebase stuff...

    try {

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => this.props.navigation.navigate('Main'))
        .catch(error => this.setState({ errorMessage: error.message }));

      //copy into other pages
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          const db = firebase.firestore();

          console.log("user " + user.uid);
          console.log("made it this far");
          db.collection("users").doc(user.uid).set({ data: "[]", totalHours: "0" })
            .then(function () {
              console.log("Document successfully written!");
            });
        }
      });

    } catch (error) {
      error => this.setState({ errorMessage: error.message })
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <Image style={{ width: 200, height: 320 }} source={require('./vhsfancy.png')} />
        <Text style={[styles.uvBoldFont,styles.headerText]}>Sign Up</Text>
        
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}

        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}

        />
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <View style={{ padding: 50 }}>
          <TouchableOpacity onPress={() => this.handleSignUp(this.state.email, this.state.password)}>
            <View style={styles.frontButtonContainer}>
              <Text style={[styles.uvBoldFont, styles.frontButtonText]}>Sign Up</Text>
            </View>
          </TouchableOpacity>
          <View style={{ margin: 20 }} />
          <TouchableOpacity

            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Text style={[styles.uvFont, styles.smallFrontButton,]}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
