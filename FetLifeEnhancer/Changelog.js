let Changes = new Array();
Changes["2.4.6"] = [
    "Fixed a bug with the \"FLE Settings\" link not showing up in the sidebar.",
    "Fixed a bug with \"Mass Message Events\" that caused it not to work.",
    "Updated \"Quick Edit About Me\".",
    "Updated \"Add Format Buttons\".",
    "Updated \"Mass Archive/Delete Messages\".  Archiving works, delete still doesn't.",
    "Updated \"Facebook Style Friend Requests\".",
    "Removed \"Search Friends\".  No longer needed due to FetLife implementing this feature themselves.",
];
Changes["2.4.5"] = [
    "Fixed a bug with the \"FLE Settings\" link not showing up in the sidebar.",
    "Fixed a bug with \"Create Guest List\" that caused it not to work"
];
Changes["2.4.4"] = [
    // Update Locations Script (Might not be worth it, might not work as wanted)
    // Update Multiple Image Upload
    "Fixed a bug with \"Mass Message Events\" that caused it not to work.",
    "Fixed a bug with \"Quick Replies\" that caused it not to work.",
    "Fixed a bug with \"Add To Google Calendar\" that caused it not to work.",
    "Heavily updated code to match TamperMonkey script."
];
Changes["2.4.3"] = [
    "Updated \"Search Friends\" to work around Fetlifes new Search Friends feature.",
    "Fixed a bug with \"Mass Message Friends\" that caused it to create a tab on the Groups page.",
    "Fixed a bug with \"Add Format Buttons\" that caused it not to work on some areas of FetLife.",
    "Removed \"Infinite Scroll on Events Page\" due to FetLife implementing this feature themselves."
];
Changes["2.4.2"] = [
    "Fixed a bug with \"Bulk Delete Photos\" that caused it to delete all of the users photos.",
    "Updated \"Search Friends\" to match some of the TamperMonkey Script.",
];
Changes["2.4.1"] = [
    "Fixed a bug with \"Mass Message Events\" that caused it not to work on Maybes.",
    "Fixed a bug with \"Create Guest List\" that caused it not to work on Maybes.",
    "Fixed a bug with \"Quick Edit About Me\" that caused it not to work."
];
Changes["2.4.0"] = [
    "<b>New Feature:</b> Facebook-Style Friend Requests!  When clicking on the friend request icon in the navigation, it will show a box with all your friend requests instead of bringing you to a new page!",
    "Updated \"Add to Google Calendar\".  Now works on Virtual Events!",
    "Fixed a bug with \"Mass Archive/Delete Inbox Messages\" that caused it not to work.",
    "Fixed a bug with \"Quick Replies\" that caused it not to work."
];
Changes["2.3.8"] = [
    "Updated \"Infinite Scroll Events\".  Now works with the \"Virtual\" events page.",
    "Updated \"Add to Google Calendar\".  Now works on the new Events Details page.",
    "Updated \"Add Friends Link to Navigation\".  Link no longer shows if you are not logged in.",
    "Fixed a bug with \"Add More Locations\" that caused it not to work. (for the users whom still use the old Events page layout)",
    "Fixed a bug with the FLE Settings link that caused it not to show up in the sidebar."
];
Changes["2.3.7"] = [
    "Updated \"Mass Message Events\".  Now works on the new Events Details page.",
    "Updated \"Create Guest List\".  Now works on the new Events Details page.",
    "Updated \"Quick Replies\".  Now fully works on Mobile Firefox.",
    "Updated \"Bulk Delete Photos\".  It works once again!  Updated to work on Mobile Firefox as well.",
    "Fixed a bug with \"Quick Replies\" that caused it so you couldn't delete or archive conversations.",
    "Removed \"Hide Past Events\".  No longer worked and no longer needed due to the new Beta Events page."
];
Changes["2.3.6"] = [
    "Updated \"Search Friends List\".  You can now use \"*\" (astriks) as a wildcard character.  I also moved the search field to the right to match other areas of fetlife.",
    "Updated \"Add Format Buttons\" to be more mobile friendly.  You can now scroll through the format buttons on mobile Firefox.",
    "Fixed a bug with \"Quick Replies\" that caused it not to work.",
    "Fixed a bug with \"Add to Google Calendar\".  If the URL is too long (over 8000 characters), it will now slice the URL down.  Some description content may be lost due to this.",
    "Fixed a bug with \"Quick Edit About Me\" that caused it not to work.",
    "Added place holder names when adding new Locations and CSV Fields on the FLE Settings page.",
    "Updated the Loading Wheel to match FetLifes."
];
Changes["2.3.5"] = [
    "Fixed a bug with \"Add More Locations\" that caused it not to work in rare cases.",
    "Merged Chrome and Firefox extension code together.",
    "Removed Donoars.js file to see if that's the reason for Chrome not updating my code.",
    "Changed a lot of settings in manifest to help appease Chrome hopefully."
];
Changes["2.3.4"] = [
    "Firefox: Added Update check.  If a new update is available for the extension, a new Exclamation Icon will show under the Quick Links area on the Settings page.",
    "Firefox: Removed icon and link to FireFox app store from settings."
];
Changes["2.3.3"] = [
    "Updated \"Add Format Buttons\" code.  Links now use parentheses instead of square brackets.",
    "Updated \"Quick Edit About Me\".  There is now an \"Edit\" and \"Quick Edit\" button.  The Edit button brings you to the main edit profile page, the Quick Edit loads my code.",
    "Fixed a bug with \"Quick Edit About Me\" that caused it not to load the correct info.",
];
Changes["2.3.2"] = [
    "Fixed a bug with \"Search Friends List\" that caused it not to work properly."
];
Changes["2.3.1"] = [
    "Updated \"Search Friends List\" code.",
    "Fixed a bug with \"Add Friends Link in Navigation\" that caused it not to direct to the friends list."
];
Changes["2.3.0"] = [
    "<b>New Feature:</b> Create Guest List of your event!  This creates a new tab when viewing RSVP'd or Maybes of your event labeled \"Create Guest List\".  This will grab all the RSVP'd or Maybes attending your event and create a .CSV (spreadsheet) file from which you can save and edit/print in Excel or other spreadsheet software.</b>",
    "Updated \"Mass Message\" and \"Mass Message Friends\" code.",
    "Fixed a bug with \"Add More Locations\" that caused it not to work if \"Infinite Scrolling\" wasn't enabled.",
    "Fixed a bug with \"Search Friends List\" that caused it not to work properly."
];
Changes["2.2.4"] = [
    "Updated Disclaimer popup to include \"Mass Archive/Delete Inbox Messages\" and \"Bulk Delete Photos\".",
    "Fixed a bug with \"Search Friends List\" that made it so clicking on \"unfriend\" didn't do anything."
];
Changes["2.2.3"] = [
    "Updated \"Search Friends List\" code.",
    "Fixed a bug with \"Add to Google Calendar\" that caused it not to work in rare cases."
];
Changes["2.2.2"] = [
    "Major code overhaul."
];
Changes["2.2.1"] = [
    "Updated \"Mass Archive/Delete Inbox Messages\".  You may now only select 20 messages at most due to the likelihood of your account getting locked/banned when selecting too many messages to Archive/Delete."
];
Changes["2.2.0"] = [
    "<b>New Feature:</b> Pretty Textareas!  Changes the white textareas and input boxes to match Fetlife.",
    "Updated \"Mass Archive/Delete Inbox Messages\".  Added a popup if you try to archive/delete when you have no messages selected.",
    "Updated \"Quick Edit About Me\".  Now loads faster.",
    "Updated \"Format Buttons\".  Now when you press a button without highlighting any text, it automatically highlights the \"TEXT\".",
    "Updated \"Multiple Image Upload\" code. No more jQuery in use!",
    "Updated \"Bulk Delete Photos\" code. No more jQuery in use!",
    "Updated \"Infinite Scroll on Events page\".  No more jQuery in use!",
    "Updated \"Add More Locations\".  No More jQuery in use!",
    "Fixed a bug with \"Mass Archive/Delete Inbox Messages\" that made it so it didn't show the Quick Reply Settings link when replying to messages.",
    "Fixed a bug with \"Search Friends List\" that made it so clicking on \"unfriend\" didn't do anything."
];
Changes["2.1.0"] = [
    "<b>New Feature:</b> Mass Archive/Delete messages in your inbox!",
    "Fixed a bug that caused it so you couldn't switch tabs while mass messaging."
];
Changes["2.0.0"] = [
    "<b>New Feature:</b> Quick Replies! Compose premade messages to quickly send to people.  (Placed under \"User Interface Settings\")",
    "Fixed a bug with \"Username Mentions\" when on the Account Settings page.",
    "Updated \"Infinite Scroll Events\" to make it look more infinite. Also applies to \"Add more Locations\".",
    "Updated \"Multi Image Upload\" to make it initially load quicker.",
    "Updated \"Format Buttons\" to include \"Strike Through\".  Also tweaked the looks of the buttons.",
    "New version numbering: Reduced to 3 numbers instead of 4 numbers."
];
Changes["1.0.9.0"] = [
    "<b>New Feature:</b> Hide Old/Past events under \"Events RSVDed to\" section.",
    "<b>New Feature:</b> Add a \"Friends\" link to the navigation bar.",
    "Code optimized to enhance the user experience."
];
Changes["1.8.2"] = [
    "Fixed a bug with \"Search Friends\" that caused it not to function properly.  If you have problems such as users pictures being broken (or other issues) you can turn off and on the feature to refresh everything.",
    "Updated \"Add More Locations\".",
    "Added 'Please stay on page while messages are sending.' when sending Mass Messages.  Changing tabs will cause the script to stop sending messages."
],
Changes["1.0.8.1"] = [
    "Updated \"Floating Navigation\".  It's more floaty!",
    "Updated \"Username Mentions\" to include when viewing notifications."
];
Changes["1.0.8.0"] = [
    "<b>New Feature:</b> Bulk Delete Photos!",
    "Added a new section in Settings called \"Gallery Settings\".  This will contain all the codes pertaining to pictures and the like.",
    "Fixed a bug that caused \"Mass Message\" not to work properly.",
    "Fixed a bug that caused the \"Remove Image\" button for Multi Picture Upload to not work"
];
Changes["1.0.7.0"] = [
    "<b>New Feature:</b> Upload Multiple Pictures!  Upload ALL your images with ease!"
];
Changes["1.0.6.1"] = [
    "Fixed a bug with \"Search Friends\" that caused it not to function properly.",
    "Fixed a bug with the FLE Settings page when the Mass Message Disclaimer pops up."
];
Changes["1.0.6.0"] = [
    "<b>New Feature:</b> Search your Friends List!  There's a new input field when you are viewing your friends list.  This is mainly thought to be used with \"Mass Message Friends\" but can be used if that is not enabled."
];
Changes["1.0.5.1"] = [
    "Fixed a bug with \"Mass Message Friends\" where you could hit submit when subject/message info is empty.",
    "Added an alert when clicking \"remove all\" on \"Mass Message Friends\" page.",
    "Added Format Button for {Username} insertion to easily insert the current recipient username into the Subject/Message during mass messages.",
    "Format Buttons added when creating and replying to messages."
];
Changes["1.0.5.0"] = [
    "<b>New Feature:</b> Mass Message Friends!  View your Friends list and then click on the Mass Message tab to do so!  (Find it under the \"Miscelllaneous\" category on the Settings Page)",
    "Updated the looks of the \"Mass Message Event\" page to look like the \"Mass Message Friends\" page.",
    "Format Buttons added to \"Mass Message Event\" and \"Mass Message Friends\" textarea."
];
Changes["1.0.4.2"] = [
    "Fixed a long time bug with \"Infinite Scrolling of Events\".  Will only load one page of events at a time now.",
    "Added links to go to the Firefox/Chrome FLE Addon page in Settings."
];
Changes["1.0.4.1"] = [
    "Fixed a bug that caused \"Add to Google Calendar\" to not function properly.",
    "Made the Settings link in the side bar have it's own icon and tweaked the looks a tad."
];
Changes["1.0.4.0"] = [
    "<b>New Feature:</b> Quick edit your \"About me\" section when you press the \"Edit\" link when viewing your profile.",
    "Format Buttons added to \"Wall Post\" and \"Picture Comment\" textarea.",
    "Mass Message should be able to send messages a tad quicker now.",
    "Fixed a bug when saving your own pictures in Google Chrome.",
    "Changed \"Add-on Settings\" button text to \"FLE Settings\"."
];
Changes["1.0.3.0"] = [
    "<b>New Feature:</b> Add Format Buttons to textareas around FetLife.",
    "Added new \"User Interface Settings\" tab on settings page."
];
Changes["1.0.2.3"] = [
    "Fixed another bug with @Username mentions.  You can now post status' and upload pictures like normal.",
    "Added a confirmation box when you click the \"Reset\" button on the settings page."
];
Changes["1.0.2.2"] = [
    "Fixed a bug with @Username mentions."
];
Changes["1.0.2.1"] = [
    "<b>New Feature:</b> Change all @Username mentions into clickable links!",
    "Fixed another bug that caused \"Add To Google Calendar\" to not work.  It's code is a lot more optimized as well."
];
Changes["1.0.2.0"] = [
    "<b>New Feature:</b> Ability to Save your pictures!",
    "Fixed Mass Message on Google Chrome.  Had to rewrite the whole code.  Fun stuff.",
    "Fixed a bug that caused \"Floating Navigation\" to not work.",
    "Fixed a bug that caused \"Add To Google Calendar\" to not work."
];
Changes["1.0.1.0"] = [
    "New Settings Page",
    "<b>New Feature:</b> Floating Navigation",
    "<b>New Feature:</b> Add Event to Google Calendar",
    "Updated \"Add Locations\" code.  Can now add as many locations as you wish.",
    "Future proofed the code"
];
Changes["1.0.0.0"] = ["Initial Release"];


var Version = chrome.runtime.getManifest().version;
document.getElementById("VersionLink").innerHTML = "v" + Version;
document.getElementById("VersionLink").addEventListener("click", Changelog);
window.onclick = function(manufacture){
    if(manufacture.target === document.getElementById("FloatyBoxyThingy")){
        document.getElementById("FloatyBoxyThingy").style.display = "none";
    };
};
function Changelog(){
    var poopface = "";
    for(Spyro in Changes){
        poopface += "<li><div class='subheader' width='100%'>" + Spyro + "</div></li>";
        Changes[Spyro].find(function(rawr){
            poopface += " - " + rawr + "<br />";
        });
    };
    document.getElementById("FloatyContent").innerHTML = "<h1>Changelog</h1><ul>" + poopface + "</ul>";
    document.getElementById("FloatyBoxyThingy").style.display = "block";
};