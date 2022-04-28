// -*- indent-tabs-mode: nil -*-
// All JavaScript goes in here
//

const professor_form = "https://docs.google.com/forms/d/e/1FAIpQLSfgfaogSRb2fpxN6UwELg5xWRwCYDup1rv6BHF_Rla3Hizd8w/viewform?embedded=true"

const short_professor_form = "https://forms.gle/FyREV8CzBQMwnhNH6"

const advisor_form = "https://docs.google.com/forms/d/e/" +
      "1FAIpQLSc60U5LNQFxcrewHO1P6Gk4rpYtlkbYxBl0Q_yseNiBgqQ9zg" +
      "/embedded=true"

const professorSheetId = "1N4_AMOYhNMGUgvm4CQSHIp68VWh1L418gH5N0SslQaY";
const professorDataRange = "Data!B1:Q";
const professorRefRange = "Ref!B2:K";
const indexRange = "Index!B2:E2";
const colorRange = "Colors!B2:J2"

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
var profMatrix;
var profMatrixUse
var profRefMatrix;
var currentReviews;

//for the "arrays" used for sorting/organizing professor feedback/ratings
// [first, last, dept, takeAgain, difficulty, race, gender, sexuality, classRating, disability, mentalHealth, academic, start, total]
firstNameIndex = 0;
lastnameIndex = 1;
departmentIndex = 2
retakeRatingIndex = 3;
difficultyIndex = 4;
tagStartIndex = 5;
raceKey = 5;
genderKey = 6
sexualityKey = 7;
classKey = 8;
disabilityKey = 9;
mentalHealthKey = 10;
academicKey = 11;
startIndex = 12;
totalEntriesIndex = 13;

tagNames = ["Race","Gender","Sexuality","Class-tag","Disability","Mental Health","Academic"]


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
    return -1;
  }
}


function getMthColumnData(m, row){//returns the contents of the mth column for a GIVEN row, not rowData object
  tmp = Object.values(row)[m]
  if (tmp != null){
    return tmp.formattedValue
  }else {
    return -1;
  }
}

function getNMElement(n,m,rowData){ //combines the earlier two functions and gets the data in cell (n,m), shouldn't be used much since it doesn't save the row Object
  row = getNthRow(n,rowData)
  if (row != -1){
    return getMthColumnData(m,row)
  }else{
    return -1;
  }
}

