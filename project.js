

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var proDBName = "PROJECT";  
var schoolRelationName = "SCHOOL-DB";  
var connToken = "90931787|-31949308028155318|90963045";

$("#proid").focus();



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
    var getRequest = createGET_BY_KEYRequest(connToken, proDBName, schoolRelationName, proidJsonObj);  
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);  
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
    var putRequest = createPUTRequest(connToken, jsonStrObj, proDBName, schoolRelationName);  
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);  
    resetForm();
    $("#proid").focus();
}

