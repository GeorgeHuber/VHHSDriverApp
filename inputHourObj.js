import * as React from 'react';
import { Picker, Button, View, Text, TextInput,TouchableOpacity,FlatList,DatePickerIOS } from 'react-native';

import  styles  from './styles.js';

const ObjInput =props => {    
    const[enteredHour,setEnteredHour]=React.useState('');
    
    const hourInputHandler=(enteredText)=>{
    setEnteredHour(enteredText);
  }

  const[enteredMinutes,setEnteredMinutes]=React.useState('');
    
  const minuteInputHandler=(enteredText)=>{
      
  setEnteredMinutes(parseInt(enteredText)<60||enteredText==""?enteredText:"0");
}

const[enteredDay,setEnteredDay]=React.useState('Day');
    
const dayInputHandler=(enteredText)=>{
setEnteredDay(enteredText);
}
const[enteredDate,setEnteredDate]=React.useState(new Date());
    
const dateInputHandler=(enteredText)=>{
setEnteredDate(enteredText);
}
const[enteredWeather,setEnteredWeather]=React.useState("");
    
const weatherInputHandler=(enteredText)=>{
setEnteredWeather(enteredText);
}
const[enteredRoad,setEnteredRoad]=React.useState("Local");
    
const roadInputHandler=(enteredText)=>{
setEnteredRoad(enteredText);
}
  return(
    <View style={{padding:10,flexDirection:'column',alignContent:'center'}}>
        <TextInput placeholder="Enter Hours: " 
        keyboardType='numeric'
        returnKeyType='done'
        style={styles.textBox}
        onChangeText={(text)=>{hourInputHandler(text)}}
        value={enteredHour}
        />
        <TextInput placeholder="Enter Minutes: " 
        keyboardType='numeric'
        returnKeyType='done'
        style={styles.textBox}
        onChangeText={(text)=>{minuteInputHandler(text)}}
        value={enteredMinutes}
        />
        <TextInput placeholder="Weather Condition: (ex: rain, fog, snow, clear)" 
        
        style={styles.textBox}
        onChangeText={(text)=>{weatherInputHandler(text)}}
        value={enteredWeather}
        />
        <View style={{flexDirection:'row',marginBottom:70}}>
          <Picker
           style={{ height: 100, width: 175 }}
          selectedValue={enteredDay}
          onValueChange={(c)=>dayInputHandler(c)}>
          <Picker.Item label="Day" value="Day" />
          <Picker.Item label="Night" value="Night" />
          
        </Picker>
        <Picker
           style={{ height: 100, width: 200 }}
          selectedValue={enteredRoad}
          onValueChange={(c)=>roadInputHandler(c)}>
          <Picker.Item label="Local" value="Local" />
          <Picker.Item label="Highway" value="Highway" />
          <Picker.Item label="Tollway" value="Tollway" />
          <Picker.Item label="Rural" value="Rural" />
          <Picker.Item label="Urban" value="Urban" />
          <Picker.Item label="Parking Lot" value="Parking Lot" />
          
        </Picker>
        </View>
        <DatePickerIOS
          mode='date'
          date={enteredDate}
          onDateChange={(date)=>dateInputHandler(date)}
        />
        <TouchableOpacity onPress={props.onAddObj.bind(this,enteredHour,enteredMinutes,enteredDay,enteredDate,enteredWeather,enteredRoad)}>
        <View style={{padding:10,width:80,borderWidth:2,borderRadius:7,alignSelf:"center",alignContent:"center",backgroundColor:"white"}}>
        <Text style={[styles.uvFont,{fontSize:20,alignSelf:"center"}]}>ADD</Text>
        </View>
        </TouchableOpacity>
      </View>)
      }

export default ObjInput;