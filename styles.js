import { StyleSheet,Dimensions } from 'react-native';
//a stylsheet to hold common styles which render onto the react components

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;


export default StyleSheet.create({
  //day of night selector styling
  selector1: { marginHorizontal: 0.04*width, borderWidth: 1, borderRadius: 7 },
  selector2: { marginHorizontal: 0.04*width },
  nightDayButton: { color: "rgb(0,89,162)", margin: 0.0167*width, fontSize: 20 },
  //allow for easy font change
  uvFont: { fontFamily: "Avenir-Book" },
  uvBoldFont: { fontFamily: "Avenir-Black" },
  //Text boxes in Input hour page
  textBox: { borderRadius:3,margin:4,borderColor: "black", borderWidth: 2, padding: 0.0267*width, width: .8*width, alignSelf: 'center' },
  buttonContainer:{ alignItems: "center",paddingHorizontal:0.053*width,paddingVertical:0.00615*height, backgroundColor: "rgba(255, 255, 255,0.1)",borderRadius: 10,borderWidth:2 },
  //blurb box on export page
  congrats:{alignItems:"center",marginVertical:.1*height,marginHorizontal:0.053*width,borderRadius:10,borderWidth:4, padding:0.0267*width,backgroundColor: "rgba(0, 89, 162,0.5)"},
  //Home page hour total styling
  hourTotalText:{textAlign:"right", fontSize:22,marginHorizontal:0.0267*width,borderTopWidth:1,borderBottomWidth:1},
  hourTotalLines1:{borderTopWidth:1,borderBottomWidth:1},
  hourTotalLines2:{borderBottomWidth:1},

  //infoPage
  sectionTitle:{textAlign:"center",fontSize:30,margin:0.0267*width,color:'rgb(0,89,162)'},
  infoContainer:{marginHorizontal:0.053*width,alignContent:"center",alignItems:"center",marginVertical:.1*height},
  infoBodyText:{fontSize:20,marginBottom:0.025*height,textAlign:"left"},

  //login and sign in
  headerText:{ marginVertical: 0.025*height, fontSize: 30},
  frontButtonText:{fontSize:20,textAlign:"center",textAlignVertical:"center"},
  smallFrontButton:{fontSize:16,marginVertical:0.01*height},
  frontButtonContainer:{alignSelf:"center",height:0.05*height,width:width*.6,borderRadius:20,borderWidth:2,marginBottom:0.01*height},
  textInput:{padding:.0267*width,width:.8*width,borderWidth:2,marginBottom:.01*height},
  container:{flex:1,alignItems:"center",marginTop:0.043*height}
});
