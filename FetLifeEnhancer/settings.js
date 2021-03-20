var CSVFieldsContainer = document.querySelector("#CSVFields");
var ReadDisclaimer = false;
var ClickedDisclaimerLink = false;

var tooltips = document.querySelectorAll(".Tooltip .TooltipText");
window.onmousemove = function(e){
    for (var i = 0; i < tooltips.length; i++) {
        //tooltips[i].style.top = (e.clientY) + 'px';
        //tooltips[i].style.left = (e.clientX) + 'px';
        tooltips[i].style.top = (e.innerHeight) + "px";
        tooltips[i].style.left = (e.innerWidth) + "px";
    };
};

var tabs = document.getElementsByTagName("h1");
for(let q of tabs){
    if(q.parentNode.parentNode.id === "Content"){
        q.addEventListener("click", function(){
            if(this.parentNode.className !== "active"){
                document.getElementsByClassName("active")[0].setAttribute("class","");
                this.parentNode.setAttribute("class","active");
            };
        });
    };
};
document.getElementsByName("ExpandTabs")[0].addEventListener("click", function(){
    if(this.checked === true){
        for(x of document.querySelectorAll("#Content > div:not(.active)")){
            x.setAttribute("class","active");
        };
    }else{
        for(x of document.querySelectorAll("#Content > div.active:not(:first-child)")){
            x.setAttribute("class","");
        };
    };
});
for(let toggle of document.querySelectorAll("li.toggle > div.showme")){
    toggle.previousElementSibling.querySelector("[type='checkbox']").addEventListener("click", function(){
        if(this.checked === true){
            this.parentNode.nextElementSibling.style.display = "flex";
        }else{
            this.parentNode.nextElementSibling.style.display = "none";
        };
    });
};
if(navigator.userAgent.indexOf("Firefox") > -1){
    var BrowserInfo = "Firefox";
}else if(navigator.userAgent.indexOf("Chrome") > -1){
    var BrowserInfo = "Chrome";
    var PlaceholderCSS = document.createElement("style");
    document.head.append(PlaceholderCSS);
    PlaceholderCSS.sheet.insertRule("input[type='text']::placeholder, input[type='password']::placeholder, textarea::placeholder { color: #bfbfbf; }");
};

function SaveSettings(){
    var CheckValue = new Array();
    const checkboxes = document.querySelectorAll("input[type='checkbox']:not([name*='CSVField']");
    for(let item of checkboxes){
        if(item.checked){
            CheckValue.push(item.getAttribute("name"));
        };
    };
    chrome.storage.sync.set({CheckboxName: CheckValue});

    const TextareaName = document.getElementsByTagName("textarea");
    for(let item of TextareaName){
        if(item.parentNode.className === "textbox"){
            var Name = item.name;
            var Value = item.value.replace(/\r?\n|\r/g, "");
            chrome.storage.sync.set({
                [Name]: Value
            });
        };
    };
    var CSVFields = new Array();
    for(item of document.querySelectorAll(".CSVField")){
        if(item){
            var CSVCheck = item.querySelector("[name=CSVField1]").checked;
            var CSVName = item.querySelector("[name=CSVField2]").value;
            if(CSVName.split(" ").join("") !== ""){
                CSVFields.push([CSVCheck, CSVName]);
                chrome.storage.sync.set({
                    CSVFields: CSVFields
                });
            };
        };
    };
};

function LoadSettings(Restore){
    const EMM = document.querySelector("textarea[name=ExcludeMassMessage]");
    EMM.value = (Restore.ExcludeMassMessage || "");

    if(Restore.DebugFLE){
        document.getElementById("LoggedIn").innerHTML = "settings: " + Restore.FLESettings + "<br />Browser: " + BrowserInfo + "<br />NewVersion: <span id='NewestVersion'>9.9.9</span><br /><a href='javascript:void(0);' id='turnoffdebug'>turn off debug</a>";
        document.getElementById("turnoffdebug").addEventListener("click", function(){
            chrome.storage.sync.remove("DebugFLE");
            window.location.reload(true);
        });
    };
    for(let a of Restore.CheckboxName){
        if(document.querySelector("input[name='" + a + "']:not([name*='CSVField']")) document.querySelector("input[name='" + a + "']:not([name*='CSVField']").setAttribute("checked", "true");
    };
    if(Restore.CSVFields){
        let LoadedField = "";
        for(let a of Restore.CSVFields){
            LoadedField += "<div class='CSVField'>";
            LoadedField += "<div><input type='checkbox' name='CSVField1' " + ((a[0] == true) ? "checked='true'" : "") + "/></div>";
            LoadedField += "<div><input type='text' name='CSVField2' value='" + a[1] + "' placeholder='Enter Field Name' /></div>";
            LoadedField += "<div><input type='button' name='CSVFieldDelete' value='Delete' /></div>";
            LoadedField += "</div>";
        };
        CSVFieldsContainer.innerHTML += LoadedField;
        for(let x of document.querySelectorAll("[type=text]")){
            x.addEventListener("keyup", SaveSettings);
        };
        for(let x of document.querySelectorAll(".CSVField > div > input[type='checkbox']")){
            x.addEventListener("click", SaveSettings);
        };
        for(let x of document.querySelectorAll("[name$='Delete']")){
            x.addEventListener("click", DeleteInputs);
        };
    };

    if(Restore.MassMessageDisclaimer === true){
        ReadDisclaimer = true;
        ClickedDisclaimerLink = true;
    };

    So_Dumb();
    getVersions();
};

