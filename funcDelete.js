"use strict";
var Sdk = window.Sdk || {};

/**
 * @function getClientUrl
 * @description Get the client URL.
 * @returns {string} The client URL.
 */
Sdk.getClientUrl = function () {
    var context;
    // GetGlobalContext defined by including reference to 
    // ClientGlobalContext.js.aspx in the HTML page.
    if (typeof GetGlobalContext != "undefined") {
        context = GetGlobalContext();
    } else {
        if (typeof Xrm != "undefined") {
            // Xrm.Page.context defined within the Xrm.Page object model for form scripts.
            context = Xrm.Page.context;
        } else {
            throw new Error("Context is not available.");
        }
    }
    return context.getClientUrl();
};


var clientUrl = Sdk.getClientUrl();     // e.g.: https://org.crm.dynamics.com
var webAPIPath = "/api/data/v9.2";      // Path to the web API
var contact1Uri;                        // e.g.: carlos silva


/**
 * @function request
 * @description Generic helper function to handle basic XMLHttpRequest calls.
 * @param {string} action - The request action. String is case-sensitive.
 * @param {string} uri - An absolute or relative URI. Relative URI starts with a "/".
 * @param {object} data - An object representing an entity. Required for create and update actions.
 * @param {object} addHeader - An object with header and value properties to add to the request
 * @returns {Promise} - A Promise that returns either the request object or an error object.
 */
 Sdk.request = function (action, uri, data, addHeader) {
    if (!RegExp(action, "g").test("POST PATCH PUT GET DELETE")) { // Expected action verbs.
        throw new Error("Sdk.request: action parameter must be one of the following: " +
            "POST, PATCH, PUT, GET, or DELETE.");
    }
    if (!typeof uri === "string") {
        throw new Error("Sdk.request: uri parameter must be a string.");
    }
    if ((RegExp(action, "g").test("POST PATCH PUT")) && (!data)) {
        throw new Error("Sdk.request: data parameter must not be null for operations that create or modify data.");
    }
    if (addHeader) {
        if (typeof addHeader.header != "string" || typeof addHeader.value != "string") {
            throw new Error("Sdk.request: addHeader parameter must have header and value properties that are strings.");
        }
    }

    // Construct a fully qualified URI if a relative URI is passed in.
    if (uri.charAt(0) === "/") {
        uri = clientUrl + webAPIPath + uri;
    }

    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
       
        request.open(action, encodeURI(uri), true);
        request.setRequestHeader("OData-MaxVersion", "4.0");
        request.setRequestHeader("OData-Version", "4.0");
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        if (addHeader) {
            request.setRequestHeader(addHeader.header, addHeader.value);
        }
        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                request.onreadystatechange = null;
                switch (this.status) {
                    case 200: // Operation success with content returned in response body.
                    case 201: // Create success. 
                    case 204: // Operation success with no content returned in response body.
                        resolve(this);
                        break;
                    default: // All other statuses are unexpected so are treated like errors.
                        var error;
                        try {
                            error = JSON.parse(request.response).error;
                        } catch (e) {
                            error = new Error("Unexpected Error");
                        }
                        reject(error);
                        break;
                }
            }
        };
        request.send(JSON.stringify(data));
    });
};


Sdk.Del = function() 
{
// Initializing.
    var request = new XMLHttpRequest()
    contact1Uri = "";

    // Section 1.
    //
    // Create the contact using POST request. 
    // A new entry will be added regardless if a contact with this info already exists in the system or not.
    console.log("--Section 1 started--");
    //contact.new_nomeprofessor = nomeA;
    //contact.lastname = "silva";


    var receberId = document.getElementById("id_delete").value;

    //var id = JSON.stringify(receberId);
    
    var entitySetName = "/new_professors";
    var end = 'https://corporation.crm2.dynamics.com/api/data/v9.2'; 

    request.open('DELETE', end + entitySetName + `(${receberId})`);
    console.log("Professor "+ receberId + " deleted with URI: %s");
    
    request.setRequestHeader('Accept', 'application/json')
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    request.setRequestHeader('OData-MaxVersion','4.0');
    request.setRequestHeader('OData-Version', '4.0');
    request.onreadystatechange = function() {
    
        if(this.readyState === 4) {
            request.onreadystatechange = null;
            if(this.status === 204 || this.status === 1223){
    }
            
            else{
               parent.Xrm.Utility.alertDialog(this.statusText);
               alert('Deu errado') 
            }
    
        }
    };
    request.send(); 
    
    } ;