function createArray(row, rowData){ //converts the given row into an array
  outArr = [];
  let i = 0;
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
  refIndex = findColumn(refArray, professor.toLowerCase());
  if (refIndex == -1) {
    return false;
  } else {
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

/*
function makeRow(row, first, last){
  let i = 0;
  let out = "<tr>";
  while (row[i]){
    if ((i!=first)&&(i!=last)){
      out += "<td>"+row[i]+"</td>";
    }
    i++;
  }
  out += "</tr>";
  return out;
}
*/

function findTags(row,headerRow){

}

function makeRow(row, headerRow){
  let out = "<div class='reviewDiv'><div class='reviewHeader'><p class='rhe'>"
  if (row[headerRow.indexOf("Warning")].toLowerCase() == "yes"){
    out+= "Yes there are content warnings"
  } else{
    out+= "No content warnings for this review"
  }
  out += "</p><p class='rhe'> Class:  " + row[headerRow.indexOf("Class")] + "</p>"
  out += "<p class='rhe'> Year class was taken:  " + row[headerRow.indexOf("Year")] + "</p>"
  out += "<p class='rhe'> Major of Reviewer:  " + row[headerRow.indexOf("Major")] + "</p>"
  out += "<p class='rhe'> Year class was taken:  " + row[headerRow.indexOf("Year")] + "</p>"
  out += "<p class='rhe'> Difficulty:  " + row[headerRow.indexOf("Difficulty")] + "</p>"
  out += "<p class='rhe'> Retake:  " + row[headerRow.indexOf("Retake")] + "</p>"
  out += "<div><p>Tag Information:</p>"
  let i = 0;
  while (i<tagNames.length){
    if (row[headerRow.indexOf(tagNames[i])] ){
      out += "<p class='rhe'>"+tagNames[i]+":  "+row[headerRow.indexOf(tagNames[i])]+"</p>"
    }
    i++
  }
  out += "</div>"
  out += "</div><hr><div class='reviewBody'><p>"
  out+= row[headerRow.indexOf("Comments")] + "</p></div></div>"
  return out
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

function displayResults(rowArray, headerArray, summary){
  let lastIndex = findColumn(headerArray,"Last");
  let last = rowArray[0][lastIndex];

  let firstIndex = findColumn(headerArray, "First");
  let first = rowArray[0][firstIndex];
  let name = first+" "+last

  let output = makeProfOverview(summary)
  //output+= "<div class=\"table-wrapper\"><table class=\"fl-table\">";
  output += "<hr><div>"
  //output += makeHeadRow(headerArray);

  let n = 0;
  while (n < rowArray.length){
    output += makeRow(rowArray[n],headerArray);
    output += "<hr>"
    n++
  }
  output += "</div>"
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
  toDisplay = "<div class='overviewItem'>"

  toDisplay += "<div class='overviewHeader'>"
  toDisplay += "<button class='main-button' onclick=searchWithInput(\x22"
  toDisplay += profArray[lastnameIndex]
  toDisplay += "\x22)>";
  toDisplay += profArray[firstNameIndex]
  toDisplay += " "
  toDisplay += profArray[lastnameIndex]
  toDisplay += "</button></div>"

  toDisplay += "<div class='overviewPicture'>"
  toDisplay += "<img class=\x22profPicture\x22 src=\x22 https://www.reed.edu/faculty-profiles/profiles/photos/"
  toDisplay += profArray[lastnameIndex]
  toDisplay += "-"
  toDisplay += profArray[firstNameIndex]
  toDisplay += ".jpg\x22</img></div>"

  toDisplay += "<div class='overviewBody'><div class='overviewMember'>Department:  "+profArray[departmentIndex]+"</div>"
  toDisplay += "<div class='overviewMember'>Take Again:  "+profArray[retakeRatingIndex] +"  %</div>"
  toDisplay += "<div class='overviewMember'>Difficulty:  " +profArray[difficultyIndex]+ "  /10</div>"
  let i = 0;
  while (i<tagNames.length){
    if (profArray[tagStartIndex+i]){
      toDisplay += "<div class='overviewMember'>"+tagNames[i]+":  "+profArray[tagStartIndex+i]+"  /10</div>"
    }
    i++
  }
  toDisplay += "</div></div>"
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
    switch (window.location.href.split("/")[4]) {
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

        colors = await fetchIt(colorRange, professorSheetId);
        colorRow = getNthRow(0,colors)
        var r = document.querySelector(':root');
        r.style.setProperty('--main-pg-bg', getMthColumnData(0,colorRow))
        r.style.setProperty('--nav-bar-bg', getMthColumnData(1,colorRow))
        r.style.setProperty('--nav-bar-txt', getMthColumnData(2,colorRow))
        r.style.setProperty('--title', getMthColumnData(3,colorRow))
        r.style.setProperty('--btn-hover', getMthColumnData(4,colorRow))
        r.style.setProperty('--main-btn-color', getMthColumnData(5,colorRow))
        r.style.setProperty('--summary-bg', getMthColumnData(6,colorRow))
        r.style.setProperty('--review-bg', getMthColumnData(7,colorRow))
        r.style.setProperty('--page-bg',getMthColumnData(8,colorRow))

        break;
    case "advisor_feedback.html":
        display("<iframe src='" + advisor_form + "'>loading...<iframe>")
        colors = await fetchIt(colorRange, professorSheetId);
        colorRow = getNthRow(0,colors)
        var r = document.querySelector(':root');
        r.style.setProperty('--main-pg-bg', getMthColumnData(0,colorRow))
        r.style.setProperty('--nav-bar-bg', getMthColumnData(1,colorRow))
        r.style.setProperty('--nav-bar-txt', getMthColumnData(2,colorRow))
        r.style.setProperty('--title', getMthColumnData(3,colorRow))
        r.style.setProperty('--btn-hover', getMthColumnData(4,colorRow))
        r.style.setProperty('--main-btn-color', getMthColumnData(5,colorRow))
        r.style.setProperty('--summary-bg', getMthColumnData(6,colorRow))
        r.style.setProperty('--review-bg', getMthColumnData(7,colorRow))
        r.style.setProperty('--page-bg',getMthColumnData(8,colorRow))
        break;
    case "professor_feedback.html":
        display("<a href='"+short_professor_form+"'>Click here if you don't see the form</a>"
        +"<iframe src='" + professor_form + "'>Loading...<iframe>")
        colors = await fetchIt(colorRange, professorSheetId);
        colorRow = getNthRow(0,colors)
        var r = document.querySelector(':root');
        r.style.setProperty('--main-pg-bg', getMthColumnData(0,colorRow))
        r.style.setProperty('--nav-bar-bg', getMthColumnData(1,colorRow))
        r.style.setProperty('--nav-bar-txt', getMthColumnData(2,colorRow))
        r.style.setProperty('--title', getMthColumnData(3,colorRow))
        r.style.setProperty('--btn-hover', getMthColumnData(4,colorRow))
        r.style.setProperty('--main-btn-color', getMthColumnData(5,colorRow))
        r.style.setProperty('--summary-bg', getMthColumnData(6,colorRow))
        r.style.setProperty('--review-bg', getMthColumnData(7,colorRow))
        r.style.setProperty('--page-bg',getMthColumnData(8,colorRow))
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
        profMatrix = makeMatrix(profResponse)
        profMatrixUse = profMatrix
        profMatrix.freeze
        profRefMatrix = makeRefMatrix(profRef)
        profRefMatrix.freeze
        dataArray = makeDataArray(profResponse, profRef, profRefArray)
        sortProfs()
        fillDropDownMenu();

        colors = await fetchIt(colorRange, professorSheetId);
        colorRow = getNthRow(0,colors)
        var r = document.querySelector(':root');
        r.style.setProperty('--main-pg-bg', getMthColumnData(0,colorRow))
        r.style.setProperty('--nav-bar-bg', getMthColumnData(1,colorRow))
        r.style.setProperty('--nav-bar-txt', getMthColumnData(2,colorRow))
        r.style.setProperty('--title', getMthColumnData(3,colorRow))
        r.style.setProperty('--btn-hover', getMthColumnData(4,colorRow))
        r.style.setProperty('--main-btn-color', getMthColumnData(5,colorRow))
        r.style.setProperty('--summary-bg', getMthColumnData(6,colorRow))
        r.style.setProperty('--review-bg', getMthColumnData(7,colorRow))
        r.style.setProperty('--page-bg',getMthColumnData(8,colorRow))

        break;
    case "search.html":
        display("Display search results");
        break;
    default:
        display("If you're seeing this the webmaster broke something")
    }
}

function fillDropDownMenu(){
  let header = profMatrix[0];
  let outWrite = ""
  outWrite += "<option value=5 selected=/x22selected/x22>"+header[5]+"</option>"
  let i = 6;
  while (i < header.length){
    outWrite += "<option value="+i+">"+header[i]+"</option>"
    i++
  }
  document.getElementById("reviewSort").innerHTML = outWrite;
}

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

function getDataFromIndices(data, start, total){
  outData = [];
  let j = 0;
  while (j < total){
    outData.push(createArray(start+ j, data));
    j++;
  }
  return outData;
}


function generateProfArray(matrix, header, start, total, professor) {
  let profArray = matrix

  let takeIndex = header.indexOf("Retake")
  let diffIndex = header.indexOf("Difficulty")
  takeAgain = 0;
  let takeNum = 0
  difficulty = 0;
  let diffNum = 0;

  let tagIndexes = new Array(tagNames.length).fill(0);
  let n = 0;
  while (n<tagNames.length){
    tagIndexes[n] = header.indexOf(tagNames[n])
    n++;
  }
  tagValues = new Array(tagNames.length).fill(0)
  tagNums = new Array(tagNames.length).fill(0)


  let i = 0;
  while (i<matrix.length){
    let curr = profArray[i];
    if (takeTmp = curr[takeIndex]){
      if (takeTmp == "Yes"){
        takeAgain++
      }
      takeNum++;
    }
    if (curr[diffIndex]){
      difficulty += Number(curr[diffIndex])
      diffNum++;
    }
    let j = 0;
    while (j<tagNames.length){
      if (curr[tagIndexes[j]]>0){
        tagValues[j] += Number(curr[tagIndexes[j]])
        tagNums[j]++
      }
      j++
    }
    i++;
  }
  takeAgain = Math.round(100*100*takeAgain/(takeNum))/100;
  difficulty = Math.round(100*difficulty/(diffNum))/100;

  let k = 0;
  while (k<tagNames.length){
    if (tagNums[k] > 0){
      tagValues[k] = Math.round(100*tagValues[k]/(tagNums[k]))/100
    }else{
      tagValues[k] = 0;
    }
    k++;
  }


  first = profArray[0][header.indexOf("First")];
  dept = profArray[0][header.indexOf("Department")];
  last = profArray[0][header.indexOf("Last")]
  returnArray = [first, last, dept, takeAgain, difficulty]
  return returnArray.concat(tagValues,[start, total])
}

function makeMatrix(data){
  return getDataFromIndices(data, 0, data.length)
}

function makeRefMatrix(refData){
  return getDataFromIndices(refData, 0, 3)
}


function makeDataArray(dataResponse, refResponse, refArray){
  profDataArray = [];
  let matrix = profMatrixUse
  let header = matrix[0]
  let i = 1;
  while (i < refArray.length) {
    var startIndex = Number(getNMElement(1,i,refResponse));
    if (startIndex >= 0 ) {
      var totalIndex = Number(getNMElement(2,i,refResponse))
      if (totalIndex >= 0){
        var useMatrix = matrix.slice(startIndex,(startIndex + totalIndex))
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
function sortDepartmentReverse(a,b){
  if(a[departmentIndex] < b[departmentIndex]){
    return -1
  }else if (a[departmentIndex] > b[departmentIndex]){
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
function sortRetakeReverse(a,b){
  if(a[retakeRatingIndex] < b[retakeRatingIndex]){
    return -1
  }else if (a[retakeRatingIndex] > b[retakeRatingIndex]){
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
function sortDifficultyReverse(a,b){
  if(a[difficultyIndex] < b[difficultyIndex]){
    return -1
  }else if (a[difficultyIndex] > b[difficultyIndex]){
    return 1
  }else{
    return 0
  }
}
function sortDataArray(array,sortFn){
  array.sort(sortFn)
  return array
}
function sortProfs(){
  let criteria = Number(document.getElementById("sortCriteria").value);
  if (!showOverview){
    document.getElementById("overviews").style.visibility = 'visible';
    document.getElementById("overviews").style.display = 'block';

    document.getElementById("results").style.display = 'none';
    document.getElementById("results").style.visibility = 'hidden';
    showOverview = true;
  }
  let reverse;
  if (document.getElementById("reverseSummaries").checked == true){
    reverse = true;
  }else{
    reverse = false;
  }
  switch (criteria){
    case 0:
      if (reverse){
        displaySummaries(sortDataArray(dataArray,sortDepartmentReverse))
      }else{
        displaySummaries(sortDataArray(dataArray,sortDepartment))
      }
      break;
    case 1:
      if (reverse){
        displaySummaries(sortDataArray(dataArray,sortRetakeReverse))
      }else{
        displaySummaries(sortDataArray(dataArray, sortRetake))
      }
      break;
    case 2:
      if (reverse){
        displaySummaries(sortDataArray(dataArray,sortDifficultyReverse))
      }else{
        displaySummaries(sortDataArray(dataArray, sortDifficulty))
      }
      break;
    default:
      document.getElementById("overviews").innerHTML = "If you're seeing this, most likely the webmaster broke something. Sorry!"
    }
}

function findProfIndex(name){
  let i = 0;
  while (i<dataArray.length){
    if (name == dataArray[i][lastnameIndex].toLowerCase()){
      return  i;
    }
    i++;
  }
  return -1
}

function findProfSummary(name){
  let index = findProfIndex(name);
  if (index != -1){
    return dataArray[index]
  }else{
    return -1;
  }
}

function showSummaries(){
  if (!showOverview){
    document.getElementById("overviews").style.visibility = 'visible';
    document.getElementById("overviews").style.display = 'block';

    document.getElementById("results").style.display = 'none';
    document.getElementById("results").style.visibility = 'hidden';
    showOverview = true;
  }
}

function onSearch(){
  if (isset) {
    var name = document.getElementById("searchBox");
    name = name.value
    name = name.toLowerCase();
    if (name){
      let arrayIndex = profRefMatrix[0].indexOf(name)
      if (arrayIndex >= 0){
        if (showOverview){
          document.getElementById("overviews").style.display = 'none';
          document.getElementById("overviews").style.visibility = 'hidden';

          document.getElementById("results").style.visibility = 'visible';
          document.getElementById("results").style.display = 'block';
          showOverview = false;
        }
        let startIndex = Number(profRefMatrix[1][arrayIndex])
        let total = Number(profRefMatrix[2][arrayIndex])
        currentReviews = profMatrix.slice(startIndex,startIndex+total)
        overview = findProfSummary(name.toLowerCase())
        displayResults(currentReviews,profMatrix[0],overview)
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

function searchWithInput(profName){
  name = profName.toLowerCase();
  toggleProfessor();
  document.getElementById("searchBox").value = name;
  onSearch();
}

function genericReviewSorterMaker(index,reverse){
  if (reverse){
    return function sort(a,b){
      if(a[index] < b[index]){
        return -1
      }else if (a[index] > b[index]){
        return 1
      }else{
        return 0
      }
    }
  } else{
  return function sort(a,b){
    if(a[index] > b[index]){
      return -1
    }else if (a[index] < b[index]){
      return 1
    }else{
      return 0
    }
  }
}
}

function sortReviews(){
  if (currentReviews){
    let reverse = document.getElementById("reverseReviews").checked
    let sorter = genericReviewSorterMaker(Number(document.getElementById("reviewSort").value), reverse)
    overview = findProfSummary(document.getElementById("searchBox").value.toLowerCase())
    displayResults(sortDataArray(currentReviews,sorter),profMatrix[0],overview)
  }
}


//functions for button management in results page
function changeActive(active){
  active.style.backgroundColor = "var(--btn-hover)";
  active.style.color = "white";
}

function changePassive(passive){
  passive.style.backgroundColor = "white";
  passive.style.color = "black";
}

function toggleProfessor() {
  dataResponse = profResponse;
  refResponse = profRef;
  refArray = profRefArray;
  headerArray = profHeaderArray;
  isset = true;

  changeActive(document.getElementById("profButton"))
  changePassive(document.getElementById("advisorButton"))
}

function toggleAdvisor() {
  dataResponse = advisorResponse;
  refResponse = advisorRef;
  refArray = advisorRefArray;
  headerArray = advisorHeaderArray;
  isset = true;

  changePassive(document.getElementById("profButton"))
  changeActive(document.getElementById("advisorButton"))
}
