import React from 'react'
import { Dimensions, Image, Text, TextInput, View, Button } from 'react-native'
import { GoogleSignIn } from 'expo';
import * as firebase from "firebase";
import styles from './styles.js';
import { TouchableOpacity } from 'react-native-gesture-handler';




var config = {
 
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default class Login extends React.Component {

  

  
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: null
    };
  }
  handleLogin = (email, password) => {
    try {
      
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => this.props.navigation.navigate('Main'))
        .catch(error => this.setState({ errorMessage: error.message }));
    } catch (error) {
      error => this.setState({ errorMessage: error.message })
    }
  }
  resetPasswordHandler = () => {
    this.props.navigation.navigate('Reset');
  }
  render() {
    return (
      <View style={styles.container}>
        <Image style={{ width: .53*width, height: 0.4*height }} source={require('./vhsfancy.png')} />
        <Text style={[styles.uvBoldFont,styles.headerText]}>Login</Text>
        
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}

        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}

        />
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <View style={{ padding: .13*width }}>
          <TouchableOpacity onPress={() => this.handleLogin(this.state.email, this.state.password)}>
            <View style={styles.frontButtonContainer}>
              <Text style={[styles.uvBoldFont, styles.frontButtonText]}>Login</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            
            onPress={() => this.resetPasswordHandler()}
          >
            <Text style={[styles.uvFont,styles.smallFrontButton]}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity

            onPress={() => this.props.navigation.navigate('SignUp')}
          >
            <Text style={[styles.uvFont,styles.smallFrontButton]}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
      </View>
    )
  }
}





































