var CLIENT_ID = '741003728693-o30686b65lf3np0fd6lbhngfhmv5oqkh.apps.googleusercontent.com'
var API_KEY = 'AIzaSyAtQULaPG_AsmOKmsWESJEESDuqOPs8IdU'
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Committee Spreadsheet IDS
var sheetIDS = {
    "artsAndCulture": '1mbu-7VK5mqQk2FNKwwk0b5CGbXt1nGaW53rVa4lbvPc',
    "currentEvents": '12a9SZndguVFyRlO8xbAj9vLQ5J45Dmn8DIeEBenVOSY',
    "entertainment": '1CwhXGiTaf8QZHMfSOiBkF2CrqQlPRYPiB0-j-BHADRI',
    "publicity": '1rU7315Nl-fZpTU2YCRcKWUmYUBqlSLMfhFEJ7e8slf8',
    "purdueAfterDark": '1cYa09UftGhaE8ExG9bJnuxwAgalSbY4-t5abFZY1QPQ',
    "spiritAndTraditions": '1r7cxTeWDccKVAp4_cd9BKSnhxqRxQv9goxEYafTPv5I'
}

//All Committee Data
var committees = {
    "artsAndCulture": [],
    "currentEvents": [],
    "entertainment": [],
    "publicity": [],
    "purdueAfterDark": [],
    "spiritAndTraditions": []
};

var committeeList = ["artsAndCulture", "currentEvents", "entertainment", "publicity", "purdueAfterDark", "spiritAndTraditions"];
let execList = ["President", "Personnel", "Finance and Logistics", "Campus Relations"];

//All Intercommittee Points
var points = {
    "artsAndCulture": 0,
    "currentEvents": 0,
    "entertainment": 0,
    "publicity": 0,
    "purdueAfterDark": 0,
    "spiritAndTraditions": 0
}

var scripts = {
    "artsAndCulture": "https://script.google.com/macros/s/AKfycbwHZInpf-2XVeATHRFTi2s2KMFh5odvbvGvLYmdVah-Mc0j1ss/exec",
    "currentEvents": "https://script.google.com/macros/s/AKfycbxNNSZ-oIRBXZUm1I6isLwo0LpNQxpI-y6Gur_9-Jmu2Hcwo7E/exec",
    "entertainment": "https://script.google.com/macros/s/AKfycbx5kmyOMiui5joHakz-RDs5AtHYI64I7BBZ_rkLBWVww5RClrw/exec",
    "publicity": "https://script.google.com/macros/s/AKfycbxsLiZpXYRBjCN2Eo5GYvxmv-BDoMu9JcX2CX2LSRldleYlxPM/exec",
    "purdueAfterDark": "https://script.google.com/macros/s/AKfycbwsOqIWytba8oZvq9NaZ1bshNIkKPD2-jwrfOILRVcQVosB0j4/exec",
    "spiritAndTraditions": "https://script.google.com/macros/s/AKfycbyCj7FY0DXRp1T_gTH6mM261puqhUGqIvIXdGo5Yp-FXJ5VUqk/exec"
}

//Current Information
var currentCommittee = "";
var currentName = "";
var currentData = {};
let dataCount = 0;

function load() {
    if(localStorage.getItem("psubPortal") == null){
        console.log("Local Storage Empty");
        for (var i = 0; i < committeeList.length; i++) {
            data(committeeList[i]);
        }
    }
    else{
        console.log("Local Storage Found. Redirecting");
        let name = JSON.parse(localStorage.getItem("psubPortal")).name;
        let committee = JSON.parse(localStorage.getItem("psubPortal")).committee;
        if(name !== "Director "){
            window.location.replace("hours/hours.html");
        }
        else{
            if(committeeList.indexOf(committee) !== -1){
                window.location.replace("attendance/attendance.html");
            }
            else{
                window.location.replace("marketing/marketing.html");
            }
        }
    }
}

function data(committee) {
    console.log('Loading ' + committee + ' data');
    if (committees[committee].length !== 0) {
        committees[committee] = [];
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": 'https://spreadsheets.google.com/feeds/list/' + sheetIDS[committee] + '/1/public/full?alt=json-in-script',
        "method": "GET",
        "headers": {
        }
    }

    $.ajax(settings).done(function (response) {
        //console.log(response);
        response = response.substring(response.indexOf("{"), response.length - 2)
        var response = JSON.parse(response);
        console.log(response);
        for (var i = 0; i < response.feed.entry.length; i++) {
            if (i !== response.feed.entry.length - 1) {
                var tempName = response.feed.entry[i].gsx$name.$t;
                var tempPin = response.feed.entry[i].gsx$pin.$t;
                var tempID = response.feed.entry[i].gsx$sheetid.$t;
                var tempHours = response.feed.entry[i].gsx$hours.$t;
                var tempPoints = response.feed.entry[i].gsx$points.$t;

                committees[committee].push({ name: tempName, pin: tempPin, id: tempID, number: i + 2, hours: tempHours, points: tempPoints });

            }
            else {
                var tempHours = response.feed.entry[i].gsx$committeehours.$t
                var tempPoints = response.feed.entry[i].gsx$committeepoints.$t

                committees[committee].push({ totalHours: tempHours, totalPoints: tempPoints });
            }
        }
        console.log(committees[committee]);
    });
    console.log("Data Loaded Successfully");
}


