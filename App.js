import React from 'react'

import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createAppContainer,createSwitchNavigator } from 'react-navigation'
// import the different screens
import Loading from './Loading.js'
import SignUp from './SignUp.js'
import Login from './Login.js'
import Main from './Main.js'
import Reset from './Reset.js'


// create our app's navigation stack
const Foo = createSwitchNavigator(
  {
     Loading,
    SignUp,
    Login,
    Main,
    Reset
  },
  {
    //Change this
    initialRouteName: 'Loading'
  }
); 
export default createAppContainer(Foo);

