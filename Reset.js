



import React from 'react'
import {Dimensions, Image, Text, TextInput, View, Button } from 'react-native'
import  styles  from './styles.js';
import * as firebase from "firebase";
var config = {
    
     };
     if (!firebase.apps.length) {
      firebase.initializeApp(config);
  }

const height=Dimensions.get("screen").height;
const width=Dimensions.get("screen").width;
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      sent:null,
      errorMessage:null
    };
  }




  send =  (emailAddress) => {var auth = firebase.auth();
   

    auth.sendPasswordResetEmail(emailAddress).then(()=>{
  // Email sent.
    this.setState({ sent: "A message has been sent to your email. Click the link to reset it." });}
    ).catch(error => this.setState({ errorMessage: error.message }));}

  
  render() {
    return (
      <View style={styles.container}>
         
        <Text style={{marginVertical:0.0246*height,fontSize:20,fontFamily:"Futura-Medium"}}>Type Your Email: </Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        {this.state.sent && <Text style={{marginVertical:0.0246*height,fontSize:15,fontFamily:"Futura-Medium"}}>{this.state.sent}</Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          
        />
        <View style={{padding:50}}>

        <Button
          title="Reset Password"
          onPress={() => this.send(this.state.email)}
        />
        <Button
          title="Back"
          onPress={() => this.props.navigation.navigate('Login')}
        />
        </View>
      </View>
    )
  }
}


