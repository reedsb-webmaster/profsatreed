// -*- indent-tabs-mode: nil -*-
// All JavaScript goes in here
//

// const api_key   = "🖕";
/*
const api_key   = "AIzaSyBI6UWWW3cn5La1bbLO5geSvYVNWEqwYEE";
const client_id = "440799916291-rfcs9c051ke7pla7n588sok57t9g60bi.apps.googleusercontent.com";
const sheet_id  = "1lmlJA0cH4x51C1wshULfHPgRRX9vNtgy5NYuCLLsUV0";


const range = "A3:B6"
const majorDimension = "COLUMNS"
*/

const professor_form = "https://docs.google.com/forms/d/e/" +
      "1FAIpQLSe750TrU5eKALR8WIZxF_4sKmpKwEnd77-1fNHCvCoMbkCj-Q" +
      "/viewform?embedded=true"
const advisor_form   = "https://docs.google.com/forms/d/e/" +
      "1FAIpQLSe750TrU5eKALR8WIZxF_4sKmpKwEnd77-1fNHCvCoMbkCj-Q" +
      "/viewform?embedded=true"

const professorSheetId = "1lmlJA0cH4x51C1wshULfHPgRRX9vNtgy5NYuCLLsUV0";
const professorDataRange = "Data!E17:H50";
const professorRefRange = "Ref!B2:M50";

const advisorSheetId = "1I4xk2bHo6kYdddThQ3wi70egkMzTND40llPcVrEE3Kc";
const advisorDataRange = "Data!A1:D50";
const advisorRefRange = "Ref!B3:N50";

const api_key = "AIzaSyBI6UWWW3cn5La1bbLO5geSvYVNWEqwYEE"

var dataResponse;
var refResponse;
var refArray;
var headerArray;
var profResponse;
var profRef;
var profRefArray;
var profHeaderArray;

var advisorResponse;
var advisorRef;
var advisorRefArray;
var advisorHeaderArray;
var isset = false;


function display(html) {
    document.getElementsByTagName("article")[0].innerHTML = html;
}

function generateWebsiteString(range, sheet_id){    //range must be of format "ColumnRow:ColumnRow" between the start cell and end cell, can work "diagonally"
  return "https://sheets.googleapis.com/v4/spreadsheets/" +
          sheet_id +
          "?includeGridData=true" +
          "&ranges=" +
          range +
          "&key=" +
          api_key
}

async function fetchIt(range, string){
  sheet = generateWebsiteString(range, string)
  out = await fetch(sheet).then(response => response.json()).then(data => {
    rowData = getDataObject(data);
    return rowData;
  }).catch(response => {
    return false
  })
  return out;
}

function getDataObject(response){  //returns a rowData object, has all the rows the data came with
  obj = response.sheets;
  obj = Object.values(obj)[0]
  obj = obj.data
  obj = Object.values(obj)[0]
  obj = obj.rowData
  return obj
}

function getNthRow(n, rowData){ //returns the specific row object that you want, 0 based indexing
  out = Object.values(rowData)[n];
  if (out != null){
    out = Object.values(out)[0];
    return out;
  }else{
    return false;
  }
}


function getMthColumnData(m, row){//returns the contents of the mth column for a GIVEN row, not rowData object
  tmp = Object.values(row)[m]
  if (tmp != null){
    return tmp.formattedValue
  }else {
    return false
  }
}

function getNMElement(n,m,rowData){ //combines the earlier two functions and gets the data in cell (n,m), shouldn't be used much since it doesn't save the row Object
  row = getNthRow(n,rowData)
  return getMthColumnData(m,row)
}

function createArray(row, rowData){ //converts the given row into an array
  outArr = [];
  let i = 0;
  headRow = getNthRow(row, rowData)
  while (append = getMthColumnData(i, headRow)){
    outArr.push(append)
    i++
  }
  return outArr
}

function findColumn(arr, title){
  return arr.indexOf(title)
}



