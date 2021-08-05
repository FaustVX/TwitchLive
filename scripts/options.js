/*
	Copyright 2012
	Mike Chambers
	mikechambers@gmail.com

	http://www.mikechambers.com
*/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global localStorage, document, chrome, setTimeout*/

(function () {

    "use strict";

    let usernameInput;
    let saveButton;
    let notificationsCB;
    let openInPopoutCB;
    let ignoreVodcastsCB;
      

    let save = function() {
        


        if(usernameInput.value.trim().length == 0) {
            showStatusMessage("Account Name Required.");
            return;
        }
        if(usernameInput.value == localStorage.accountName && localStorage.userId) {
            storeData();
            return;
        }

        let url = "https://api.twitch.tv/kraken/users?login=" + encodeURI(usernameInput.value);
        background.callApi(url, (rawData) => {onUserInfoLoad(rawData)}, onUserInfoError);
    }

    let onUserInfoLoad = function(rawData) {
        let id;

        try {
            if(!rawData.users.length) {
                showStatusMessage("Account name not found.");
                return;
            }
            id = rawData.users[0]._id;

        } catch(e) {
            console.log("Error retrieving user id");
            console.log(e);
            showStatusMessage("Error retrieving user id");
            return;
        }

        storeData(id);
    }

    let onUserInfoError = function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("onUserInfoError");
        console.log("------------------------Error Loading User Info-------------------------------------");
        console.log("onUserInfoError : " + XMLHttpRequest.responseText);
        console.log("Time : " + new Date().toString());
        console.log("XMLHttpRequest :", XMLHttpRequest);
        console.log("textStatus :", textStatus);
        console.log("errorThrown :", errorThrown);
        console.log("------------------------------End Error----------------------------------------");
    }

    let storeData = function(userId) {
         
        localStorage.accountName = usernameInput.value;
        localStorage.showNotifications = notificationsCB.checked;
        localStorage.openInPopout = openInPopoutCB.checked;
        localStorage.ignoreVodcasts = ignoreVodcastsCB.checked;

        if(userId) {
            localStorage.userId = userId;
        }
        
        showStatusMessage("Options Saved");
    }
    
    let showStatusMessage = function(msg) {
        let status = document.getElementById("status");
        status.innerHTML = msg;
        status.style.opacity = 1;
        
        setTimeout(function () {
            status.innerHTML = "";
            status.style.opacity = 0;
        }, 4000);
    }
    
    let background;
    let init = function() {
        
        background = chrome.extension.getBackgroundPage();

        let accountName = localStorage.accountName;
        usernameInput = document.getElementById("username");
        
        if (accountName) {
            usernameInput.value = accountName;
        }
        
        notificationsCB = document.getElementById("showNotificationsCheck");
        let showNotifications = (localStorage.showNotifications === "true");
        
        if (showNotifications) {
            notificationsCB.checked = true;
        }
     
        openInPopoutCB = document.getElementById("openInPopoutCheck");
        let openInPopout = (localStorage.openInPopout === "true");
        
        if (openInPopout) {
            openInPopoutCB.checked = true;
        }
        
        ignoreVodcastsCB = document.getElementById("ignoreVodcastsCheck");
        let ignoreVodcasts = (localStorage.ignoreVodcasts === "true");
        
        if (ignoreVodcasts) {
            ignoreVodcastsCB.checked = true;
        }

        saveButton = document.getElementById("save-button");
        saveButton.onclick = save;
    }

    init();
}());