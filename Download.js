import { Button, View, Text } from 'react-native';
import firebase from "firebase";
import { getTotal } from './Main';
export function Download() {
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
        width:100%;
        
       
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
      });
    }
    return temp;
  };
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        const db = firebase.firestore();
        var current = db.collection("users").doc(user.uid);
        current.get().then(function (doc) {
          // Document was found in the cache. If no cached document exists,
          // an error will be returned to the 'catch' block below.
          //console.log("data",doc.data())
          setCourseHours(formatData(JSON.parse(doc.data().data)));
          console.logCourse;
        });
      }
    });
  }, []);
  const emailFile = (args) => {
    async function sendPDF() {
      let data = JSON.stringify(courseHours);
      let options = {
        html: topHTML + data + bottomHTML,
      };
      let fileName = (await Print.printToFileAsync(options)).uri;
      let options2 = { subject: "Drivers Ed Hours", attachments: [fileName] };
      MailComposer.composeAsync(options2);
    }
    sendPDF();
  };
  const printFile = (args) => {
    async function createPDF() {
      let data = JSON.stringify(courseHours);
      let options = {
        html: topHTML + data + bottomHTML,
      };
      Print.printAsync(options);
    }
    createPDF();
  };
  return (<View style={{ marginVertical: 200, alignItems: 'center' }}>
    <Text style={{ alignSelf: 'center', fontSize: 30 }}>Download</Text>
    <Button title="Print" onPress={() => printFile()} />
    <Button title="Email" onPress={() => emailFile()} />
  </View>);
}