function AddMoreInputs(CLASS, first, second, third, fourth){
    var NewInput = document.createElement("div");
    NewInput.className = CLASS;
    NewInput.innerHTML += "<div><input type='" + first + "' name='" + CLASS + "1' placeholder='" + third + "' /></div>";
    NewInput.innerHTML += "<div><input type='" + second + "' name='" + CLASS + "2' placeholder='" + fourth + "' /></div>";
    NewInput.innerHTML += "<div><input type='button' name='" + CLASS + "Delete' value='Delete' /></div>";
    document.querySelector("#" + CLASS + "s").append(NewInput);
    for(let x of document.querySelectorAll("input[type='text']")){
        x.addEventListener("keyup", SaveSettings);
    };
    for(let x of document.querySelectorAll("input[type='checkbox']")){
        x.addEventListener("click", SaveSettings);
    };
    for(let x of document.querySelectorAll("[name=" + CLASS + "Delete]")){
        x.addEventListener("click", DeleteInputs);
    };
};

function DeleteInputs(){
    let CLASS = this.name.split("Delete")[0];
    this.parentNode.parentNode.remove();
    if(document.querySelector("input[name$='Delete']")){
        SaveSettings();
    }else{
        chrome.storage.sync.remove(CLASS + "s");
    };
};
function So_Dumb(){
    for(let toggle of document.querySelectorAll("li.toggle > div.showme")){
        if(toggle.previousElementSibling.querySelector("[type='checkbox']").checked === true){
            toggle.style.display = "flex";
        }else{
            toggle.style.display = "none";
        };
    };
    if(document.getElementsByName("ExpandTabs")[0].checked === true){
        for(x of document.querySelectorAll("#Content > div:not(.active)")){
            x.setAttribute("class","active");
        };
    };
    if(ReadDisclaimer === false){
        document.querySelector("[name=MassMessage]").addEventListener("click", function(){
            if(this.checked === true && ReadDisclaimer === false){
                this.click();
                ClickedDisclaimerLink = false;
                MassMessageDisclaimerPopup(this);
            };
        });
        document.querySelector("[name=MassMessageFriends]").addEventListener("click", function(){
            if(this.checked === true && ReadDisclaimer === false){
                this.click();
                ClickedDisclaimerLink = false;
                MassMessageDisclaimerPopup(this);
            };
        });
    };
};

function getVersions(){
    let ajax = new XMLHttpRequest();
    ajax.onload = function(){
        let reply = JSON.parse(ajax.responseText);
        NewVersion = reply.version;
        //if(document.getElementById("NewestVersion") !== -1) document.getElementById("NewestVersion").innerHTML = NewVersion;
        if(chrome.runtime.getManifest().version < reply.version){
            document.getElementById("NewVersion").removeAttribute("style");
            if(navigator.userAgent.indexOf("Firefox") > -1){
                document.querySelector("#NewVersion > a").href = reply.firefox.url;
            }else if(navigator.userAgent.indexOf("Chrome") > -1){
                document.querySelector("#NewVersion > a").href = reply.chrome.url;
            }else{
                document.querySelector("#NewVersion > a").href = reply.other.url;
            };
            document.querySelector("#NewVersion > a").setAttribute("download","FetLifeEnhancer-v" + NewVersion);
        };
    };
    ajax.onerror = false;
    ajax.open("get", "http://www.fetlifeenhancer.droppages.com/version.json", true);
    ajax.send();
};