function committeeChange() {
    $("#memberSelect").empty();
    var select = document.getElementById("committeeSelect");
    var text = select.options[select.selectedIndex].text; //committee Text

    if(text !== "Board of Directors"){
        text = text.substring(0, 1).toLowerCase() + text.substring(1, text.length);
        text = text.replace(/\s/g, '') //Manipulation Done
        
        var optionsAsString = "";
        for (var i = 0; i < committees[text].length - 1; i++) {
            optionsAsString += "<option value='" + committees[text][i].name + "'>" + committees[text][i].name + "</option>";
        }
        $("#memberSelect").html(optionsAsString);
        console.log("Members Updated");
    }
    else{
        let committees = ["After Dark", "Current Events", "Entertainment", "Fine Arts", "Publicity", "Spirit and Traditions"];
        let committeeValues = ["purdueAfterDark", "currentEvents", "entertainment", "artsAndCulture", "publicity","spiritAndTraditions"];

        var optionsAsString = "";
        for(let i = 0; i < committees.length; i++){
            optionsAsString += "<option value='" + committeeValues[i] + "'>" + committees[i] + "</option>";
        }
        for(let i = 0; i < execList.length; i++){
            optionsAsString += "<option value='" + execList[i] + "'>" + execList[i] + "</option>";
        }
        $("#memberSelect").html(optionsAsString);
        console.log("Members Updated");
    }
}

document.getElementById('login-form').onkeydown = function(e){
    // Login on Enter
    if(e.keyCode == 13){
      login();
    }
 };

function login() {
    console.log("Login Attempted");
    var selectedCommittee = document.getElementById("committeeSelect");
    var selectedUser = document.getElementById("memberSelect");

    var committee = selectedCommittee.options[selectedCommittee.selectedIndex].text;
    var user = selectedUser.options[selectedUser.selectedIndex].text;

    if (committee === 'Select Your Committee' || user === 'Committee Not Selected') {
        unsuccessfulLogin("Committee and/or Member Information Missing");
    }
    else {

        committee = committee.substring(0, 1).toLowerCase() + committee.substring(1, committee.length);
        committee = committee.replace(/\s/g, '') //Manipulation Done

        var pinInput = document.getElementById("pinText").value;

        // console.log(committee + ", " + user + ", " + pinInput);
        
        if(committee !== "boardofDirectors"){
            for (var i = 0; i < committees[committee].length; i++) {
                if (committees[committee][i].name === user) {
                    if (committees[committee][i].pin === pinInput) {
                        console.log("Successful Login");
                        successfulLogin(committees[committee][i], committee);
                    }
                    else {
                        unsuccessfulLogin("Incorrect PIN");
                    }
                    i = committees[committee].length;
                }
            }
        }
        else{
            let newCommittee = selectedUser.options[selectedUser.selectedIndex].value;
            console.log(newCommittee);
            console.log("BOD Login");
            let dataObj = {
                // "committee": newCommittee,
                "name": "Director "
            };

            if(pinInput === user){
                successfulLogin(dataObj, newCommittee);
            }
            else{
                unsuccessfulLogin("Incorrect PIN");
            }
        }
    }


}

function successfulLogin(data, committee) {
    console.log("DATA: " + data);
    let storageObj = data;
    storageObj["committee"] = committee;
    localStorage.setItem("psubPortal", JSON.stringify(storageObj));

    if(committeeList.indexOf(storageObj.committee) !== -1){
        window.location.replace("attendance/attendance.html");
    }
    else if(execList.indexOf(storageObj.committee) !== -1){
        window.location.replace("marketing/marketing.html");
    }
    else{
        window.location.replace("hours/hours.html");
    }
}

function unsuccessfulLogin(reason) {
    console.log("Unsuccessful Login");
    alert("Login Unsuccessful: " + reason)
}

function adjustTheme(){
    let button = document.getElementById("themeToggle");
    if(button.innerHTML == "Turn Off Theme"){
        document.getElementsByClassName("body")[0].id = "normalTheme";
        button.innerHTML = "Turn On Theme";
        document.getElementsByTagName("canvas")[0].style.display = "none";
        document.getElementById("logo").src="Logo.png"
    }
    else{
        document.getElementsByClassName("body")[0].id = "particles-js";
        button.innerHTML = "Turn Off Theme";
        document.getElementsByTagName("canvas")[0].style.display = "block";
        document.getElementById("logo").src="Logo-Thanksgiving.png";
    }
}

//   Particles
particlesJS("particles-js", {"particles":{"number":{"value":19,"density":{"enable":true,"value_area":800}},"color":{"value":"#fff"},"shape":{"type":"image","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/146/maple-leaf_1f341.png","width":100,"height":100}},"opacity":{"value":0.5,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":20.042650760819036,"random":true,"anim":{"enable":false,"speed":40,"size_min":1.6241544246026904,"sync":false}},"line_linked":{"enable":false,"distance":500,"color":"#ffffff","opacity":0.4,"width":2},"move":{"enable":true,"speed":3,"direction":"bottom","random":true,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"bubble"},"onclick":{"enable":false,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":4,"duration":0.3,"opacity":1,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});var count_particles, stats, update; stats = new Stats; stats.setMode(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); count_particles = document.querySelector('.js-count-particles'); update = function() { stats.begin(); stats.end(); if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } requestAnimationFrame(update); }; requestAnimationFrame(update);