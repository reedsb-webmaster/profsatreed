// -*- indent-tabs-mode: nil -*-
// All JavaScript goes in here
//

const professor_form = "https://docs.google.com/forms/d/e/" +
      "1FAIpQLSe750TrU5eKALR8WIZxF_4sKmpKwEnd77-1fNHCvCoMbkCj-Q" +
      "/embedded=true"
const advisor_form = "https://docs.google.com/forms/d/e/" +
      "1FAIpQLSc60U5LNQFxcrewHO1P6Gk4rpYtlkbYxBl0Q_yseNiBgqQ9zg" +
      "/embedded=true"

const professorSheetId = "1lmlJA0cH4x51C1wshULfHPgRRX9vNtgy5NYuCLLsUV0";
const professorDataRange = "Data!E17:H50";
const professorDataRange = "Data!E17:K50";
const professorRefRange = "Ref!B2:M50";
const indexRange = "index!B2:E2";

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
var isset = false; //single bit/binary to determine if either of the buttons have been pressed yet
var showOverview = true;

var profDataArray;

//for the "arrays" used for sorting/organizing professor feedback/ratings
firstNameIndex = 0;
lastnameIndex = 1;
departmentIndex = 2
retakeRatingIndex = 3;
difficultyIndex = 4;
comfortableIndex = 5;
startIndex = 6;
totalEntriesIndex = 7;


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
    return -1;
  }
}


function getMthColumnData(m, row){//returns the contents of the mth column for a GIVEN row, not rowData object
  tmp = Object.values(row)[m]
  if (tmp != null){
    return tmp.formattedValue
  }else {
    return false
    return -1;
  }
}

function getNMElement(n,m,rowData){ //combines the earlier two functions and gets the data in cell (n,m), shouldn't be used much since it doesn't save the row Object
  row = getNthRow(n,rowData)
  return getMthColumnData(m,row)
  if (row != -1){
    return getMthColumnData(m,row)
  }else{
    return -1;
  }
}

