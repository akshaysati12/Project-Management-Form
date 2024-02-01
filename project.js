

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var proDBName = "PROJECT";  
var schoolRelationName = "SCHOOL-DB";  // Added quotes assuming it's a string
var connToken = "90931787|-31949308028155318|90963045";

$("#proid").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no); 
}

function getEmpIdAsJsonObj() {
    var proid = $("#proid").val(); 
    var jsonStr = {
        id: proid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#proname").val(record.name);
    $("#assigTo").val(record.Assig);
    $("#assigDate").val(record.AssigD);
    $("#deadline").val(record.Deadl);    
}



function validateData() {
    var proid, proname, assigTo, assigDate, deadline;
    proid = $("#proid").val();
    proname = $("#proname").val();
    assigTo = $("#assigTo").val();
    assigDate = $("#assigDate").val();
    deadline = $("#deadline").val();

    if (proid === "") {
        alert("proid is missing");
        $("#proid").focus();
        return "";
    }
    if (proname === "") {
        alert("proname is missing");
        $("#proname").focus();
        return "";
    }
    if (assigTo === "") {
        alert("Assigned missing");
        $("#assigTo").focus();
        return "";
    }
    if (assigDate === "") {
        alert("AssignedDate is missing");
        $("#assigDate").focus();
        return "";
    }
    if (deadline === "") {
        alert("Please enter the deadline");
        $("#deadline").focus();
        return "";
    }

    var jsonStrObj = {
        id: proid,
        name: proname,
        Assig: assigTo,
        AssigD: assigDate,
        Deadl: deadline
    };
    return JSON.stringify(jsonStrObj);
}

function getEmp() {
    var proidJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, proDBName, schoolRelationName, proidJsonObj);  // Implement createGET_BY_KEYRequest
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);  // Implement executeCommandAtGivenBaseUrl
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#proname").focus();
    } else if (resJsonObj.status === 200) {
        $("#proid").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#proname").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return;
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, proDBName, schoolRelationName);  // Implement createPUTRequest
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);  // Implement executeCommandAtGivenBaseUrl
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#proid").focus();
}

function changeData() {
    $("#change").prop("disabled", true);
    var jsonChg = validateData();  // Corrected variable name
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, proDBName, schoolRelationName, localStorage.getItem("recno"));  // Implement createUPDATERecordRequest
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);  // Implement executeCommandAtGivenBaseUrl
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();    
    $("#proid").focus();
}

function resetForm() {
    $("#proid").val("");
    $("#proname").val("");
    $("#assigTo").val("");
    $("#assigDate").val("");
    $("#deadline").val("");
    $("#proid").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#proid").focus();
}
