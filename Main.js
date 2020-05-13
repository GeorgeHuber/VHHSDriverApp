/*import * as React from 'react';
import {NavigationContainer } from '@react-navigation/native';
import {createStackNavigator } from '@react-navigation/stack'
import { ScrollView, StyleSheet, Text, View,TextInput, Button,List, ListItem,Fab,Icon,Content } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';*/

import * as React from 'react';
import { Dimensions, Image, View, Text, TextInput,ScrollView, FlatList, TouchableOpacity, Linking, TabBarIOS, TextBase } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Print from 'expo-print';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import firebase from "firebase";
import "firebase/firestore"
import * as MailComposer from 'expo-mail-composer';
import { LinearGradient } from 'expo-linear-gradient';



import ObjInput from './inputHourObj.js'
import  styles  from './styles.js';


const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;


//function to get the sum of the hours and minutes when passed in an array of formatted objects and the type of hour ("All","Day","Night") 
function getTotal(courseHours, hourType) {
  var total = 0;
  for (var i = 0; i < courseHours.length; i++) {
    if (courseHours[i].isDay == hourType || hourType == "All") {
      total += parseInt(courseHours[i].value) + parseInt(courseHours[i].minutes) / 60;
    }
  }
  return total;
}

//the share page

function Download({navigation}) {
  /* defines empty coursehours array to be populated by firebase and html to be used in export */
  const [courseHours, setCourseHours] = React.useState([]);
  const topHTML = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Build a table</title>
      <style>
       th {
       border: 1px solid black;
    }
      table {
        margin-top:40px;
        
        margin-left:100px;
        width:80%;
        
       
      }
      th {
        height: 40px;
        text-align: center;
      }
      td {
        border-spacing:0px;
        height: 30px;
        text-align: center;
        vertical-align: center;
        border-bottom: 1px solid #111;
      }
      h1{
        text-align:center;
        font-size: 60px;
      }
      p {
        font-size:10px;
        margin-right: 140px;
        margin-left: 140px;
      }
      
  </style>
  </head>
  <body>
  <h1>Drivers Education Hours</h1>
  <p>Motor vehichle crashes are the leading cause of teen death.
   Within the Illinois Drivers Education program, Students are required by law to have 
   <strong>50 hours of behind the wheel practice, 10 of which are nighttime driving </strong>. This will give novice drivers the practical experience neccessary to make our roads safer.</p>
  <p>These 50 hours must be spent in addition to time with a driving instructor. Students may only complete these hours with a licenced adult 21 years or older, who has held their license for at least a year.</p>
  <p>Within this chart, hours your teen has been driving have been logged for convienience but <strong>require ititials and a signature</strong> before submission.
  Print out this page and take it to the DMV when complete on your trip to get a license</p>
  <table>
  <!-- here goes our data! -->
  </table>
  <p>__________________________________________________________</p>
  <p>Signature of Parent, Guardian, or Other Responsible Adult </p>
  </body>
  <script >let hours = `;
  const bottomHTML = `;
          
  function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      if(key!='key'){
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);}
    }
  }
  
  function generateTable(table, data) {
    for (let element of data) {
      let row = table.insertRow();
      for (key in element) {if(key!="key"){
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }}
    }
  }
  
  let table = document.querySelector("table");
  let data = Object.keys(hours[0]);
  generateTableHead(table, data);
  generateTable(table, hours);</script>
  </html>`;

  //defines a function to format the course hour objects into an array with keys suitable to export into html table
  const formatData = (courseHours) => {
    let temp = [];
    let hoursSoFar = [];
    for (var i = courseHours.length - 1; i >= 0; i--) {
      hoursSoFar.push(courseHours[i]);
      temp.push({
        Date: courseHours[i].date + "/" + courseHours[i].year,
        "Location of Practice": courseHours[i].road,
        Weather: courseHours[i].weather,
        Daytime: courseHours[i].isDay === "Day" ? (parseFloat(courseHours[i].value) + parseFloat(courseHours[i].minutes / 60)).toFixed(2) : "0",
        "Daytime \nTotal": getTotal(hoursSoFar, "Day").toFixed(2),
        Nighttime: courseHours[i].isDay === "Night" ? (parseFloat(courseHours[i].value) + parseFloat(courseHours[i].minutes / 60.0)).toFixed(2) : 0,
        "Nighttime\nTotal": getTotal(hoursSoFar, "Night").toFixed(2),
        "Grand\nTotal": getTotal(hoursSoFar, "All").toFixed(2),
        Initials: "  "
      })
    }
    return temp;
  }

  //Function that returns a boolean whether the user can go get their drivers liscense
  const readyToGetLicense=()=>{
    
    return (getTotal(courseHours,"All")>=50 && getTotal(courseHours,"Night")>=10);
  }


  //Function is called once when page is loaded to get the course hour array from a firebase database
  React.useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      firebase.auth().onAuthStateChanged(
        function (user) {
          if (user) {
            const db = firebase.firestore();
            var current = db.collection("users").doc(user.uid);
            current.get().then(function (doc) {
              setCourseHours(JSON.parse(doc.data().data));
              
            })
    
          }
        }
      )
    },[]);
    
    return unsubscribe;
    
  
  },[])
  
  //function to be called on press of email button
  //opens a ios native tab to send hours as pdf attachment in user customizable email
  const emailFile = (args) => {
    async function sendPDF() {
      let data = JSON.stringify(formatData(courseHours));
      let options = {
        html: topHTML + data + bottomHTML,
      };
      let fileName = (await Print.printToFileAsync(options)).uri;
      let options2 = { subject: "Drivers Ed Hours", attachments: [fileName] };
      MailComposer.composeAsync(options2)
    }
    sendPDF();
  }

  //function to print a file to an airprinter
  const printFile = (args) => {
    async function createPDF() {
      let data = JSON.stringify(formatData(courseHours));
      let options = {
        html: topHTML + data + bottomHTML,
      };
      Print.printAsync(options)
    }
    createPDF();
  }
  
  

  return (
    <LinearGradient
        colors={['white', 'rgb(0,89,162)']}
        style={{ height: height }}
      >
    <View style={{ marginTop:.123*height, marginBottom: .246*height, alignItems: 'center' }} >
      <Text style={[{ alignSelf: 'center', fontSize: 30,marginBottom:.04*height },styles.uvBoldFont]}>Export Your Hours</Text>
      <TouchableOpacity onPress={()=>printFile()}>
        <View style={[styles.buttonContainer,{width:.8*width,marginVertical:.04*height}]}>
          <Text style={[styles.uvFont,{fontSize:25}]}>Print</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={()=>emailFile()}>
        <View style={[styles.buttonContainer,{width:.8*width}]}>
          <Text style={[styles.uvFont,{fontSize:25}]}>Email</Text>
        </View>
      </TouchableOpacity>

      {readyToGetLicense()&&<View style={styles.congrats}>
        <Text style={[styles.uvFont,{fontSize:20,color:"rgb(255,255,255)"}]}>
          Congratulations on completing the required number of hours to graduate to your license! Remember that you still need to have held your permit for 9 months to go to the DMV. Print out this form to take with you and refer to the info page for more. Stay Safe!</Text>

        </View>}

        {!readyToGetLicense()&&<View style={styles.congrats}>
        <Text style={[styles.uvFont,{fontSize:20,color:"rgb(255,150,150)"}]}>
          Just a reminder, you do not have the required hours needed to get your license. The state of Illinois requires 10 hours of nighttime driving and 50 hours driving before you can take your drivers test. </Text>
          
        </View>}
    </View>
    </LinearGradient>
  )
}



//imports navigation for sign out button
import props from "./App.js"; 
//home page
function Home({navigation}) {
  
  //defines constants for hours
  const [courseHours,setCourseHours]=React.useState([])


  //asychronous function to be called on press of signout button
  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate("login");
    } catch (e) {
      console.log(e);
    }
    
  }

  //Function is called once when page is loaded to get the course hour array from a firebase database
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      firebase.auth().onAuthStateChanged(
        function (user) {
          if (user) {
            const db = firebase.firestore();
            var current = db.collection("users").doc(user.uid);
            current.get().then(function (doc) {
              
              setCourseHours(JSON.parse(doc.data().data));}
              
            )
  
          }
        }
      )
      
    });
    
    return unsubscribe ;},[]
  );

  //the actual page
  return (
    <View >
      <LinearGradient
        colors={['white', 'rgb(0,89,162)']}
        style={{ height: height }}
      >
      <View style={{ paddingVertical: .062*height, alignItems: "center" }}>
        {/* VHHS logo */}
        <Image style={{ width: .667*width, height: .31*height,marginTop:.062*height }} source={require('./logoWithoutText.png')} />
        <View style={{marginTop:.062*height}}>
          <View style={styles.hourTotalLines1}>
          <Text style={[styles.hourTotalText,styles.uvFont]}>{getTotal(courseHours,"All")>50?50:getTotal(courseHours,"All").toFixed(2)}/50  Total Hours Complete</Text>
          </View>
          <View style={styles.hourTotalLines2}>
          <Text style={[styles.hourTotalText,styles.uvFont]}>{getTotal(courseHours,"Night")>10?10:getTotal(courseHours,"Night").toFixed(2)}/10 Night Hours Complete</Text>
          </View>
        </View>
        <View style={{width:.9*width,marginTop: .062*height,marginBottom:.04*height, marginHorizontal:.04*height, borderRadius:5,
           paddingHorizontal: .04*width, paddingVertical: .02*height, borderWidth:2,backgroundColor: "rgba(255, 255, 255,0.1)"}}>
        <Text
          style={[{ fontSize: 25,textAlign:"center" }, styles.uvFont]}>
          Welcome to the VHHS Drivers Ed App!</Text>
          </View>
        <TouchableOpacity onPress={() => signOutUser()}>
          <View style={styles.buttonContainer}>
          {/* Lougout button */}
          <Text style={[styles.uvBoldFont,{fontSize:30,opacity:1}]}>Logout</Text>
        </View>
        </TouchableOpacity> 
      </View>
      </LinearGradient>
    </View>
  );
}

//Page to display and edit entered hours
function HoursPage({navigation}) {
  //defines variables that update the page
  const [hourType, setHourType] = React.useState("All")
  const [show, setShow] = React.useState(false)
  const [courseHours, setCourseHours] = React.useState([]);
  const [totalHours, setTotalHours] = React.useState(getTotal(courseHours, hourType));


  //called once to get courseHour array and total hour variable based on firebase file
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      //gets user object needed to find file
    
    firebase.auth().onAuthStateChanged(
      function (user) {
        if (user) {
          const db = firebase.firestore();
          var current = db.collection("users").doc(user.uid);
          current.get().then(function (doc) {
            setCourseHours(JSON.parse(doc.data().data));
            setTotalHours(JSON.parse(doc.data().totalHours));
          })

        }
      }
    )
    });
    
    return unsubscribe;
  }, [])

  //function to add an hour object to the array
  //updates firebase data and the total hour variable with new hour
  const addHourHandler = (numHours, numMinutes, dayN, tDate, tWeather, tRoad) => {
    //checks for empty string and formats data correctly
    if (numHours != 0 || numMinutes != 0) {
      numHours = numHours == "" ? "0" : numHours;
      numMinutes = numMinutes == "" ? "0" : numMinutes;
      tWeather = tWeather == "" ? "clear" : tWeather;
      var newHours = courseHours;

      //finds the correct index for the item based chronologically
      var ind = courseHours.length;
      for (var i = courseHours.length - 1; i >= 0; i--) {
        var currTot = tDate.getFullYear() * 1000000 + (tDate.getMonth() + 1) * 10000 + tDate.getDate();
        var itot = courseHours[i].year * 1000000 + parseInt(courseHours[i].date.split("/")[0]) * 10000 + parseInt(courseHours[i].date.split("/")[1]);
        if (currTot > itot) { ind = i }
      }

      //add object to the array
      newHours.splice(ind, 0, {
        key: Math.random().toString(),
        road: tRoad, weather: tWeather, value: numHours, date: tDate.getMonth() + 1 + "/" + tDate.getDate(), year: tDate.getFullYear(), isDay: dayN, minutes: numMinutes
      })

      setCourseHours(newHours);
      setTotalHours(getTotal(newHours, hourType));

      //updates firebase data
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          const db = firebase.firestore();
          db.collection("users").doc(user.uid).set({ totalHours: JSON.stringify(getTotal(newHours, "All")), data: JSON.stringify(newHours) })
        }
      });
    } setShow(false);
  }

  //function for removal  of course hours
  const removeHourHandler = (index, courseHours) => {
    var temp = [];
    temp = courseHours;
    temp.splice(index, 1);
    setCourseHours(temp);
    setTotalHours(getTotal(temp, "All"));
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        const db = firebase.firestore();
        db.collection("users").doc(user.uid).set({ totalHours: JSON.stringify(getTotal(temp, "All")), data: JSON.stringify(temp) })

      }
    });

  }

  //voila, the actual page
  //first view and linear gradient form the background container
  return (
    
    <View >
      <LinearGradient
        colors={['white', 'rgb(0,89,162)']}
        style={{ height: "100%" }}
      >


        <View style={{ alignItems: 'center', justifyContent: "center", marginBottom: 0.0246*height, marginTop: 0.061*height, paddingVertical: 0.0123*height }}>
          {/* Total Hour Display */}
          <Text style={[{ fontSize: 30 }, styles.uvBoldFont]}>Total Hours: {getTotal(courseHours, hourType).toFixed(2)}</Text>

          {/* Add hour button */}
          {!show && <TouchableOpacity onPress={() => setShow(true)}>
              <View style={{ alignSelf: "center", margin: 0.053*width, paddingHorizontal: 0.053*width, borderWidth: 4, borderRadius: 10 }}>
                <Text style={[{ fontSize: 24 }, styles.uvFont]}>Add Drivers Hours</Text>
              </View>
          </TouchableOpacity>}

          {/* Selector for Day Night of All, changes hours displayed and allows users to see their totals for all 3 categories 
            Shown only when the add horus page is not open*/}
          {!show && <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
            {/* Selector Button */}
            <TouchableOpacity onPress={() => setHourType("Night")}>
              <View style={[hourType == "Night" ? styles.selector1 : styles.selector2]}>
                <Text style={[styles.nightDayButton, styles.uvFont]}>Night</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setHourType("Day")}>
              <View style={[hourType == "Day" ? styles.selector1 : styles.selector2]}>
                <Text style={[styles.nightDayButton, styles.uvFont]}>Day</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setHourType("All")}>
              <View style={[hourType == "All" ? styles.selector1 : styles.selector2]}>
                <Text style={[styles.nightDayButton, styles.uvFont]}>All</Text>
              </View></TouchableOpacity>

          </View>}
          {/*Simple indroduction instructions only shown when user has not added any hours */}
          {(!show && totalHours == 0) && 
          <Text style={[{ marginHorizontal: .11*width, fontSize: 20, marginVertical: .05*height },styles.uvFont]}>Welcome to your hours page! to get started click the Add Driver Hours Button!</Text>}
        
        </View >
        {show && <ObjInput onAddObj={addHourHandler} />}


        {/* Displays hours using the flatlist which renders all items in the coursehours array*/}
        <FlatList style={{  flex:1 }} data={courseHours} renderItem={itemData => {
          //only displays the object if it matches the current hourType
          if (itemData.item.isDay == hourType || hourType == "All") {
            return (
              //this is the code for the actual hour blocks which display concise data about each time the user drove
              <View style={{ padding: 0.025*height, width: .9*width, borderRadius: 10, backgroundColor: "rgb(0,89,162)", flexDirection: 'column', alignSelf: "center", alignItems: 'center', marginBottom: 0.03*height }}>
                <Text style={[{ alignContent: 'center', color: "white", fontSize: 15 }, styles.uvBoldFont]}>{`${itemData.item.value} hours ${itemData.item.minutes} minutes`}</Text>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                  <Text style={[{ alignContent: 'center', color: "white", fontSize: 20 }, styles.uvBoldFont]}>
                    {`        ${itemData.item.date} during the ${itemData.item.isDay}       `}
                  </Text>
                  {/* The remove button which deletes the hour object from the list*/}
                  <TouchableOpacity onPress={() => removeHourHandler(courseHours.indexOf(itemData.item), courseHours)}>
                    <View style={{ padding: 4, borderRadius: 4, backgroundColor: "black" }}>
                      <Text style={{ color: "white" }}>x</Text>
                    </View>
                  </TouchableOpacity>

                </View>
                <Text style={[{ alignContent: 'center', color: "white", fontSize: 15 }, styles.uvFont]}>
                  {`weather: ${itemData.item.weather}  -  road type: ${itemData.item.road} `}
                </Text>
              </View>
            )
          }
        }}>
        </FlatList>
        {/* Closing tags for render containers */}
      </LinearGradient>
    </View>
  )
}

function infoPage(){
  return(
    <View style={{height:height}}>
      <ScrollView>
        <View style={styles.infoContainer}>
        <Text style={[styles.sectionTitle,styles.uvBoldFont]}>About The App</Text>
        <Text style={[styles.infoBodyText,styles.uvFont]}>     Within the Illinois drivers education program, students are required by law to record 50 total hours of driving (10 of which are at night) before going to get their lisence from the DMV. This app was designed by a highschool student to help others log their practice hours and then export them to print out.  </Text>
        <Text style={[styles.infoBodyText,styles.uvFont]}>Hours can be added under the hours page by filling out the pop up form. Students can record the weather, driving location, date, and whether they were driving during the day or at night. After input they are sorted in chronological order. These hours can then be emailed to a printing capable device as a pdf.</Text>
        <Text style={[styles.sectionTitle,styles.uvBoldFont]}>The Trip to the DMV</Text>
        <Text style={[styles.infoBodyText,styles.uvFont]}>     When  you go to pick up your liscense make sure to have:</Text>
        <Text style={[styles.infoBodyText,styles.uvFont]}>-Your permit</Text>
        <Text style={[styles.infoBodyText,styles.uvFont]}>-A Birth-Certificate or Passport</Text>
        <Text style={[styles.infoBodyText,styles.uvFont]}>-Proof of Residency</Text>
        <Text style={[styles.infoBodyText,styles.uvFont]}>-Your Social Security Number</Text>
        <Text style={[styles.infoBodyText,styles.uvFont]}>-Driving Hours Log</Text>
        <Text style={[styles.infoBodyText,styles.uvFont,{marginTop:10}]}> Click 
        <Text style={[styles.infoBodyText,styles.uvBoldFont,{color:'rgb(0,89,162)'}]}onPress={()=>Linking.openURL("https://www.cyberdriveillinois.com/departments/drivers/driver_education/home.html")}> Here </Text>
          for more information.</Text>
        </View>
      </ScrollView>
    </View>
  )
}




const Tab = createBottomTabNavigator();
import Login from "./App.js";



import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const tabs=()=>{
  return (
  <Tab.Navigator >
      
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Hours" component={HoursPage} />
      <Tab.Screen name="Share" component={Download} />
      <Tab.Screen name="Info" component={infoPage} />
      
    </Tab.Navigator>
  )
}
export default function App() {
  return (
    <NavigationContainer>
      
        
     <Stack.Navigator headerMode="none">
        <Stack.Screen name="Main" component={tabs}/>
        <Stack.Screen name="login" component={Login}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}