function createArray(row, rowData){ //converts the given row into an array
  outArr = [];
  let i = 0;
  headRow = getNthRow(row, rowData)
  while (append = getMthColumnData(i, headRow)){
    outArr.push(append)
    i++
  headRow = getNthRow(row,rowData)
  if (headRow != -1){
    let flag = true
    while (flag){
      append = getMthColumnData(i, headRow)
      if (append != -1){
        outArr.push(append)
      } else{
        flag = false;
        break
      }
      i++
    }
    return outArr;
  }else{
    return false;
  }
  return outArr
}

function findColumn(arr, title){
  if (typeof(arr)=="undefined"){
    return false;
  }else{
    return arr.indexOf(title);
  }
}



function findProfessor(data, reference, refArray, professor){ //returns an object of the full rows where "professor" exists, or returns false
  //find the row(s) where the professor exists
  refIndex = findColumn(refArray, professor);
  if (refIndex == -1) {
    return false;
  } else {
    startRow = Number(getNMElement(1, refIndex, reference)) + 1;    //if we fix the formatting of the index listing on the sheet we don't need this
    if (startRow){
    startRow = Number(getNMElement(1, refIndex, reference));    //if we fix the formatting of the index listing on the sheet we don't need this
    if (startRow >= 0){
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

function makeRow(row, nameIndex){
  let i = 0;
  let out = "<tr>";
  while (row[i]){
    if (i!=nameIndex){
      out += "<td>"+row[i]+"</td>";
    }
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
  let nameIndex = findColumn(headerArray,"Professor Name");
  let name = rowArray[0][nameIndex];

  let output = "<p>Displaying Results for:    " + name+ "</p> <div class=\"table-wrapper\"><table class=\"fl-table\">";
  output += makeRow(headerArray,nameIndex);
  

  let n = 0;
  while (n < rowArray.length){
    output += makeRow(rowArray[n],nameIndex);
    n++
  }
  output += "</table></div>"
  document.getElementById("results").innerHTML = output;
}

function displayFail(which,name){
  switch (which) {
    case "prof":   //prof fail
      document.getElementById("results").innerHTML = "There is no data for professor, "+name+", please try again";
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

function makeProfOverview(profArray){
  toDisplay = "<div class='overviewItem'><div class='overviewHeader'>";
  toDisplay += profArray[firstNameIndex]
  toDisplay += " "
  toDisplay += profArray[lastnameIndex]
  toDisplay += "</div><div class='overviewBody'><div class='overviewMember'>Department:  "
  toDisplay += profArray[departmentIndex]
  toDisplay += "</div><div class='overviewMember'>Take Again:  "
  toDisplay += profArray[retakeRatingIndex]
  toDisplay += "</div><div class='overviewMember'>Difficulty:  "
  toDisplay += profArray[difficultyIndex]
  toDisplay += "</div><div class = 'overviewMember'>Comfortable in Class:  "
  toDisplay += profArray[comfortableIndex]
  toDisplay += "</div></div></div>"
  return toDisplay
}

function displaySummaries(array){
  let i = 0
  let show = "<div>"
  while (i<array.length){
    show += makeProfOverview(array[i])
    show += "<hr>"
    i++;
  }
  show += "</div"
  document.getElementById("overviews").innerHTML = show;
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
        respo = await fetchIt(indexRange, sheet_i);
        dataRow = getNthRow(0, respo);
        document.getElementById("mainTitle").innerHTML = getMthColumnData(0,dataRow);
        document.getElementById("bodyOne").innerHTML = getMthColumnData(1,dataRow);
        document.getElementById("bodyTwo").innerHTML = getMthColumnData(2,dataRow);
        document.getElementById("bodyThree").innerHTML = getMthColumnData(3,dataRow);

        profResponse = await fetchIt(professorDataRange, professorSheetId);
        profRef = await fetchIt(professorRefRange, professorSheetId);
        profRefArray = createArray(0,profRef);
        profHeaderArray = createArray(0, profResponse);

        tmp = makeDataArray(profResponse, profRef, profRefArray)

        console.log(tmp)

        tmp = sortDataArray(tmp, sortDifficulty)

        displaySummaries(tmp)

        console.log(tmp);


        //document.getElementById("bodyThree").innerHTML = tmp;


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

        var input = document.getElementById("searchBox");
        input.addEventListener("keyup", function(event) {
          if (event.keyCode === 13) {
           event.preventDefault();
           document.getElementById("searchButton").click();
          }
        });

        dataArray = makeDataArray(profResponse, profRef, profRefArray)
        displaySummaries(dataArray)

        break;
    case "search.html":
        display("Display search results");
        break;
    default:
        display("If you're seeing this the webmaster broke something")
    }
}

function changeActive(active){
  active.style.backgroundColor = "#880404";
  active.style.color = "white";
function getProfIndices(reference, refArray, professor){ //returns an object of the full rows where "professor" exists, or returns false
  //find the row(s) where the professor exists
  refIndex = findColumn(refArray, professor);
  if (refIndex == -1) {
    return false;
  } else {
    startRow = Number(getNMElement(1, refIndex, reference));    //if we fix the formatting of the index listing on the sheet we don't need this
    if (startRow >= 1){
      totRows = Number(getNMElement(2, refIndex, reference));
    }
  }
  return [startRow,totRows];
}

function changePassive(passive){
  passive.style.backgroundColor = "white";
  passive.style.color = "black";
function getDataFromIndices(data, start, total){
  outData = [];
  let j = 0;
  while (j < total){
    outData.push(createArray(start+ j, data));
    j++;
  }
  return outData;
}

function toggleProfessor() {
  dataResponse = profResponse;
  refResponse = profRef;
  refArray = profRefArray;
  headerArray = profHeaderArray;
  isset = true;

  changeActive(document.getElementById("profButton"))
  changePassive(document.getElementById("advisorButton"))
function generateProfArray(matrix, header, start, total, professor) {

  let profArray = matrix

  let takeIndex = header.indexOf("take again")
  let diffIndex = header.indexOf("difficulty")
  let comfIndex = header.indexOf("comfortable")

  takeAgain = 0;
  difficulty = 0;
  comfortable = 0;

  let takeNum = 0;
  let diffNum = 0;
  let comfNum = 0;

  let i = 0;
  while (i<total){
    let curr = profArray[i];
    if (curr[takeIndex]){
      takeAgain += Number(curr[takeIndex]);
      takeNum++;
    }
    if (curr[diffIndex]){
      difficulty += Number(curr[diffIndex])
      diffNum++;
    }
    if (curr[comfIndex]){
      comfortable += Number(curr[comfIndex])
      comfNum++;
    }
    i++;
  }
  takeAgain = takeAgain/(takeNum);
  difficulty = difficulty/(diffNum);
  comfortable = comfortable/(comfNum);

  first = profArray[0][header.indexOf("first")];
  dept = profArray[0][header.indexOf("department")];
  return [first, professor, dept, takeAgain, difficulty, comfortable, start, total]

}

function toggleAdvisor() {
  dataResponse = advisorResponse;
  refResponse = advisorRef;
  refArray = advisorRefArray;
  headerArray = advisorHeaderArray;
  isset = true;
function makeMatrix(data){
  return getDataFromIndices(data, 0, data.length-1)
}

  changePassive(document.getElementById("profButton"))
  changeActive(document.getElementById("advisorButton"))

function makeDataArray(dataResponse, refResponse, refArray){
  profDataArray = [];
  let matrix = makeMatrix(dataResponse)
  let header = matrix[0]
  let i = 1;
  while (i < refArray.length) {
    var startIndex = Number(getNMElement(1,i,refResponse));
    if (startIndex >= 0 ) {
      var totalIndex = Number(getNMElement(2,i,refResponse))
      if (totalIndex >= 0){
        var useMatrix = matrix.slice(startIndex,(startIndex + totalIndex))
        //console.log(useMatrix)
        profDataArray.push(generateProfArray(useMatrix, header, startIndex, totalIndex, refArray[i]));
      }
    }
    i++;
  }
  return profDataArray
}

function sortDepartment(a,b){
  if(a[departmentIndex] > b[departmentIndex]){
    return -1
  }else if (a[departmentIndex] < b[departmentIndex]){
    return 1
  }else{
    return 0
  }
}
function sortRetake(a,b){
  if(a[retakeRatingIndex] > b[retakeRatingIndex]){
    return -1
  }else if (a[retakeRatingIndex] < b[retakeRatingIndex]){
    return 1
  }else{
    return 0
  }
}
function sortDifficulty(a,b){
  if(a[difficultyIndex] > b[difficultyIndex]){
    return -1
  }else if (a[difficultyIndex] < b[difficultyIndex]){
    return 1
  }else{
    return 0
  }
}
function sortComfortable(a,b){
  if(a[comfortableIndex] > b[comfortableIndex]){
    return -1
  }else if (a[comfortableIndex] < b[comfortableIndex]){
    return 1
  }else{
    return 0
  }
}
}



function onSearch(){
  if (isset) {
    var name = document.getElementById("searchBox");
    name = name.value;
    name = name.toLowerCase();
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