function findProfessor(data, reference, refArray, professor){ //returns an object of the full rows where "professor" exists, or returns false
  //find the row(s) where the professor exists
  refIndex = findColumn(refArray, professor);
  if (refIndex == -1) {
    return false;
  } else {
    startRow = Number(getNMElement(1, refIndex, reference)) + 1;    //if we fix the formatting of the index listing on the sheet we don't need this
    if (startRow){
      totRows = Number(getNMElement(2, refIndex, reference));

      outData = [];
      let j = 0;
      while (j < totRows){
        outData.push(createArray(startRow + j, data));
        j++;
      }
      return outData;

    }else{
      return false;
  }
  }

}
function makeRow(row){
  let i = 0;
  let out = "<tr>";
  while (row[i]){
    out += "<td>"+row[i]+"</td>";
    i++;
  }
  out += "</tr>";
  return out;
}

function makeHeadRow(headerArray){
  let i = 0;
  let out = "<th>";
  while (headerArray[i]){
    out += "<td>"+headerArray[i]+"</td>";
    i++;
  }
  out += "</th>";
  return out;
}

function displayResults(rowArray, headerArray){
  output = String(headerArray);
  let n = 0
  while (n < rowArray.length){
    output += "<p>"+rowArray[n]+"</p>";
    n++
  }
  document.getElementById("results").innerHTML = output;
}



function displayFail(which,name){
  switch (which) {
    case "prof":   //prof fail
      document.getElementById("results").innerHTML = "There is no data for professor,"+name+", please try again";
      break;
    case "name":   //name fail
      document.getElementById("results").innerHTML = "There was an error reading the name you inputted, please try again";
      break;
    case "button": //haven't pressed a professor button yet for if they want advisor/professor
      document.getElementById("results").innerHTML = "Please select if you would like to look up professor or advisor reviews, then try submitting again";
      break;
    default:
      document.getElementById("results").innerHTML = "Something went wrong, sorry please try again";
  }
}




// Entrypoint of the dynamic portions of this site, called immediately after
// we source Google's sheets SDK in order to set up the client session then
// fill in site content.
async function main() {
    switch (window.location.href.split("/")[3]) {
    case "":
    case "index.html":
        // This here code is an ugly attempt at extracting the json from
        // our test sheet

        sheet_i  = professorSheetId
        dataResponse = await fetchIt(professorDataRange, sheet_i);
        refResponse = await fetchIt(professorRefRange, sheet_i);
        refArray = createArray(0,refResponse);
        headerArray = createArray(0, dataResponse);

        break;
    case "advisor_feedback.html":
        display("<iframe src='" + advisor_form + "'>loading...<iframe>")
        break;
    case "professor_feedback.html":
        display("<iframe src='" + professor_form + "'>loading...<iframe>")
        break;
    case "results.html":
        profResponse = await fetchIt(professorDataRange, professorSheetId);
        profRef = await fetchIt(professorRefRange, professorSheetId);
        profRefArray = createArray(0,profRef);
        profHeaderArray = createArray(0, profResponse);

        advisorResponse = await fetchIt(advisorDataRange, advisorSheetId);
        advisorRef = await fetchIt(advisorRefRange, advisorSheetId);
        advisorRefArray = createArray(0, advisorRef);
        advisorHeaderArray = createArray(0, advisorResponse);
        break;
    case "search.html":
        display("Display search results");
        break;
    default:
        display("If you're seeing this the webmaster broke something")
    }
}

function toggleProfessor() {
  dataResponse = profResponse;
  refResponse = profRef;
  refArray = profRefArray;
  headerArray = profHeaderArray;
  isset = true;

  document.getElementById("profButton").style.backgroundColor = "red";
  document.getElementById("advisorButton").style.backgroundColor = "white";
}

function toggleAdvisor() {
  dataResponse = advisorResponse;
  refResponse = advisorRef;
  refArray = advisorRefArray;
  headerArray = advisorHeaderArray;
  isset = true;

  document.getElementById("profButton").style.backgroundColor = "white";
  document.getElementById("advisorButton").style.backgroundColor = "red";
}


function onSearch(){
  if (isset) {
    var name = document.getElementById("searchBox");
    name = name.value;
    if (name){
      prof = findProfessor(dataResponse,refResponse, refArray, name);
      if (prof){
        displayResults(prof,headerArray);
      }else {
        displayFail("prof",name);
      }
    }else{
      displayFail("name",name);
    }
  }else{
    displayFail("button","no")
  }
}

var input = document.getElementById("searchBox");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("searchButton").click();
  }
});