function MassMessageDisclaimerPopup(a){
    var Disclaimer = "<h1>Disclaimer</h1>";
    Disclaimer += "<div class='text'><font style='color: #cc0000; font-weight: bold;'>I am not responsible if your account gets locked/deactivated using the following features: Mass Message, Mass Message Friends, Bulk Delete Photos or Mass Archive/Delete Messages</font>";
    Disclaimer += "<br /><br />FetLife has code implemented to where you can only message a certain number of non-friended users in a given time period. If that code is tripped, you won't be able to send messages and comment on pictures for up to 4 hours.";
    Disclaimer += "<br /><br />FetLife also doesn't like you to constantly load a lot of pages on their website at once. It can be taken as a \"Denial of Service\" (DDoS) attack. If that gets tripped your account will be locked. I have taken precautions to this and made it so my Mass Message code waits a few seconds before it sends the next message. <b>Although there are precautions, it is still at risk for your account to be locked/deactivated</b>. Below are the minutes it takes for your account to be unlocked if FetLifes code is tripped:";
    Disclaimer += "<br /><br /><b> 1st Offense:</b> 15 Minutes";
    Disclaimer += "<br /><b> 2nd Offense:</b> 1 Hour";
    Disclaimer += "<br /><b> 3rd Offense:</b> 7 Hours";
    Disclaimer += "<br /><b> 4th Offense:</b> (Unknown)";
    Disclaimer += "<br /><br /><b>AGAIN: I am not responsible if your account gets locked/deactivated using features such as Mass Message, Mass Message Friends, Bulk Delete Photos or Mass Archive/Delete Messages.</b>";
    if(ClickedDisclaimerLink === false){
        Disclaimer += "<br /><br /><center><input type='button' name='ReadTheDisclaimer' value='I agree to the above disclaimer' /></center></div>";
    };
    document.getElementById("FloatyContent").innerHTML = Disclaimer;
    document.getElementById("FloatyBoxyThingy").style.display = "inline";
    document.getElementsByName("ReadTheDisclaimer")[0].addEventListener("click", function(asdf){
        asdf.disabled = "disabled";
        asdf.value = "Cheese Monkey Doodle Weasle!";
        ReadDisclaimer = true;
        ClickedDisclaimerLink = true;
        chrome.storage.sync.set({MassMessageDisclaimer: true});
        document.getElementsByName(a.name)[0].click();
        document.getElementById("FloatyBoxyThingy").style.display = "none";
    });
};

function onError(error){
	console.log(`Error: ${error}`);
};

const GrabSettings = new Promise(function(resolve, reject){
	chrome.storage.sync.get(null, resolve);
});
GrabSettings.then(LoadSettings, onError);

document.querySelector("[name=RestoreSettings]").addEventListener("click", function(){
    var ConfirmIt = confirm("Are you sure you would like to reset all your settings?");
    if(ConfirmIt == true){
        chrome.storage.sync.clear(function(){window.location.reload(true);});
    };
});

document.querySelector("input[name=AddCSVField]").addEventListener("click", function(){
    AddMoreInputs("CSVField","checkbox","text","","Enter Field Name");
    SaveSettings();
});
document.querySelector("input[name='SearchFriends']").addEventListener("click", function(){
    if(this.checked === false){
        console.log("Deleted SearchFriends querys");
        chrome.storage.sync.remove("SearchedFriends");
        chrome.storage.sync.remove("SearchFriendsListNumber");
        chrome.storage.sync.remove("SFL_Username");
        chrome.storage.sync.remove("SFL_UserID");
        chrome.storage.sync.remove("SFL_Avatar");
        chrome.storage.sync.remove("SFL_AGR");
        chrome.storage.sync.remove("SFL_UserLoc");
    };
});
document.getElementById("MMDisclaimer").addEventListener("click",function(){
    ClickedDisclaimerLink = true;
    MassMessageDisclaimerPopup();
});
document.getElementById("MMFDisclaimer").addEventListener("click",function(){
    ClickedDisclaimerLink = true;
    MassMessageDisclaimerPopup();
});

//Save Settings each checkbox click
for(let x of document.querySelectorAll("[type='checkbox']:not([name*='CSVField']")){
    x.addEventListener("click", SaveSettings);
};
for(let x of document.getElementsByTagName("textarea")){
    x.addEventListener("keyup", SaveSettings);
};

document.addEventListener("DOMContentLoaded", function(){
    So_Dumb();
});