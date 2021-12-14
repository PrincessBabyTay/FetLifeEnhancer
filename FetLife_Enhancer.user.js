// ==UserScript==
// @name FetLife Enhancer
// @namespace FLE@fetlife.com
// @description Add new features to enhance your FetLife experience!  It's like viagra for FetLife!
// @version 2.4.7
// @author PrincessBabyTay
// @copyright PrincessBabyTay (https://openuserjs.org/users/PrincessBabyTay)
// @match *://fetlife.com/*
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM.listValues
// @updateURL https://openuserjs.org/meta/PrincessBabyTay/FetLife_Enhancer.meta.js
// @downloadURL https://openuserjs.org/install/PrincessBabyTay/FetLife_Enhancer.user.js
// @license GPL-3.0-or-later
// ==/UserScript==

//=======================================================
//
// Start "UI.js" Functions for FLE
//
//=======================================================
function FloatNavigation(){
    let nav = document.getElementsByTagName("nav")[0];
    if(document.getElementById("maincontent")) document.getElementById("maincontent").style.paddingTop = "68px";
    nav.style.position = "fixed";
    nav.style.width = "100%";
};
function FriendsInNav(){
    let nav = document.querySelector(".fl-nav__sections-wrapper") || document.querySelector("nav ul");
    let FriendLink = document.createElement("a");
    FriendLink.href = "/users/" + user_id + "/friends";
    FriendLink.innerHTML = "Friends";
    FriendLink.title = "Friends";
    if(document.getElementsByClassName("fl-nav__sections-wrapper")[0]){
        FriendLink.className = "fl-nav__section";
        nav.getElementsByTagName("a")[0].after(FriendLink);
    }else{
        let LI = document.createElement("li");
        FriendLink.className = "flex items-center h-48 pa2 mh1 fw4 link gray hover-light-silver";
        LI.append(FriendLink);
        nav.getElementsByTagName("li")[0].after(LI);
    };
};
function MentionLinks(){
    function ReplaceText(asdf){
        if(asdf){
            asdf.childNodes.forEach(function(a){
                if(a.nodeType === 1){
                    if(a.innerHTML.trim() !== "" && a.innerHTML.match(/@([\w]+)/g)){
                        a.innerHTML = a.innerHTML.replace(/@([\w]+)/g,"<a href='" + main_url + "/$1' title='View $1 Profile'><u>@$1</u></a>");
                    };
                }else{
                    ReplaceText(a);
                };
            });
        };
    };
    if(location.href.match("fetlife.com/home")){
        if(document.querySelector("#stories-list > div[timestamp]") || document.querySelector("#stories tbody tr")){
            ReplaceText(document.getElementById("stories")); //v4 home
            ReplaceText(document.getElementById("stories-list")); //v5 home
        }else{
            setTimeout(MentionLinks, 500);
        };
    }else{
        ReplaceText(document.getElementById("mini_feed")); //User Profile Mini-Feed
        ReplaceText(document.getElementsByTagName("figcaption")[0]); //Picture Captions
        ReplaceText(document.getElementById("comments")); //Picture Comments
        ReplaceText(document.querySelector("div.w-100.ph3.ph4-l.center.mw1360.pt4"));
        ReplaceText(document.getElementById("vue-edit-status-app")); //Viewing Users' Status
    };
};
function RunFormatButtons(textarea, AddUserButton){
    function CreateButton(id, description, name){
        return "<div style='cursor: pointer; display: flex; margin: 5px; align-items: center; text-align: center;'><div id='FB_" + id + "' style='display: flex; margin: auto;' class='FormatButtons'><a href='javascript:void(0);' style='text-decoration: none !important;' title='" + description + "'>" + name + "</a></div></div>";
    };
    function WrapText(StartText, EndText, Optional){
        let start = textarea.selectionStart;
        let finish = textarea.selectionEnd;
        let selected = textarea.value.substring(start, finish);
        //Hide TooltipText if any other FormatButton is pressed
        if(Optional !== "Link" && document.getElementsByClassName("TooltipText")[0]){
            document.getElementsByClassName("TooltipText")[0].remove();
        };
        if(Optional == "Link"){
            if(!document.getElementsByClassName("TooltipText")[0]){
                let span = document.createElement("span");
                span.className = "TooltipText";
                span.innerHTML = "<div width='100%'>Title<br /><input style='width: 142px;' type='text' id='HyperName' placeholder='Title for link (Optional)' /><br />Link<br /><input style='width: 142px;' type='text' id='HyperLink' placeholder='Paste or type a link' /><br /> <a id='InsertLink' href='javascript:void(0);' style='float: right;'>Insert</a></div>";
                let a = document.getElementById("FB_Link");
                let b = a.parentNode.getBoundingClientRect();
                let c = document.getElementById("ToolTipPlaceholder");
                c.style.top = b.offsetTop + "px";
                c.style.left = b.offsetLeft + "px";
                document.getElementById("ToolTipPlaceholder").append(span);
                document.querySelector("#HyperName").value = "";
                document.querySelector("#HyperLink").value = "";
                let tooltip = c.getElementsByClassName("TooltipText")[0];
                tooltip.style.top = "30px";
                tooltip.style.left = "50px";
                if(selected){
                    tooltip.querySelector("#HyperName").value = selected;
                };
                tooltip.querySelector("#InsertLink").onclick = function(){
                    let Name = document.querySelector("#HyperName").value;
                    let Link = document.querySelector("#HyperLink").value;
                    if(!validURL(Link)){
                        document.querySelector("#HyperLink").style.border = "solid #c00";
                        document.querySelector("#HyperLink").value = "";
                        document.querySelector("#HyperLink").setAttribute("placeholder","Invalid Link");
                        document.querySelector("#HyperLink").onfocus = function(){
                            this.style.border = "";
                            this.setAttribute("placeholder","Paste or type a link");
                        }
                        return;
                    };
                    textarea.focus();
                    if(Name !== "" && Link !== ""){
                        if(selected){
                            textarea.value = textarea.value.substring(0, start) + "[" + Name + "](" + Link + ")" + textarea.value.substring(finish, textarea.value.length);
                            textarea.selectionEnd = finish + +(("[](" + Link + ")").length);
                        }else if(start || start == "0"){
                            textarea.value = textarea.value.substring(0, start) + "[" + Name + "](" + Link + ")" + textarea.value.substring(finish, textarea.value.length);
                            textarea.selectionEnd = finish + +(("[" + Name + "](" + Link + ")").length);
                        }else{
                            textarea.value += "[" + Name + "](" + Link + ")\n";
                            textarea.selectionEnd = finish + +(("[" + Name + "](" + Link + ")").length);
                        };
                    }else if(Name == "" && Link !== ""){
                        if(selected){
                            textarea.value = textarea.value.substring(0, start) + Link + textarea.value.substring(finish, textarea.value.length);
                            textarea.selectionEnd = finish + +(Link.length);
                        }else if(start || start == "0"){
                            textarea.value = textarea.value.substring(0, start) + Link + textarea.value.substring(finish, textarea.value.length);
                            textarea.selectionEnd = finish + +(Link.length);
                        }else{
                            textarea.value += Link + "\n";
                            textarea.selectionEnd = finish + +(Link.length);
                        };
                    };
                    tooltip.remove();
                };
                textarea.onfocus = function(){
                    tooltip.remove();
                };
            }else{
                document.getElementsByClassName("TooltipText")[0].remove();
            };
        }else if(Optional == "List"){
            textarea.focus();
            if(selected){
                let NewSel = "";
                if(selected.match(/^(?!\s)/gm)){
                    NewSel = selected.replace(/^(?!\s)/gm,"* ");
                };
                textarea.value = textarea.value.substring(0, start) + NewSel + textarea.value.substring(finish, textarea.value.length);
                textarea.selectionEnd = start + +(NewSel.length);
            }else if(start || start == "0"){
                textarea.value = textarea.value.substring(0, start) + StartText + "TEXT" + ((EndText) ? EndText : "") + textarea.value.substring(finish, textarea.value.length);
                //textarea.selectionEnd = finish + +((StartText + "TEXT\n").length);
                //======Auto select "TEXT" once button is pressed for quick typing
                textarea.selectionStart = start + +StartText.length;
                textarea.selectionEnd = finish + +((StartText + "TEXT").length);
            }else{
                textarea.value += StartText + "TEXT" + ((EndText) ? EndText : "");
                //textarea.selectionEnd = +((StartText + "TEXT" + ((EndText) ? EndText : "")).length);
                //======Auto select "TEXT" once button is pressed for quick typing
                textarea.selectionStart = start + +StartText.length;
                textarea.selectionEnd = finish + +((StartText + "TEXT").length);
            };
        }else if(Optional == "hr" || Optional == "{U}"){
            textarea.focus();
            if(start || start == "0"){
                textarea.value = textarea.value.substring(0, start) + StartText + ((EndText) ? EndText : "") + textarea.value.substring(finish, textarea.value.length);
                textarea.selectionEnd = finish + +((StartText + ((EndText) ? EndText : "")).length);
            }else{
                textarea.value += StartText + ((EndText) ? EndText : "");
                textarea.selectionEnd = +((StartText + ((EndText) ? EndText : "")).length);
            };
        }else{
            textarea.focus();
            if(selected){
                textarea.value = textarea.value.substring(0, start) + StartText + selected + ((EndText) ? EndText : "") + textarea.value.substring(finish, textarea.value.length);
                textarea.selectionEnd = finish + +((StartText + ((EndText) ? EndText : "")).length);
            }else if(start || start == "0"){
                textarea.value = textarea.value.substring(0, start) + StartText + "TEXT" + ((EndText) ? EndText : "") + textarea.value.substring(finish, textarea.value.length);
                //textarea.selectionEnd = finish + +((StartText + "TEXT" + ((EndText) ? EndText : "")).length);
                //======Auto select "TEXT" once button is pressed for quick typing
                textarea.selectionStart = start + +StartText.length;
                textarea.selectionEnd = finish + +((StartText + "TEXT").length);
            }else{
                textarea.value += StartText + "TEXT" + ((EndText) ? EndText : "");
                //textarea.selectionEnd = finish + +((StartText + "TEXT" + ((EndText) ? EndText : "")).length);
                //======Auto select "TEXT" once button is pressed for quick typing
                textarea.selectionStart = start + +StartText.length;
                textarea.selectionEnd = finish + +((StartText + "TEXT").length);
            };
        };
    };
    if(textarea){
        let left_arrow = "<div id='left-arrow' style='display: none; height 40px; left: -1px; top: 0;' class='absolute z-4 bottom-0 fill-mid-gray hover-fill-gray fill-animate flex items-center pa2 bg-gradient-dark-primary--left' style='display: flex; cursor: pointer;'><svg xmlns='http://www.w3.org/2000/svg' width='14px' height='14px' viewBox='0 0 16 16'><polygon points='10.79 16 3 8 10.79 0 13 2.27 7.42 8 13 13.73'></polygon></svg></div>";
        let right_arrow = "<div id='right-arrow' style='display: flex; height: 40px; cursor: pointer; transition: fill .15s ease-in; z-index: 4; right: 0; top: 0; padding: 0.5rem; position: absolute !important; align-items: center; -webkit-box-align: center; background-image: linear-gradient(to right, rgba(12,12,12,0) 0%, #0c0c0c 40%, #0c0c0c 100%); fill: #555;'><svg xmlns='http://www.w3.org/2000/svg' width='14px' height='14px' viewBox='0 0 16 16'><polygon points='5.21 16 3 13.73 8.58 8 3 2.27 5.21 0 13 8'></polygon></svg></div>";
        let TooltipDIV = document.createElement("div");
        TooltipDIV.id = "ToolTipPlaceholder";
        TooltipDIV.style.position = "absolute";
        let div1 = document.createElement("div");
        div1.id = "FBC";
        div1.style.display = "flex";
        div1.style.flexWrap = "nowrap";
        div1.style.overflow = "hidden";
        div1.style.height = "40px";
        div1.style.width = "100%";
        div1.style.position = "relative";
        div1.style.setProperty("align-items","center");
        let div2 = document.createElement("div");
        div2.id = "Buttons";
        div2.height = "100%";
        div2.width = "100%";
        div2.position = "absolute";
        div2.style.display = "flex";
        div2.style.padding = "5px 0px 5px 0px";
        div2.style.paddingBottom = "500px";
        div2.style.marginBottom = "-500px";
        div2.style.overflowX = "scroll";
        div2.style.boxSizing = "content-box";
        if(window.MobileCheck() === true){
            let div3 = document.createElement("div");
            div3.id = "Arrows";
            div3.innerHTML = left_arrow + right_arrow;
            div1.append(div3);
            //div2.innerHTML = "<div id='Arrows' style='height: 40px;'>" + left_arrow + right_arrow + "</div>";
            div2.onscroll = function(){
                let Buttons = this;
                document.getElementById("left-arrow").style.display = (Buttons.scrollLeft !== 0) ? "flex" : "none";
                document.getElementById("right-arrow").style.display = ((Buttons.scrollWidth - Buttons.getBoundingClientRect().right) >= Buttons.scrollLeft) ? "flex" : "none";
            };
        };
        div1.append(div2);
        let style = document.createElement("style");
        document.head.appendChild(style);
        if(location.href.match("/conversations/(.*)|QuickReplySettings|/groups/|/pictures/(.*)")){
            style.sheet.insertRule(".FormatButtons > a { text-decoration: none !important; background-color: #333; color: #ddd; height: 30px; width: 30px; padding: 5px; }");
            style.sheet.insertRule(".TooltipText { cursor: default !important; text-align: initial !important; display: block; z-index: 9999; overflow: hidden; position: absolute; background-color: #3f3f3f; border: 1px solid #cccccc; border-radius: 15px; padding: 10px; margin: 10px; font-size: 12px; color: #aaa; width: 163px; }");
        }else{
            style.sheet.insertRule(".FormatButtons > a { text-decoration: none !important; background-color: #333; color: #ddd; height: 20px; width: 20px; padding: 5px; }");
            style.sheet.insertRule(".TooltipText { cursor: default !important; text-align: initial !important; display: block; z-index: 9999; overflow: hidden; position: absolute; background-color: #3f3f3f; border: 1px solid #cccccc; border-radius: 15px; padding: 10px; margin: 10px; font-size: 12px; color: #aaa; width: 150px; }");
        };
        style.sheet.insertRule(".FormatButtons > a:hover { text-decoration: none !important; background-color: #424242; color: #ddd; }");
        style.sheet.insertRule(".FormatButtons > a:focus { text-decoration: none !important; background-color: #333; color: #ddd; }")
        let Buttons = CreateButton("Bold","Bold","<svg viewBox='0 0 20 20' width='20' height='20' xmlns='http://www.w3.org/2000/svg' fill='#ddd'><path d='M12.44,9.72v0a3.07,3.07,0,0,0,2.67-3.22c0-2.84-2.42-3.46-5-3.46H4.51V17H10.4c2.61,0,5.09-1,5.09-3.86C15.49,10.91,14.14,10,12.44,9.72ZM7.54,5.38H9.85c1.65,0,2.31.61,2.31,1.7s-.74,1.68-2.35,1.68H7.54ZM10,14.65H7.54V10.95H9.89c1.7,0,2.59.61,2.59,1.83S11.72,14.65,10,14.65Z'></path></svg>");
        Buttons += CreateButton("Italics","Italics","<svg viewBox='0 0 20 20' width='20' height='20' xmlns='http://www.w3.org/2000/svg' fill='#ddd'><polygon points='7.24 17 10.3 17 12.1 6.85 9.05 6.85 7.24 17'></polygon><polygon points='9.7 3 9.28 5.46 12.34 5.46 12.76 3 9.7 3'></polygon></svg>");
        Buttons += CreateButton("StrikeThrough", "Strike Through", "<svg viewBox='0 0 20 20' width='20' height='20' xmlns='http://www.w3.org/2000/svg' fill='#ddd'><path d='M11.86,12a1.36,1.36,0,0,1,.7,1.19c0,1.07-1,1.59-2.42,1.59a4.12,4.12,0,0,1-3.75-2.36L4.08,13.79A6.21,6.21,0,0,0,10,17.2c3.86,0,5.55-2,5.55-4.22a4,4,0,0,0-.12-1Z'></path><path d='M17,9H11.61l-1.09-.31c-1.82-.51-2.85-.9-2.85-2,0-.82.71-1.39,2-1.39a4.13,4.13,0,0,1,3.41,2L15.2,5.65A6.23,6.23,0,0,0,9.69,2.8c-3,0-5,1.56-5,4.14A3.31,3.31,0,0,0,5.31,9H3a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z'></path></svg>");
        Buttons += CreateButton("BlockQuote","Block Quote","<svg viewBox='0 0 20 20' width='20' height='20' xmlns='http://www.w3.org/2000/svg' fill='#ddd'><polygon points='8.63 4 5.36 4 2 9.8 2 16 9.2 16 9.2 9.24 6.75 9.24 8.63 4'></polygon><polygon points='15.56 9.24 17.39 4 14.16 4 10.8 9.8 10.8 16 18 16 18 9.24 15.56 9.24'></polygon></svg>");
        Buttons += CreateButton("Link","Link","<svg viewBox='0 0 20 20' width='20' height='20' xmlns='http://www.w3.org/2000/svg' fill='#ddd'><path d='M17.15,2.86a6.33,6.33,0,1,0-9,9A1,1,0,0,0,9.6,10.4a4.39,4.39,0,1,1,4.92.83,7.41,7.41,0,0,1,.14,1.44c0,.23,0,.46,0,.68a6.33,6.33,0,0,0,2.51-10.5Z'></path><path d='M10.4,8.19a1,1,0,0,0,0,1.41,4.39,4.39,0,1,1-4.92-.83,7.41,7.41,0,0,1-.14-1.44c0-.23,0-.46,0-.68a6.33,6.33,0,1,0,6.44,1.54A1,1,0,0,0,10.4,8.19Z'></path></svg>");
        Buttons += CreateButton("List","List","<svg viewBox='0 0 20 20' width='20' height='20' xmlns='http://www.w3.org/2000/svg' fill='#ddd'><path d='M17,9H8a1,1,0,0,0,0,2h9a1,1,0,0,0,0-2Z'></path><path d='M17,15H8a1,1,0,0,0,0,2h9a1,1,0,0,0,0-2Z'></path><path d='M8,5h9a1,1,0,0,0,0-2H8A1,1,0,0,0,8,5Z'></path><path d='M4.88,9.43a1.29,1.29,0,0,0-.13-.26,2.17,2.17,0,0,0-.19-.23,1.55,1.55,0,0,0-2.12,0,2.16,2.16,0,0,0-.19.23,2.2,2.2,0,0,0-.14.26A2.3,2.3,0,0,0,2,9.71,1.32,1.32,0,0,0,2,10a1.5,1.5,0,0,0,1.5,1.5,1.55,1.55,0,0,0,.57-.11A1.52,1.52,0,0,0,5,10a1.32,1.32,0,0,0,0-.29A1.27,1.27,0,0,0,4.88,9.43Z'></path><path d='M4.33,14.75l-.26-.14-.28-.08a1.42,1.42,0,0,0-.58,0l-.28.08-.26.14a2.16,2.16,0,0,0-.23.19A1.52,1.52,0,0,0,2,16a1.47,1.47,0,0,0,.44,1.06,1.52,1.52,0,0,0,.49.33,1.53,1.53,0,0,0,1.14,0,1.61,1.61,0,0,0,.49-.33A1.52,1.52,0,0,0,5,16a1.5,1.5,0,0,0-.44-1.06A2.06,2.06,0,0,0,4.33,14.75Z'></path><path d='M2.44,2.94A1.52,1.52,0,0,0,2,4a1.47,1.47,0,0,0,.44,1.06,1.59,1.59,0,0,0,.48.33,1.65,1.65,0,0,0,.58.11,1.55,1.55,0,0,0,.57-.11,1.5,1.5,0,0,0,.49-.33,1.5,1.5,0,0,0,0-2.12A1.55,1.55,0,0,0,2.44,2.94Z'></path></svg>");
        Buttons += CreateButton("Header1","Header 1","H1");
        Buttons += CreateButton("Header2","Header 2","H2");
        Buttons += CreateButton("Header3","Header 3","H3");
        Buttons += CreateButton("Header4","Header 4","H4");
        Buttons += CreateButton("HorizontalLine","Horizontal Line","─");
        if(AddUserButton) Buttons += CreateButton("Username","Insert recipient Username","{U}");
        div2.innerHTML += Buttons;
        textarea.before(TooltipDIV,div1);
        if(window.MobileCheck() === true){
            let FBC = document.getElementById("Buttons");
            document.getElementById("left-arrow").onclick = function(){
                FBC.scrollLeft = 0;
            };
            document.getElementById("right-arrow").onclick = function(){
                FBC.scrollLeft = FBC.scrollWidth;
            };
        };
        for(let x of document.querySelectorAll("div.FormatButtons")){
            x.addEventListener("click", function(e){
                "FB_Bold" == this.id && WrapText("**","**");
                "FB_Italics" == this.id && WrapText("*","*");
                "FB_StrikeThrough" == this.id && WrapText("~~","~~");
                "FB_BlockQuote" == this.id && WrapText("> ","");
                "FB_Link" == this.id && WrapText("","","Link");
                "FB_List" == this.id && WrapText("\n* ","","List");
                "FB_Header1" == this.id && WrapText("# ","");
                "FB_Header2" == this.id && WrapText("## ","");
                "FB_Header3" == this.id && WrapText("### ","");
                "FB_Header4" == this.id && WrapText("#### ","");
                "FB_HorizontalLine" == this.id && WrapText("\n---\n","","hr");
                "FB_Username" == this.id && WrapText("{Username}","","{U}");
            });
        };
    };
};
function QEAboutMe(Format){
    function SetupAboutMe(href){
        if(!document.getElementById("EditAboutMe")){
            let iframe = document.createElement("iframe");
            iframe.name = "EditAboutMe";
            iframe.id = "EditAboutMe";
            iframe.src = href;
            //iframe.src = location.href.split("/users/")[0] + "/users/" + user_id + "/about/edit";
            iframe.style.display = "none";
            iframe.sandbox = "allow-forms allow-scripts allow-pointer-lock allow-same-origin";
            document.body.appendChild(iframe);
            document.getElementById("EditAboutMe").onload = function(){
                LoadAboutMe();
                this.onload = null;
			};
        }else{
            document.getElementById("EditAboutMe").src = href;
            document.getElementById("EditAboutMe").onload = function(){
                LoadAboutMe();
                this.onload = null;
            };
        };
        function LoadAboutMe(){
            let content = document.getElementById("EditAboutMe");
            if(content.contentDocument.querySelector("[name='about[content]']")){
                let OldAboutMe = content.contentDocument.querySelector("[name='about[content]']").value;
                document.getElementById("QEAM").innerHTML = "<fieldset><textarea class='text' id='AboutMeInfo' style='width: 100%;'>" + OldAboutMe + "</textarea><a href='javascript:void(0);' id='SaveAboutMeInfo' style='background-color: #a00; font-size: 1.2em; padding: 5px 15px; margin-top: 7px; text-decoration: none; float: right;'>Update</a></fieldset>";
                document.getElementById("SaveAboutMeInfo").addEventListener("click", function(){
                    SaveAboutMe(content);
                });
                RunFormatButtons(document.querySelector("textarea#AboutMeInfo"));
            }else{
                StillLoading(LoadAboutMe);
            };
        };
        function SaveAboutMe(){
            let a = document.getElementById("EditAboutMe");
            a.contentDocument.querySelector("[name='about[content]']").value = document.getElementById("AboutMeInfo").value;
            a.contentDocument.getElementsByClassName("edit_about")[0].submit();
            document.getElementById("QEAM").innerHTML = LoadingContainer();
            a.onload = function(){
                ReloadAboutMe();
                this.onload = null;
            };
        };
        function ReloadAboutMe(){
            let a = document.getElementById("EditAboutMe");
            if(a.contentDocument.querySelector(".bg-green-500")){
                window.location.reload(true);
            }else{
                StillLoading(ReloadAboutMe);
            };
        };
    };
    if(document.querySelector("a[href='/settings/profile/about']")){
        let a = document.querySelector("a[href='/settings/profile/about']");
        let b = a.outerHTML;
        let c = a.href;
        let d = a.className ? "class='" + a.className + "'" : "";
        let e = "<a href='javascript:void(0);' name='QuickEditABoutMe' " + d + ">quick edit</a>";
        a.parentNode.innerHTML = "(" + b + " / " + e + ")";
        document.querySelector("a[name='QuickEditABoutMe']").addEventListener("click",function(){
            let bio = this.parentElement.parentElement;
            if(!document.getElementById("QEAM")){
                let QEAM = document.createElement("div");
                QEAM.id = "QEAM";
                QEAM.innerHTML = LoadingContainer();
                bio.after(QEAM);
                SetupAboutMe(c);
            };
        });
    };
};
function MassArchiveDeleteMessages(){
    function PlaceCheckbox(){
        let AllMessages = document.querySelectorAll("main > div > div.relative.flex.items-center.w-100.pa3.hover-bg-gray-800.bg-animate.pointer.bb.b-gray-800.hover-show");
        for(let a of AllMessages){
            if(!a.querySelector("input[name='CheckConvo']")){
                let URL = a.querySelector("a[href*='/conversations']").href.split("#newest_message")[0];
                let ClickEvent = a.getAttribute("onclick");
                for(let b of a.getElementsByTagName("div")){
                    b.setAttribute("onclick", ClickEvent);
                };
                a.removeAttribute("onclick");
                let div = document.createElement("div");
                div.name = "CheckyboxyDIV";
                div.className = "flex";
                div.setAttribute("style", "width: 4%; height: 100%;");
                div.innerHTML = "<input type='checkbox' name='CheckConvo' conversation-url='" + URL + "' style='width: 20px; height: 20px;' />";
                a.insertBefore(div, a.firstChild);

                 // Removes all Event Listeners.  Old way (Commented out right below), no longer worked.
                // Basically just cuts and pastes the element, which in turn removes event listeners.
                //a.parentElement.innerHTML = a.parentElement.innerHTML;
                let Clone_A = a.cloneNode(true);
                a.parentNode.replaceChild(Clone_A, a);
            };
        };
    };
    function AUD(){
        let Messages = document.querySelectorAll("input[name='CheckConvo']:checked");
        let completed = document.createElement("div");
        let CompletedClass = "pv2 ph3 tc f5 lh-title light-gray gray=100 bg-green-600";
        completed.id = "Completed";
        completed.className = "pv2 ph3 tc f5 lh-title light-gray bg-gray";
        completed.innerHTML = "Loading...Please wait";
        if(Messages.length > 20){
            alert("I'm sorry but due to how Fetlife works, you can't select more than 20 messages.\n\nYou have " + Messages.length + " selected.");
            return;
        };
        if(document.querySelectorAll("input[name='CheckConvo']:checked")){
            if(this.name === "ArchiveAll"){
                if(!document.getElementById("Completed")) h6.parentNode.after(completed);
                for(let a of Messages){
                    let URL = a.getAttribute("conversation-url");
                    let auth = document.querySelector("meta[name='csrf-token']").getAttribute("content");
                    let name = document.querySelector("meta[name='csrf-param']").getAttribute("content");
                    AJAXPost(URL + "/archive", {[name]: auth}).then(function(resolve){
                        a.parentNode.parentNode.remove();
                        if(Messages.lengh == null){
                            document.getElementById("Completed").className = CompletedClass;
                            document.getElementById("Completed").innerHTML = Messages.length + " conversations archived!";
                        };
                    }, onError);
                };
            };
            if(this.name === "UnarchiveAll"){
                if(!document.getElementById("Completed")) h6.parentNode.after(completed);
                for(let a of Messages){
                    let URL = a.getAttribute("conversation-url");
                    let auth = document.querySelector("meta[name='csrf-token']").getAttribute("content");
                    let name = document.querySelector("meta[name='csrf-param']").getAttribute("content");
                    AJAXPost(URL + "/unarchive", {[name]: auth}).then(function(resolve){
                        a.parentNode.parentNode.remove();
                        if(Messages.lengh == null){
                            document.getElementById("Completed").className = CompletedClass;
                            document.getElementById("Completed").innerHTML = Messages.length + " conversations unarchived!";
                        };
                    });
                };
            };
            if(this.name === "DeleteAll"){
                if(confirm("Are you sure you want to delete " + Messages.length + " conversations?")){
                    if(!document.getElementById("Completed")) h6.parentNode.after(completed);
                    for(let a of Messages){
                        let URL = a.getAttribute("conversation-url").split("/conversations/")[1];
                        let auth = document.querySelector("meta[name='csrf-token']").getAttribute("content");
                        let name = document.querySelector("meta[name='csrf-param']").getAttribute("content");
                        AJAXPost(main_url + "/chat/privacy_rules/9780960", {"conversation_id": URL, "utf8": "✓", "_method": "delete", [name]: auth}).then(function(resolve){
                            a.parentNode.parentNode.remove();
                            if(Messages.lengh == null){
                                document.getElementById("Completed").className = CompletedClass;
                                document.getElementById("Completed").innerHTML = Messages.length + " conversations deleted. Hasta la vista, baby!";
                            };
                        }, onError);
                    };
                };
            };
        }else{
            alert("You might want to select some messages before you do that...");
            return;
        };
        document.querySelector("div > main").scrollTo({top: 0, left: 0, behavior: "smooth"});
    };
    let h6 = (window.MobileCheck() === false) ? document.querySelector("div > main > header > h6") : document.querySelector("div > main > header > div");
    let Archive = "<button name='ArchiveAll' style='margin: 0px 3px 0px 3px; background-color: #900 !important;' class='text pv2 ph3 f5 br1 pointer bg-animate link bg-dark-secondary hover-secondary-light bn'><span class='relative pd1'><span class='fill-moon-gray pen'><svg xmlns='http://www.w3.org/2000/svg' width='11px' height='11px' viewBox='0 0 16 16' class='mr1 pen'><path d='M15.5555556,1.95555556 L14.3111111,0.444444444 C14.1333333,0.177777778 13.7777778,0 13.3333333,0 L2.66666667,0 C2.22222222,0 1.86666667,0.177777778 1.6,0.444444444 L0.444444444,1.95555556 C0.177777778,2.31111111 0,2.66666667 0,3.11111111 L0,14.2222222 C0,15.2 0.8,16 1.77777778,16 L14.2222222,16 C15.2,16 16,15.2 16,14.2222222 L16,3.11111111 C16,2.66666667 15.8222222,2.31111111 15.5555556,1.95555556 Z M8,12.8888889 L3.11111111,8 L6.22222222,8 L6.22222222,6.22222222 L9.77777778,6.22222222 L9.77777778,8 L12.8888889,8 L8,12.8888889 Z M1.86666667,1.77777778 L2.57777778,0.888888889 L13.2444444,0.888888889 L14.0444444,1.77777778 L1.86666667,1.77777778 Z'></path></svg></span> Archive</span></button>";
    let Unarchive = "<button name='UnarchiveAll' style='margin: 0px 3px 0px 3px; background-color: #900 !important;' class='text pv2 ph3 f5 br1 pointer bg-animate link bg-dark-secondary hover-secondary-light bn'><span class='relative pd1'><span class='fill-moon-gray pen'><svg xmlns='http://www.w3.org/2000/svg' width='11px' height='11px' viewBox='0 0 16 16' class='mr1 pen'><path d='M15.5555556,1.95555556 L14.3111111,0.444444444 C14.1333333,0.177777778 13.7777778,0 13.3333333,0 L2.66666667,0 C2.22222222,0 1.86666667,0.177777778 1.6,0.444444444 L0.444444444,1.95555556 C0.177777778,2.31111111 0,2.66666667 0,3.11111111 L0,14.2222222 C0,15.2 0.8,16 1.77777778,16 L14.2222222,16 C15.2,16 16,15.2 16,14.2222222 L16,3.11111111 C16,2.66666667 15.8222222,2.31111111 15.5555556,1.95555556 Z M8,12.8888889 L3.11111111,8 L6.22222222,8 L6.22222222,6.22222222 L9.77777778,6.22222222 L9.77777778,8 L12.8888889,8 L8,12.8888889 Z M1.86666667,1.77777778 L2.57777778,0.888888889 L13.2444444,0.888888889 L14.0444444,1.77777778 L1.86666667,1.77777778 Z'></path></svg></span> Unarchive</span></button>";
    let Delete = "<button name='DeleteAll' style='margin: 0px 3px 0px 3px; background-color: #900 !important;' class='text pv2 ph3 f5 br1 pointer bg-animate link bg-dark-secondary hover-secondary-light bn'><span class='relative pd1'><span class='fill-moon-gray pen'><svg xmlns='http://www.w3.org/2000/svg' width='11px' height='11px' viewBox='0 0 16 16' class='mr1 pen'><path d='M7,0 C5.9,0 5,0.9 5,2 L3,2 C1.9,2 1,2.9 1,4 L15,4 C15,2.9 14.1,2 13,2 L11,2 C11,0.9 10.1,0 9,0 L7,0 Z M3,6 L3,15.62 C3,15.84 3.16,16 3.38,16 L12.64,16 C12.86,16 13.02,15.84 13.02,15.62 L13.02,6 L11.02,6 L11.02,13 C11.02,13.56 10.58,14 10.02,14 C9.46,14 9.02,13.56 9.02,13 L9.02,6 L7.02,6 L7.02,13 C7.02,13.56 6.58,14 6.02,14 C5.46,14 5.02,13.56 5.02,13 L5.02,6 L3.02,6 L3,6 Z'></path></svg></span> Delete</span></button>";
    if(window.MobileCheck() === false && !document.querySelector(".mv0.f4.lh-title.text") && !location.href.match("QuickReplySettings")){
        if(location.href.match("/inbox/archive")){
            h6.innerHTML += "<span style='right: 10%; position: fixed; z-index: 999;' id='ArchButtons'>" + Unarchive + Delete + "<span>";
            document.getElementsByName("UnarchiveAll")[0].onclick = AUD;
            // document.getElementsByName("DeleteAll")[0].onclick = AUD;
        }else if(location.href.match("/inbox/all")){
            h6.innerHTML += "<span style='right: 10%; position: fixed; z-index: 999;' id='ArchButtons'>" + Archive + Unarchive + Delete + "<span>";
            document.getElementsByName("ArchiveAll")[0].onclick = AUD;
            document.getElementsByName("UnarchiveAll")[0].onclick = AUD;
            // document.getElementsByName("DeleteAll")[0].onclick = AUD;
        }else if(location.href.match(/\/inbox|\?filter\=inbox/i)){
             h6.innerHTML += "<span style='right: 10%; position: fixed; z-index: 999;' id='ArchButtons'>" + Archive + Delete + "<span>";
             document.getElementsByName("ArchiveAll")[0].onclick = AUD;
             // document.getElementsByName("DeleteAll")[0].onclick = AUD;
        };
        document.querySelector("div > main").addEventListener("scroll", PlaceCheckbox);
        PlaceCheckbox();
    };
};
function QuickReply(pacifier, FormatButtons){
    function EditSaveDelete(x){
        let a = x.parentNode.parentNode.parentNode;
        if(x.innerHTML === "edit"){
            x.innerHTML = "save";
            a.getElementsByClassName("Name")[0].innerHTML = "<input type='text' name='Name' placeholder='Enter quick reply name' value='" + a.getElementsByClassName("Name")[0].innerHTML + "' style='width: 100%; border: #999 solid 1px; padding: .5rem; color: #ccc; background-color: #303030;' />";
            a.getElementsByClassName("Description")[0].innerHTML = "<textarea type='text' name='Description' placeholder='What should your quick reply say?' style='border: #999 solid 1px; padding: 1rem; overflow: visible hidden; overflow-wrap: break-word; resize: none; height: 120px; color: #ccc; background-color: #303030; width: 100%;'>" + a.getElementsByClassName("Description")[0].innerHTML + "</textarea>";
            if(FormatButtons === true){
                RunFormatButtons(a.querySelector("textarea[name='Description']"));
            };
        }else if(x.innerHTML === "save"){
            let Name = a.querySelector("input[name='Name']").value;
            let Description = a.querySelector("textarea[name='Description']").value;
            if(Name && Description !== ""){
                x.innerHTML = "edit";
                a.getElementsByClassName("Name")[0].innerHTML = Name;
                a.getElementsByClassName("Description")[0].innerHTML = Description;
                if(a.getAttribute("name") === "New"){
                    a.setAttribute("index", ++QuickReplyIndex);
                    a.setAttribute("name","NewlySaved");
                    QuickReplies.push([Name, Description]);
                }else{
                    QuickReplies[a.getAttribute("index")] = [Name, Description];
                };
                SetSync("QuickReplyList", QuickReplies);
            }else if(Name === ""){
                alert("You must insert a name for the quick reply!");
            }else if(Description === ""){
                alert("You must insert a message for the quick reply!");
            };
        }else if(x.innerHTML === "delete"){
            let Confirm = confirm("Are you sure you want to delete this quick reply?");
            if(Confirm === true){
                for(let p in QuickReplies){
                    if(p === a.getAttribute("index")){
                        QuickReplies.splice(p, 1);
                        p--;
                    };
                };
                for(z of document.querySelectorAll("div[index]")){
                    if(z.getAttribute("index") > a.getAttribute("index")){
                        let OldIndex = z.getAttribute("index");
                        z.setAttribute("index", --OldIndex);
                    };
                };
                --QuickReplyIndex;
                a.remove();
                SetSync("QuickReplyList", QuickReplies);
                if(QuickReplies.length == 0){
                    DeleteSync("QuickReplyList");
                };
            };
        };
    };
    function AddQuickReply(){
        let a = document.createElement("div");
        a.className = "pa3 hover-bg-primary bg-animate pointer bb b--primary hover-show bg-transparent";
        a.setAttribute("name","New");
        let b = "<div class='relative w-100' style='display: flex;'>";
        b += "<div class='Name' style='width: 640px; word-break: break-all; padding-right: 10px;'><input type='text' name='Name' placeholder='Enter quick reply name' style='width: 100%; border: #999 solid 1px; padding: .5rem; color: #ccc; background-color: #303030;' /></div>";
        b += "<div class='EditDelete' style='width: 110px; text-align: right'>(<a href='javascript:void(0);' class='EditMe' onmouseover='this.style.color=\"#fff\"' onmouseout='this.style.color=\"#ccc\"' style='text-decoration: none;'>save</a> |  <a href='javascript:void(0);' class='DeleteMe' onmouseover='this.style.color=\"#fff\"' onmouseout='this.style.color=\"#ccc\"' style='text-decoration: none;'>delete</a>)</div>"
        b += "</div>";
        b += "<div class='Description' style='overflow: hidden; white-space:nowrap; text-overflow: ellipsis; display: block; width: 725px; color: #777; padding-top: 10px;'><textarea type='text' name='Description' placeholder='What should your quick reply say?' style='border: #999 solid 1px; padding: 1rem; overflow: visible hidden; overflow-wrap: break-word; resize: none; height: 120px; color: #ccc; background-color: #303030; width: 100%;'></textarea></div>";
        a.innerHTML = b;
        document.getElementById("QuickReplies").append(a);
        a.querySelector(".EditMe").onclick = function(){
            EditSaveDelete(this);
        };
        a.querySelector(".DeleteMe").onclick = function(){
            EditSaveDelete(this);
        };
        if(FormatButtons === true){
            RunFormatButtons(a.querySelector("textarea[name='Description']"));
        };
    };
    if(location.href.match("/conversations/[0-9]+") && pacifier.QuickReplyList){
        let a = document.createElement("a");
        a.id = "QuickReplyAction";
        a.href = "javascript:void(0);";
        a.className = "mt3 flex items-center no-underline flex-none silver hover-moon-gray fill-silver hover-fill-moon-gray";
        a.innerHTML = "<span class='relative pd1 f6 fw4'><svg xmlns='http://www.w3.org/2000/svg' width='14px' height='14px' viewBox='0 0 16 16'><path d='M10,1 L10,5 C2,5 0,9.1 0,15 C1.04,11.04 4,9 8,9 L10,9 L10,13 L16,6.68 L10,1 Z' transform='matrix(-1 0 0 1 16 0)'></path></svg> Quick Reply</span>";
        let b = document.createElement("div");
        b.id = "QuickReplyList";
        b.className = "ph4 pt4";
        let c = "<h6 class='ttu f7 fw4 gray mb0 lh-copy mt0'>QUICK REPLIES</h6>";
        for(let x in pacifier.QuickReplyList){
            c += "<a href='javascript:void(0);' name='QR' index='" + x + "' class='mt3 flex items-center no-underline flex-none silver hover-moon-gray fill-silver hover-fill-moon-gray'><span class='relative pd1 f6 fw4'>" + pacifier.QuickReplyList[x][0] + "</span></a>";
        };
        b.innerHTML = c;
        // Had to Move all of this stuff into a function to make sure the elements needed were loaded.
        function AddRQLinks(){
            if(!document.querySelector("a.db.mt3.silver.link.hover-moon-gray.fill-gray.f6")){
                StillLoading(AddRQLinks, 100);
            }
            if(!document.getElementById("QuickReplyAction")){
                document.querySelector("a.db.mt3.silver.link.hover-moon-gray.fill-gray.f6").parentNode.before(b);
            };
            //Mobile Quick Reply Button
            if(window.MobileCheck() === true /*|| pacifier.DebugFLE*/){
                let MobileArchive = document.querySelector("main.vh-main-small form[action$='archive']");
                let a = MobileArchive.parentNode;
                a.classList.add("pl2");
                let b = document.createElement("div");
                b.className = "dib w-50 pr2";
                b.innerHTML = "<div id='QRConvoMobile' style='cursor: pointer;' class='relative items-center link br1 us-none ba moon-gray b--near-black hover-moon-gray bg-near-black bg-animate fill-moon-gray fw4  tc db w-100 lh-normal f16 pv08 ph3 ph4-ns'><span class='f5'>Quick Reply</span></div>";
                a.before(b);
                //Create module for quick replies
                let copy = document.querySelector("[data-id='delete-conversation']").cloneNode(true);
                copy.id = "QRModule";
                copy.querySelector("h3").innerHTML = "Quick Replies";
                copy.querySelector("a[data-modal-secondary-action-button]").href = "javascript:void(0);";
                copy.querySelector("button").parentNode.remove();
                let Quickies = "";
                for(let x in pacifier.QuickReplyList){
                    Quickies += "<a href='javascript:void(0);' name='QR' mobile='true' index='" + x + "'><span>" + pacifier.QuickReplyList[x][0] + "</span></a><br />";
                };
                copy.querySelector("[data-modal-body] > p").innerHTML = Quickies;
                document.body.append(copy);
                let QRM = document.querySelector("#QRModule");
                function ToggleQRM(){
                    if(QRM.classList.contains("dn")){
                        QRM.classList.contains("fade-out") ? QRM.classList.replace("fade-out","fade-in") : QRM.classList.add("fade-in");
                        QRM.classList.remove("dn");
                    }else{
                        QRM.classList.replace("fade-in","fade-out");
                        setTimeout(function(){
                            QRM.classList.add("dn");
                        }, 300);
                    };
                };
                document.querySelector("#QRConvoMobile").addEventListener("click", ToggleQRM);
                window.onclick = function(manufacture){
                    if(manufacture.target === QRM.querySelector(":first-child")){
                        ToggleQRM();
                    };
                };
                QRM.querySelector("a[data-modal-secondary-action-button]").addEventListener("click", ToggleQRM);
                QRM.querySelector("svg").parentNode.addEventListener("click", ToggleQRM);
            };
            //Did they press the QR Link????? :o!
            for(let x of document.querySelectorAll("a[name='QR']")){
                x.onclick = function(){
                    let text_ = document.getElementById("new-message-textarea");
                    text_.value = pacifier.QuickReplyList[x.getAttribute("index")][1];
                    document.querySelector("button[name='button']").setAttribute("style","opacity: 1 !important; cursor: pointer !important;");
                    text_.onkeyup = function(){
                        document.querySelector("button[name='button']").removeAttribute("style");
                    };
                    if(x.getAttribute("mobile")){
                        ToggleQRM();
                    };
                    text_.focus();
                };
            };
        };
        AddRQLinks();
    };
    if(location.href.match("/(inbox|conversations)") && document.querySelector("div#main-content div div aside > div > div") && !document.getElementById("QuickReplySettingsLink")){
        //Desktop Links:
        if(window.MobileCheck() === false || pacifier.DebugFLE){
            let b = "<a href='/inbox?QuickReplySettings' id='QuickReplySettingsLink' class='flex-none no-underline fade-color db pv06 ph3 f6 br1 lh-copy mt2-l gray hover-silver'>Quick Reply Settings</a>";
            document.querySelector("div#main-content div div aside > div > div > div").innerHTML += b;
        };
        //Mobile Links:
        if((window.MobileCheck() === true || pacifier.DebugFLE) && !location.href.match("QuickReplySettings|/conversations/[0-9]+")){
            let mobile = "<a href='/inbox?QuickReplySettings' id='QuickReplySettingsLinkMobile' class='db pv2 ph3 link f6 lh-title silver hover-moon-gray  bg-transparent hover-bg-light-primary bg-animate tl nowrap'>Quick Replies</a>";
            document.querySelector("div[data-dropdown] > div").innerHTML += mobile;
        };
    };
    if(location.href.match("QuickReplySettings")){
        document.title = "Quick Reply Settings | FetLife";
        var QuickReplies = new Array();
        var QuickReplyIndex = -1;
        let d = "<div class='flex flex-column w-100 mt0' style='max-width: 750px;'>";
        d += "<div id='AllSettings' style='-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;'>";
        d += "<div id='QuickReplies' style='flex-align: center'>";
        if(pacifier.QuickReplyList){
            let List = pacifier.QuickReplyList;
            for(let e in List){
                QuickReplyIndex = e;
                QuickReplies.push([List[e][0], List[e][1]]);
                d += "<div name='Saved' index='" + e + "' class='pa3 hover-bg-primary bg-animate pointer bb b--primary hover-show bg-transparent'>";
                d += "<div class='relative w-100' style='display: flex;'>";
                d += "<div class='Name' style='width: 640px; word-break: break-all; padding-right: 10px;'>" + List[e][0] + "</div>";
                d += "<div class='EditDelete' style='width: 110px; text-align: right'>(<a href='javascript:void(0);' class='EditMe' onmouseover='this.style.color=\"#fff\"' onmouseout='this.style.color=\"#ccc\"' style='text-decoration: none;'>edit</a> | <a href='javascript:void(0);' class='DeleteMe' onmouseover='this.style.color=\"#fff\"' onmouseout='this.style.color=\"#ccc\"' style='text-decoration: none;'>delete</a>)</div>"
                d += "</div>";
                d += "<div class='Description' style='overflow: hidden; white-space:nowrap; text-overflow: ellipsis; display: block; width: 725px; color: #777; padding-top: 10px;'>" + List[e][1] + "</div>";
                d += "</div>";
            };
        };
        d += "</div>";
        d += "<div id='AddQuickReply' style='float: right; padding-top: 10px;'><div class='db flex-ns w-100 w-auto-ns v-mid'><button name='AddQuickReply' class='relative items-center link br1 us-none bt-0 bl-0 br-0 bb bw1 secondary-light hover-secondary-light b--darkest-secondary bg-dark-secondary bg-animate fill-light-secondary shadow-text-secondary-darkest fw4  tc db w-100 lh-normal f16 pv08 ph3 ph4-ns'><span class='relative pd1'><span class='f5 fw7'>+add</span></span></button></div></div>";
        d += "</div>";
        if(window.MobileCheck() === false || pacifier.DebugFLE){
            document.querySelector("div#main-content aside a.moon-gray.hover-moon-gray.bg-near-black").className = "flex-none no-underline fade-color db pv06 ph3 f6 br1 lh-copy mt2-l gray hover-silver";
            document.getElementById("QuickReplySettingsLink").className = "flex items-center pv2 ph3 link br1 f6 text hover-near-white bg-near-black";
            let header = "<header class='h-48 flex items-center bb b--primary pl2 pr3 lh-copy'><h6 class='flex-auto dn db-l text mv0 f16 fw4 pl2'>Quick Reply Settings" + (pacifier.DebugFLE ? " - <a id='DeleteAll' href='javascript:void(0);'>(delete all)</a> | <a href='javascript:void(0);' id='Alert'>(Alert)</a>" : "") + "</h6></header>";
            document.querySelector("div > main").outerHTML = "<main id='QuickReplySettings' style='flex-auto h-100 overflow-auto relative z-3'>" + header + d + "</main>";
        };
        if(window.MobileCheck() === true/* || pacifier.DebugFLE */){
            let header = document.querySelector("main > header");
            let dropdown = header.querySelector("div > div");
            dropdown.querySelector("a[title='Navigation']").href = "/inbox";
            dropdown.querySelector("a[title='Navigation'] h6").innerHTML = "< Back to Inbox";
            document.querySelector("div > main").outerHTML = "<main id='QuickReplySettings' style='width: 100%'>" + header.outerHTML + d + "</main>";
        };
        document.getElementById("AddQuickReply").addEventListener("click", AddQuickReply);
        for(let i of document.getElementsByClassName("EditMe")){
            i.onclick = function(){
                EditSaveDelete(i);
            };
        };
        for(let i of document.getElementsByClassName("DeleteMe")){
            i.onclick = function(){
                EditSaveDelete(i);
            };
        };
        if(pacifier.DebugFLE){
            document.getElementById("DeleteAll").onclick = function(){
                window.location.reload(true);
                DeleteSync("QuickReplyList");
            };
            document.getElementById("Alert").onclick = function(){ alert(QuickReplies.length + " : " + QuickReplies) };
        };
    };
};
function GoogleCalendar(){
    function ConvertTime(a){
        // New way doesn't work anymore, using old way again.  Keeping just in case.
        //return a.toISOString().replace(/-|:|\.\d\d\d/g, "");
        // Old Line (removed TimezoneOffset - Caused it not to work properly)
        return a.setMinutes(a.getMinutes() + a.getTimezoneOffset()), a.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };
    function CheckURL(a){
        let NewURL = (a.length > 8190) ? a.slice(0, 8200) : a;
        if(NewURL.match(/(\%?|\%[a-zA-Z0-9]{1,2})$/)){
            NewURL = NewURL.slice(0, NewURL.length - RegExp.$1.length);
        };
        return NewURL;
    };
    let maincontent = document.querySelector("#main-content > div");
    let event_url = "Event Link:%0A" + window.location;
    let event_name = encodeURIComponent(maincontent.querySelector("header h1").innerText);
    let event_table = maincontent.querySelector("main + aside");
    let event_start = "";
    let event_end = "";
    if(event_table.querySelector("p.mv0.text.f5.lh-copy.flex-auto:first-of-type")){
        //let TestTime = new RegExp("([a-zA-Z]{3}) ([0-9]{1,2}) ([a-zA-Z]{3,4}), ([0-9]{1,2}):([0-9]{1,2}) ([a-zA-Z]{2}) .* ([0-9]{1,2}):([0-9]{1,2}) ([a-zA-Z]{2})","g");
        let TestTime = new RegExp(/[a-zA-Z]{6,7}, ([a-zA-Z]{3,4}) ([0-9]{1,2}), ([0-9]{4})\n([0-9]{1,2}):([0-9]{1,2}) ([a-zA-Z]{2}) - ([0-9]{1,2}):([0-9]{1,2}) ([a-zA-Z]{2})/g);
        //alert(TestTime.test(event_table.querySelector("p.mv0.text.f5.lh-copy.flex-auto:first-of-type").innerText));
        if(TestTime.test(event_table.querySelector("p.mv0.text.f5.lh-copy.flex-auto:first-of-type").innerText)){
            let DATE = new Date();
            let Year = DATE.getFullYear();
            let Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let Month = (+Months.indexOf(RegExp.$1) + 1).toString();
            let StartHour = ((RegExp.$6 == "PM") ? +RegExp.$4 + 12 : RegExp.$4) + ":" + ((RegExp.$5.length === 1) ? "0" + RegExp.$5 : RegExp.$5);
            let EndHour = ((RegExp.$9 == "PM") ? +RegExp.$7 + 12 : RegExp.$7) + ":" + ((RegExp.$8.length === 1) ? "0" + RegExp.$8 : RegExp.$8);
            let ISODate = Year + "-" + ((Month.length == 1) ? "0" + Month : Month) + "-" + ((RegExp.$2.length === 1) ? "0" + RegExp.$2 : RegExp.$2) + "T";
            let StartTime = ISODate + StartHour + ":00Z";
            let EndTime = ISODate + EndHour + ":00Z";
            //lert("start: " + StartTime + "\nend: " + EndTime);
            event_start = ConvertTime(new Date(StartTime));
            event_end = ConvertTime(new Date(EndTime));
        };
    };
    let event_header = maincontent.querySelector("div a.link.gray.hover-silver[href='/events']");
    let event_location = (event_header && event_table.querySelector("div.breakword p").innerHTML.match("(.*)<br><span") && RegExp.$1 !== "") ? encodeURIComponent(RegExp.$1 + "\n") : "";
    let event_address = (event_header && event_table.querySelector("div.breakword span.silver.f6").innerText.match("(.*)\n")) ? encodeURIComponent(RegExp.$1 + "\n") : "";
    let event_virtual = (!event_header && event_table.querySelector("div.breakword p")) ? (event_table.querySelector("div.breakword p a") ? encodeURIComponent(event_table.querySelector("div.breakword p a").href) : encodeURIComponent(event_table.querySelector("div.breakword p").innerText)) : "";
    let event_citystate = encodeURIComponent((event_header && event_table.querySelector("div.breakword span.silver.f6").innerText.match(" map")[0]) ? ((event_table.querySelector("div.breakword span.silver.f6").innerText.match("\n")) ? event_table.querySelector("div.breakword span.silver.f6").innerText.split("\n")[1].split(" map")[0] : event_table.querySelector("div.breakword span.silver.f6").innerText.split(" map")[0]) : "");
    let event_details = "%0A%0ADescription:%0A" + encodeURIComponent(maincontent.querySelector("div.story__copy").innerText);
    let event_cost = (event_table.querySelector("div.flex.items-start.pt3.w-100:not(.breakword):nth-of-type(3) > p")) ? "%0A%0ACost:%0A" + encodeURIComponent(event_table.querySelector("div.flex.items-start.pt3.w-100:not(.breakword):nth-of-type(3) > p").innerText) : "";
    let event_dress = (event_table.querySelector("div.flex.items-start.pt3.w-100:not(.breakword):nth-of-type(4) > p")) ? "%0A%0ADress:%0A" + encodeURIComponent(event_table.querySelector("div.flex.items-start.pt3.w-100:not(.breakword):nth-of-type(4) > p").innerText) : "";
    let event_addtocalendar = event_table.querySelector("div.w275-l > div > div").firstChild.cloneNode(true);
    event_addtocalendar.querySelector("p").innerHTML = "<a target='_blank' href='javascript:void(0);' title='Add to Google Calender' id='GoogleCalendarLink'>Loading Link...</a>";
    event_addtocalendar.style.paddingBottom = "15px";
    event_table.querySelector("div.w275-l > div > div").firstChild.before(event_addtocalendar);
    let GoogleLink = "https://calendar.google.com/calendar/event?action=TEMPLATE&hl=en&text=" + event_name
    GoogleLink += "&dates=" + event_start + "%2F" + event_end;
    if(event_header) GoogleLink += "&location=" + (event_address !== "" ? event_address : event_citystate);
    GoogleLink += "&details=" + event_url + ((event_header) ? "%0A%0ALocation:%0A" + event_location + event_address + event_citystate : "%0A%0AVirtual Link:%0A" + event_virtual) + event_cost + event_dress + event_details;
    document.getElementById("GoogleCalendarLink").href = CheckURL(GoogleLink);
    document.getElementById("GoogleCalendarLink").innerHTML = "Add to Google Calendar";
};
function NotificationBox(Floating){
    function OpenNotification(){
        let NotifBox = document.getElementById("NotificationBox");
        if(NotifBox.style.display === "none"){
            NotifBox.style.display = "block";
            setTimeout(function(){
                window.addEventListener("click", NotificationClick);
            }, 100);
        }else{
            window.removeEventListener("click", NotificationClick);
            NotifBox.style.display = "none";
        };
    };
    function NotificationClick(rawr){
        let x = rawr.clientX;
        let y = rawr.clientY;
        let notbox = document.getElementById("NotificationBox");
        let a = notbox.getBoundingClientRect();
        let NotTop = a.top;
        let NotBottom = a.bottom;
        let NotLeft = a.left;
        let NotRight = a.right;
        if(x <= NotLeft || x >= NotRight || y <= NotTop || y >= NotBottom){
            notbox.style.display = "none";
            window.removeEventListener("click", NotificationClick);
        };
    };
    function AcceptIgnore(test){
        let lists = test.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("list");
        let current_list = test.parentNode.parentNode.parentNode.parentNode;
        let current_form = test.parentNode;
        current_form.submit();
        if(test.className == "AcceptMe"){
            test.parentNode.parentNode.parentNode.innerHTML = "<div class='Result' style='height: auto; margin: auto; width: auto;'>Accepted!</div>";
        }else{
            test.parentNode.parentNode.parentNode.innerHTML = "<div class='Result' style='height: auto; margin: auto; width: auto;'>Ignored!</div>";
        };
        setTimeout(function(){
            current_list.remove();
            if(!lists.length){
                FriendReqs = "";
                FriendReqsCount = 0;
                document.getElementById("NotificationBox").innerHTML = "<div style='height: 40px; margin: auto; width: 40%;'>No Requests Pending!</div>";
                document.querySelector("a[data-friend-request-glyph]").setAttribute("title","Friend Requests (0)");
            };
        }, 1000);
    };
    let navigation = document.getElementsByTagName("nav")[0];
    let NavPos = navigation.getBoundingClientRect();
    let Inbox = document.querySelector("a[title^='Inbox (']");
    let FriendReq = document.querySelector("a[title^='Friendship Requests (']");
    let FriendReqs = "";
    let FriendReqsCount = 0;
    let Notifications = document.querySelector("a[title^='Notifications (']");
    let BoxPos = Notifications.getBoundingClientRect();
    let NotifBox = document.createElement("div");
    NotifBox.id = "NotificationBox";
    if(Floating || navigation.className.match("fixed")){
        NotifBox.setAttribute("style","position: fixed; max-height: 300px; z-index: 999; border-radius: 5px; font-family: \"Lucida Grande\", \"Lucida Sans Unicode\", Arial, Verdana, sans-serif; line-height: 1.5; vertical-align: baseline; box-sizing: none !important;");
    }else{
        NotifBox.setAttribute("style","position: absolute; max-height: 300px; z-index: 999; border-radius: 5px; font-family: \"Lucida Grande\", \"Lucida Sans Unicode\", Arial, Verdana, sans-serif; line-height: 1.5; vertical-align: baseline; box-sizing: none !important;");
    };
    Object.assign(NotifBox.style, {
        display: "none",
        width: 400 + "px",
        top: (NavPos.bottom) + "px",
        left: (BoxPos.right - 405) + "px",
        border: "1px solid #cccccc",
        background: "#000000",
        padding: 0,
        margin: 0,
        overflow: "auto"
    });
    document.body.append(NotifBox);

    /*
    ======Start Inbox/Messages Section
    
    Inbox.href = "javascript:void(0);";
    Inbox.addEventListener("click", function(){
        OpenNotification();
        NotifBox.innerHTML = LoadingContainer();
        AJAXGet(main_url + "/requests", function(a){
            let b = document.createElement("div");
            b.innerHTML = a;
            let messages = b.querySelector("div.flex.flex-column.w-100.mt0] > div > div");
            for(let x in messages){
                alert(x.innerHTML);
            };
        });
    });
    */
    /*
    ======Start Friend Request Section
    */
    FriendReq.href = "javascript:void(0);";
    FriendReq.onclick = function(){
        OpenNotification();
        NotifBox.innerHTML = LoadingContainer();
        let RedBox = FriendReq.getElementsByClassName("ph1 bg-dark-secondary f8 fw7 lh-copy")[0];
        if(RedBox && RedBox.innerHTML !== "" || FriendReq.title.split("(")[1].split(")")[0] !== "0"){
            let CurrentFRC = RedBox ? RedBox.innerHTML : FriendReq.title.split("(")[1].split(")")[0];
            if(FriendReqs == "" || FriendReqsCount !== +CurrentFRC){
                FriendReqs = "";
                FriendReqsCount = +CurrentFRC;
                AJAXGet(main_url + "/requests", function(a){
                    let b = document.createElement("div");
                    b.innerHTML = a;
                    let requests = b.querySelector("main > div:first-child");
                    if(requests.innerHTML.match("No Requests Pending!")){
                        FriendReqs += "<div style='height: 40px; margin: auto; width: 40%;'>No Requests Pending!</div>";
                    }else{
                        let users = requests.querySelectorAll("a[class='link f5 fw7 secondary mr1']");
                        for(let x of users){
                            let top_parent = x.parentNode.parentNode.parentNode.parentNode.parentNode;
                            let user_img = top_parent.querySelector("img").src;
                            let user_url = x.href;
                            let user_name = x.innerHTML;
                            let user_age = x.parentNode.querySelector("span").innerHTML;
                            let user_loc = top_parent.querySelector("div[class='f6 lh-copy fw4 gray-300 nowrap truncate']").innerHTML;
                            let accept_auth = document.querySelector("meta[name='csrf-token']").getAttribute("content");
                            let accept_action = null;
                            let ignore_auth = document.querySelector("meta[name='csrf-token']").getAttribute("content");
                            let ignore_action = null;
                            for(let a of top_parent.getElementsByTagName("form")){
                                if(a.action.match("https://fetlife.com/requests/(.*)/ignore")){
                                    ignore_action = a.action;
                                };
                                if(a.action.match("https://fetlife.com/users/(.*)/friends" && "friend_with=(.*)")){
                                    accept_action = a.action;
                                };
                            };
                            //alert(user_img + "\n" + user_name + "\n" + user_url + "\n" + user_age + "\n" + user_loc + "\n" + ignore_auth + "\n" + accept_auth);
                            FriendReqs += "<li class='list' style='display: flex; height: 50px; width: 100%; border-bottom: 1px solid rgba(255, 255, 255, 0.295);'>";
                            FriendReqs += "<div class='image' style='display: flex; flex: 0 0 10%; padding: 2px; align-items: center;'><img src='" + user_img + "' style='width: 40px; height: auto;' /></div>";
                            FriendReqs += "<div class='info' style='flex: 0 0 70%; align: vertical; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'><a href='" + user_url + "' style='color: #c00; text-decoration: none; font-weight: bold;'>" + user_name + "</a> " + user_age;
                            FriendReqs += "<div class='description' style='font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'>" + user_loc + "</div>";
                            FriendReqs += "</div>";
                            FriendReqs += "<div class='buttons' style='flex: 1; padding: 2px; align-items: center;'>";
                            FriendReqs += "<div><form action='" + accept_action + "' method='post' target='Dummy'><input name='authenticity_token' value='" + accept_auth + "' type='hidden' /><a href='javascript:void(0)' class='AcceptMe'>Accept</a></form></div><div><form action='" + ignore_action + "' method='post' target='Dummy'><input name='authenticity_token' value='" + ignore_auth + "' type='hidden' /><a href='javascript:void(0)' class='IgnoreMe'>Ignore</a></form></div>";
                            FriendReqs += "</div>";
                            FriendReqs += "</li>";
                        };
                    };
                    NotifBox.innerHTML = FriendReqs + "<iframe name='Dummy' style='display: none;' sandbox='allow-forms'></iframe>";
                    let accept_links = document.querySelectorAll("div.buttons a");
                    for(let ac of accept_links){
                        ac.onclick = function(){
                            AcceptIgnore(this);
                        };
                    };
                });
            }else if(FriendReqs){
                NotifBox.innerHTML = FriendReqs + "<iframe name='Dummy' style='display: none;' sandbox='allow-forms'></iframe>";
                let accept_links = document.querySelectorAll("div.buttons a");
                for(let ac of accept_links){
                    ac.onclick = function(){
                        AcceptIgnore(this);
                    };
                };
            };
        }else if(RedBox && RedBox.innerHTML === "" || FriendReq.title.split("(")[1].split(")")[0] === "0"){
            NotifBox.innerHTML = "<div style='height: 40px; margin: auto; width: 40%;'>No Requests Pending!</div>";
        };
    };
};
//=======================================================
//
// End "UI.js" Functions for FLE
//
//=======================================================
//=======================================================
//
// Start "Gallery.js" Functions for FLE
//
//=======================================================
function SaveYourPics(){
	let del = document.getElementsByTagName("a");
	let is_owner = false;
	for(let a in del){
		if(del[a].innerHTML == "Delete" && del[a].parentNode.className === "fl-side-list__item"){
			is_owner = true;
		};
	};
	let nickname = document.getElementsByClassName("nickname")[0].href.split("/users/")[1];
	if(user_id === nickname && is_owner === true){
		var sidebar = document.getElementsByClassName("fl-side-list")[0];
		var img = document.getElementsByClassName("fl-picture__img")[0];
		var SRC = img.src;
		img.setAttribute("class","fl-picture__img");
		img.parentNode.style.display = "none";
		img.parentNode.parentNode.insertBefore(img, img.parentNode);
	};
};

function MultiImageUpload(){
    function AddForm(){
        let OldTable = table.parentNode.parentNode.cloneNode(true);
        let NewTable = OldTable;
        NewTable.style.display = "block";
        NewTable.target = "MultiUploadImg";
        NewTable.getElementsByTagName("legend")[0].style.display = "none";
        NewTable.getElementsByTagName("p")[0].style.display = "none";
        NewTable.getElementsByTagName("tbody")[0].innerHTML += "<tr style='display: none;'><th></th><td><input name='RemoveMe' type='button' value='Remove Image' /></td></tr>"
        NewTable.querySelector("input.file").addEventListener("change", function(a){
            this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className += " ChangedForm";
            this.parentNode.parentNode.parentNode.querySelectorAll("tr").forEach(function(asdf){
                if(asdf.style.display == "none") asdf.style.display = "";
            });
        });
        NewTable.querySelector("span.mode.display > a.option.change").href = "javascript:void(0);";
        NewTable.querySelector("span.mode.display > a.option.change").addEventListener("click", function(){
            for(let x of this.parentNode.parentNode.querySelectorAll(".mode")){
                x.style.display === "none" ? x.style.display = "" : x.style.display = "none";
            };
        });
        NewTable.querySelector("select#picture_only_friends").addEventListener("change", function(){
            let ChosenOne = this.options[this.selectedIndex].text;
            this.parentElement.parentElement.querySelector("span.mode.display > span.display").innerHTML = ChosenOne;
            for(let x of this.parentNode.parentNode.querySelectorAll(".mode")){
                x.style.display === "none" ? x.style.display = "" : x.style.display = "none";
            };
        });
        NewTable.querySelector("span.mode.change > a.option").addEventListener("click", function(){
            this.href = "javascript:void(0);";
            for(let x of this.parentNode.parentNode.querySelectorAll(".mode")){
                x.style.display === "none" ? x.style.display = "" : x.style.display = "none";
            };
        });
        NewTable.querySelector("[name='RemoveMe']").addEventListener("click", function(){
            RemoveImage(this);
        });
        document.getElementById("FORMS").insertBefore(NewTable, document.querySelector("#ButtonMe"));
    };
    function RemoveImage(THISONE){
        var deleteme = confirm("Are you sure you don't want to upload this image?");
        if(deleteme){
            if(document.getElementsByClassName("spinner new_picture ChangedForm").length === 1){
                window.location.reload(true);
            }else{
                THISONE.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            };
        };
    };
    function Checks(){
        let a = document.querySelectorAll("form.ChangedForm input[type='checkbox'][name='picture[is_of_or_by_user]']:checked");
        let b = document.querySelectorAll("form.ChangedForm");
        if(a.length === b.length){
            if(!document.getElementById("MultiUploadImg")){
                var iframe = document.createElement("iframe");
                iframe.name = "MultiUploadImg";
                iframe.id = "MultiUploadImg";
                iframe.width = "100%";
                iframe.height = "200px";
                iframe.style.display = "none";
                iframe.sandbox = "allow-forms allow-scripts allow-pointer-lock allow-same-origin";
                document.getElementById("maincontent").appendChild(iframe);
            };
            window.location.href += "#top_of_page";
            UploadAll();
        }else{
            alert("You must certify that this picture is of or by you.");
        };
    };
    function UploadAll(){
        let c = document.getElementsByClassName("spinner new_picture ChangedForm");
        if((c.length - 1) >= Numbering){
            if(!document.getElementById("UploadStatus")){
                let fieldset = document.createElement("fieldset");
                fieldset.id = "UploadStatus";
                fieldset.style.fontSize = "1.3em";
                fieldset.style.textAlign = "center";
                fieldset.style.fontStyle = "italic";
                fieldset.innerHTML = "Uploading Image " + (Numbering + 1) + " of " + c.length + "...";
                document.getElementById("SectionMe").append(fieldset);
            }else{
                document.getElementById("UploadStatus").innerHTML = "Uploading Image " + (Numbering + 1) + " of " + c.length + "...";
            };
            document.getElementById("FORMS").style.display = "none";
            document.getElementById("MultiUploadImg").onload = function(){
                this.onload = null;
                Uploaded();
            };
            c[Numbering].submit();
        }else{
            document.getElementById("UploadStatus").innerHTML = "Upload Complete! :D";
            window.location.href = main_url + "/users/" + user_id + "/pictures";
        };
    };
    function Uploaded(){
        let c = document.getElementsByClassName("spinner new_picture ChangedForm");
        let content = document.getElementById("MultiUploadImg").contentDocument;
        if(content.getElementsByClassName("error")[0]){
            document.getElementById("MultiUploadImg").src = main_url + "/pictures/new";
            document.getElementById("UploadStatus").innerHTML = "Error Uploading Image " + (Numbering + 1) + " of " + c.length + ". :(<br /><br />Going to next upload..."
            setTimeout(function(){
                Numbering++;
                UploadAll();
            }, 3000);
        }else{
            Numbering++;
            UploadAll();
        };
    };

    var Numbering = 0;
    let table = document.querySelector("form > fieldset > table");
    table.parentNode.parentNode.style.display = "none";
    let Section = document.querySelector("section.span-16.append-1");
    Section.id = "SectionMe";
    Section.innerHTML += "<span id='FORMS'><legend style='padding-left: 20px;'>Upload a new picture</legend><p id='ButtonMe' style='text-align: right;'><input id='Add' type='button' value='Add More Pictures' />  <input id='UploadAll' type='button' value='Upload' /></p></span>";
    document.querySelector("#Add").onclick = AddForm;
    document.getElementById("UploadAll").addEventListener("click", Checks);
    AddForm();
};
function BulkDeletePhotos(){
    function SetupPictures(){
        let picture = document.querySelectorAll("a.aspect-ratio--1x1");
        let button = document.getElementById("DeleteButtonSection");
        for(let l of picture){
            if(l.href !== "javascript:void(0);"){
                l.setAttribute("old-href", l.href);
                l.href = "javascript:void(0);";
            };
            if(l.classList.contains("DELETE_ME")){
                button.style.display = "block";
                l.getElementsByTagName("img")[0].style.filter = "blur(5px)";
            };
            l.onclick = function(){
                (this.classList.contains("DELETE_ME")) ? this.classList.remove("DELETE_ME") : this.classList.add("DELETE_ME");
                this.getElementsByTagName("img")[0].style.filter !== "" ? this.getElementsByTagName("img")[0].style.filter = "" : this.getElementsByTagName("img")[0].style.filter = "blur(5px)";
                document.querySelector(".DELETE_ME") ? button.style.display = "block" : button.style.display = "none";
            };
        };
    };
    function StartBulk(){
        let picture = document.querySelectorAll("a.aspect-ratio--1x1");
        let button = document.getElementById("DeleteButtonSection");
        if(this.checked === true){
            window.addEventListener("scroll", SetupPictures);
            for(let l of picture){
                if(l.href !== "javascript:void(0);"){
                    l.setAttribute("old-href", l.href);
                    l.href = "javascript:void(0);";
                };
                if(l.classList.contains("DELETE_ME")){
                    button.style.display = "block";
                    l.getElementsByTagName("img")[0].style.filter = "blur(5px)";
                };
                l.onclick = function(){
                    (this.classList.contains("DELETE_ME")) ? this.classList.remove("DELETE_ME") : this.classList.add("DELETE_ME");
                    this.getElementsByTagName("img")[0].style.filter !== "" ? this.getElementsByTagName("img")[0].style.filter = "" : this.getElementsByTagName("img")[0].style.filter = "blur(5px)";
                    document.querySelector(".DELETE_ME") ? button.style.display = "block" : button.style.display = "none";
                };
            };
        };
        if(this.checked === false){
            window.removeEventListener("scroll", SetupPictures);
            button.style.display = "none";
            for(let l of picture){
                l.href = l.getAttribute("old-href");
                l.removeAttribute("old-href");
                l.onclick = null;
                if(l.classList.contains("DELETE_ME")){
                    l.getElementsByTagName("img")[0].style.filter = "";
                };
            };
        };
    };
    function StartDelete(){
        if(confirm("Are you sure you want to delete " + document.getElementsByClassName("DELETE_ME").length + " photos?")){
            let picture = document.querySelectorAll("a.DELETE_ME");
            let auth = document.querySelector("meta[name='csrf-token']").getAttribute("content");
            let name = document.querySelector("meta[name='csrf-param']").getAttribute("content");
            let DeleteNumber = 1;
            document.getElementById("DeleteButtonSection").innerHTML = LoadingContainer();
            for(let l of picture){
                AJAXPost(l.getAttribute("old-href"), {"_method": "delete", [name]: auth}).then(function(rawr){
                    ++DeleteNumber;
                    if(DeleteNumber > picture.length){
                        window.location.reload(true);
                    };
                }, onError);
            };
        };
    };
    let a = document.querySelector("main > div > div.flex-none.pl3.pt1.pt2-ns");
    if(a){
        let b = a.cloneNode(false);
        b.innerHTML = "<span class='relative items-center link br1 us-none ba b--light-primary bg-transparent hover-bg-transparent light-silver o-80 fill-silver glow fw4  tc db lh-copy f6 pv04 ph3-ns ph2'><input type='checkbox' id='BulkDelete' /> Bulk Delete<span id='DeleteButtonSection' style='display: none;'><br /><a id='DeleteButton' style='background-color: #a00; font-size: 1.2em; padding: 5px 15px; text-decoration: none;'>Delete</a></span></span>";
        a.after(b);
        document.getElementById("BulkDelete").addEventListener("click", StartBulk);
        document.getElementById("DeleteButton").addEventListener("click", StartDelete);
    };
};
//=======================================================
//
// End "Gallery.js" Functions for FLE
//
//=======================================================
//=======================================================
//
// Start "MassMessage.js" Functions for FLE
//
//=======================================================
function MassMessageEvent(item){
    function getSubjectBody(){
        Old_mmSubject = document.getElementById("MassMessageSubject").value;
        Old_mmBody = document.getElementById("MassMessageBody").value;
        Pagination();
    };
    function Pagination(){
        document.getElementById("mmTable").innerHTML = "<div style='width: 100%; font-style: italic; font-size: 1.2em;'><center>Sending Messages...</center></div>";
        if(pagination){
            AJAXGet(main_url + Location + (/\?status=maybe/.test(location.href) ? "/maybe" : "") + "?page=" + +loadPage, function(NextPage){
                let LoadedHTML = document.createElement("div");
                LoadedHTML.innerHTML = NextPage;
                let user = (NewMassMessage) ? LoadedHTML.getElementsByClassName("w-50-ns w-100 ph1") : LoadedHTML.getElementsByClassName("fl-member-card__user");
                let Username;
                let UserLower;
                let UserID;
                let Users;
                for(let a of user){
                    if(NewMassMessage == true){
                        Users = a.querySelector("a.link.f5.fw7.secondary");
                        Username = Users.innerText;
                        UserLower = Username.toLowerCase();
                        UserID = Users.href.split("/users/")[1];
                    }else if(NewMassMessage == false){
                        Username = a.innerHTML;
                        UserLower = Username.toLowerCase();
                        UserID = a.href.split("/users/")[1];
                    };
                    if(Username !== EventOwner){
                        AllUsers[AllUsers.length] = [UserID, Username];
                    };
                };
                +loadPage++;
                if(+loadPage <= +lastPage){
                    Pagination();
                }else{
                    Step2();
                };
            });
        };
        if(!pagination){
            let user = (NewMassMessage) ? document.getElementsByClassName("w-50-ns w-100 ph1") : document.getElementsByClassName("fl-member-card__user");
            let Username;
            let UserLower;
            let UserID;
            let Users;
            for(let a of user){
                if(NewMassMessage == true){
                    Users = a.querySelector("a.link.f5.fw7.secondary");
                    Username = Users.innerText;
                    UserLower = Username.toLowerCase();
                    UserID = Users.href.split("/users/")[1];
                }else if(NewMassMessage == false){
                    Username = a.innerHTML;
                    UserLower = Username.toLowerCase();
                    UserID = a.href.split("/users/")[1];
                };
                if(Username !== EventOwner){
                    AllUsers[AllUsers.length] = [UserID, Username];
                };
            };
            Step2();
        };
    };
	function Step2(){
		document.getElementById("mmTable").innerHTML = "<div style='width: 100%; font-style: italic; font-size: 1.2em;'><center>All Messages Sent! :D</center></div>";
		if(OnNumber <= AllUsers.length - 1){
			mmSubject = (Old_mmSubject.match(/\{Username\}/g)) ? Old_mmSubject.replace(/\{Username\}/g, AllUsers[OnNumber][1]) : Old_mmSubject;
			mmBody = (Old_mmBody.match(/\{Username\}/g)) ? Old_mmBody.replace(/\{Username\}/g, AllUsers[OnNumber][1]) : Old_mmBody;	
			document.getElementById("mmTable").innerHTML = "<div style='width: 100%; font-style: italic; font-size: 1.2em;'><center>Sending Message to " + AllUsers[OnNumber][1] + "</center></div>";
			if((item.DebugFLE && item.DebugFLE == true) && pagination){
				//document.getElementById("mmTable").parentNode.innerHTML += OnNumber + ". " + AllUsers[OnNumber][1] + "<br />" + document.getElementById("footer").innerHTML;
				setTimeout(function(){
					OnNumber++;
					Step2();
				}, 500);
			}else{
				SendMsg(AllUsers[OnNumber][0], AllUsers[OnNumber][1]);
			};
		};
	};
	function SendMsg(id, username){
		let auth = document.querySelector("meta[name='csrf-token']").getAttribute("content");
		let name = document.querySelector("meta[name='csrf-param']").getAttribute("content");
		AJAXPost(main_url + "/conversations", {"with": [id], "subject": mmSubject, "body": mmBody, "source": "profile"}, auth).then(
			function(OnSent){
				setTimeout(function(){
					OnNumber++;
					Step2();
				}, 1200);
			},
			function(NotSent){
				document.getElementById("mmTable").innerHTML = "<div style='width: 100%; font-style: italic; font-size: 1.2em;'><center>Error sending message to " + AllUsers[OnNumber][1] + "<br />User was de-activated or removed.<br />Messaging next person...</center></div>";
				setTimeout(function(){
					OnNumber++;
					Step2();
				}, 2000);
			}
		);
	};
    let Format = getTypes(item.CheckboxName).AddFormatButtons;
    let EventOwner;
    let NewMassMessage;
    if(document.getElementsByClassName("fl-nav__nickname")[0]){
        EventOwner = document.getElementsByClassName("fl-nav__nickname")[0].innerHTML;
        NewMassMessage = false;
    }else if(document.querySelector("nav > div > a[href*='/users/'][title='View Profile'] > span")){
        EventOwner = document.querySelector("nav > div > a[href*='/users/'][title='View Profile'] > span").innerText;
        NewMassMessage = true;
    };
    let moderate = false;
    let pagination;
    let links;
    let currentPage;
    let loadPage;
    let lastPage;
    let AllUsers = new Array();
    let OnNumber = 0;
    let ExcludeUser = new Array();
    let mmSubject, Old_mmSubject;
    let mmBody, Old_mmBody;
    let q = document.getElementsByTagName("a");
    for(let g in q){
        if((q[g].title === "moderation" || q[g].className === "moderate_button") && q[g].innerHTML.match("moderate")){
            moderate = true;
        };
    };
    if(moderate === true){
        pagination = document.getElementsByClassName("pagination")[0];
        if(pagination){
            links = pagination.getElementsByTagName("a");
            currentPage = pagination.getElementsByClassName("current")[0];
            lastPage = "";
            loadPage = currentPage.innerHTML;
            for(let z in links){
                if(/\?page=(\d+)/i.test(links[z].href) && links[z].className !== "next_page"){
                    lastPage = links[z].innerHTML;
                };
            };
        };
        if(NewMassMessage == true){
            let Tabs = document.querySelector("main > div > header");
            if(!Tabs.parentNode.getElementsByClassName("box")[0]){
                Tabs.querySelector("div.flex-none > div > div").innerHTML += "<a id='MassMessage' style='float: right;' href='javascript:void(0)' onclick='var rawr = document.getElementById(\"mmTable\"); (rawr.style.display == \"none\") ? rawr.style.display = \"inline\" : rawr.style.display = \"none\";' class='flex-none no-underline fade-color db pv2 ph3 f6 br1 lh-copy gray hover-silver'>Mass Message</a>";
                let new_div = document.createElement("div");
                new_div.id = "mmTable";
                new_div.style.display = "none";
                new_div.innerHTML = "<table width='100%'><tbody><tr><th><label>Subject:</label></th><td><input id='MassMessageSubject' placeholder='Subject' style='width: 100%; background: #333; color: #ccc; border-style: none; border-width: 0; font-weight: bold; line-height: 23px; font-size: 20px; padding: 8px; margin-bottom: 2px;' /></td></tr><tr><th><label>Message:</label></th><td><textarea id='MassMessageBody' placeholder='Type your message' class='text expand' style='background: #333; color: #ccc; width: 100%; min-height: 250px; overflow: show; overflow-wrap: break-word; resize: horizontal; height: 270px; border-style: none; border-width: 0;'></textarea></td></tr><tr><td colspan='2'><center><a href='javascript:void(0);' id='sendMM' style='background-color: #a00; font-size: 1.2em; padding: 5px 15px; text-decoration: none;'>Send Message</a></center></td></tr></tbody></table>";
                Tabs.after(new_div);
                if(Format){
                    RunFormatButtons(document.querySelector("textarea#MassMessageBody"), true);
                    let style = document.createElement("style");
                    document.head.appendChild(style);
                    style.sheet.insertRule(".FormatButtons > a { text-decoration: none !important; background-color: #333; color: #ddd; height: 30px; width: 30px; padding: 5px; }");
                    style.sheet.insertRule(".TooltipText { cursor: default !important; text-align: initial !important; display: block; z-index: 9999; overflow: hidden; position: absolute; background-color: #3f3f3f; border: 1px solid #cccccc; border-radius: 15px; padding: 10px; margin: 10px; font-size: 12px; color: #aaa; width: 163px; }");
                };
            };
        }else if(NewMassMessage == false){
            let Tabs = document.getElementById("tabnav");
            if(!Tabs.parentNode.getElementsByClassName("box")[0]){
                Tabs.innerHTML += "<li id='MassMessage' style='float: right;'><a href='javascript:void(0)' onclick='var rawr = document.getElementById(\"mmTable\"); (rawr.style.display == \"none\") ? rawr.style.display = \"inline\" : rawr.style.display = \"none\";'>Mass Message</a></li>";
                let new_div = document.createElement("div");
                new_div.id = "mmTable";
                new_div.style.display = "none";
                new_div.innerHTML = "<table width='100%'><tbody><tr><th><label>Subject:</label></th><td><input id='MassMessageSubject' placeholder='Subject' class='title' style='width: 100%; background: #333; color: #ccc; border-style: none; border-width: 0;' /></td></tr><tr><th><label>Message:</label></th><td><textarea id='MassMessageBody' placeholder='Type your message' class='text expand' style='background: #333; color: #ccc; width: 100%; min-height: 250px; overflow: show; overflow-wrap: break-word; resize: horizontal; height: 270px; border-style: none; border-width: 0;'></textarea></td></tr><tr><td colspan='2'><center><a href='javascript:void(0);' id='sendMM' style='background-color: #a00; font-size: 1.2em; padding: 5px 15px; text-decoration: none;'>Send Message</a></center></td></tr></tbody></table>";
                Tabs.after(new_div);
                if(Format){
                    RunFormatButtons(document.querySelector("textarea#MassMessageBody"), true);
                };
            };
        }
        const startMM = document.getElementById("sendMM");
        startMM.addEventListener("click", getSubjectBody);
    };
};
function MassMessageFriends(boobs, SearchBreakUnfriendFix){
	function LoadList(){
		if(boobs.MassMessageFriendsList){
			for(let a of boobs.MassMessageFriendsList){
				MassFriends.push([a[0], a[1]]);
			};
			document.getElementById("MassFriendsNumber").innerHTML = MassFriends.length;
			for(let c of boobs.MassMessageFriendsList){
				if(location.href.match("MassMessageFriends")){
					document.getElementById("MassFriendsNumber").className = "dib ph1 ml2 f7 fw4 text br1 bg-mid-gray";
				}else{
					document.getElementById("MassFriendsNumber").className = "dib ph1 ml2 f7 fw4 silver br1 bg-dark-gray";
				};
				if(document.querySelector("[mass-message-user='" + c[1] + "']")){
					let b = document.querySelector("[mass-message-user='" + c[1] + "']");
					b.setAttribute("mass-message","true");
					b.innerHTML = "remove from mass message";
				};
			};
		};
	};
	function MassMessageFriend_A(){
		if(this.getAttribute("mass-message") == "false"){
			let parent_a = this.parentNode.parentNode.querySelector("a.link.f5.fw7.secondary");
			let Username = parent_a.innerHTML;
			let ID = parent_a.href.split("/users/")[1];
			this.innerHTML = "remove from mass message";
			this.setAttribute("mass-message","true");
			MassFriends.push([ID, Username]);
			document.getElementById("MassFriendsNumber").innerHTML = MassFriends.length;
			document.getElementById("MassFriendsNumber").className = "dib ph1 ml2 f7 fw4 silver br1 bg-dark-gray";
		}else if(this.getAttribute("mass-message") == "true"){
			let parent_a = this.parentNode.parentNode.querySelector("a.link.f5.fw7.secondary");
			let Username = parent_a.innerHTML;
			let ID = parent_a.href.split("/users/")[1];
			this.innerHTML = "add to mass message";
			this.setAttribute("mass-message","false");
			for(let a in MassFriends){
				if(MassFriends[a][0] === ID){
					MassFriends.splice(a, 1);
					a--;
				};
			};
			if(MassFriends.length > 0){
				document.getElementById("MassFriendsNumber").innerHTML = MassFriends.length;
				document.getElementById("MassFriendsNumber").className = "dib ph1 ml2 f7 fw4 silver br1 bg-dark-gray";
			}else{
				document.getElementById("MassFriendsNumber").innerHTML = "";
				document.getElementById("MassFriendsNumber").removeAttribute("class");
				DeleteSync("MassMessageFriendsList");
				return;
			};
		}else if(this.getAttribute("mass-message") === "MessagePage"){
			let Username = this.getAttribute("mmu");
			let ID = this.getAttribute("mmid");
			for(let a in MassFriends){
				if(MassFriends[a][0] === ID){
					MassFriends.splice(a, 1);
					a--;
				};
			};
			this.parentNode.remove();
			if(MassFriends.length > 0){
				document.getElementById("MassFriendsNumber").innerHTML = MassFriends.length;
				document.getElementById("MassFriendsNumber").className = "dib ph1 ml2 f7 fw4 text br1 bg-mid-gray";
			}else{
				document.getElementById("MassFriendsNumber").innerHTML = "";
				document.getElementById("MassFriendsNumber").removeAttribute("class");
				RemoveList();
				return;
			};
		};
		SaveList();
	};
	function SaveList(){
        SetSync("MassMessageFriendsList", MassFriends);
	};
	function RemoveList(){
		DeleteSync("MassMessageFriendsList");
		window.location.reload(true);
	};
	function StartMassMessageFriends(Format){
		document.title = "Mass Message Friends - " + user_name + " | FetLife";
		let stupid = document.getElementsByClassName("dib link f6 lh-title bg-mid-primary br1 br--top text bt b--dark-secondary bw1")[0];
		stupid.className = "dib link f6 lh-title gray hover-silver";
		stupid.firstChild.className = "pv2 ph3 br bl b--transparent";
		stupid.getElementsByTagName("span")[0].className = "dib ph1 ml2 f7 fw4 silver br1 bg-dark-gray";
		let z = document.querySelector("#TABLE_ID_YO");
		z.className = "dib link f6 lh-title bg-mid-primary br1 br--top text bt b--dark-secondary bw1";
		z.firstChild.className = "pv2 ph3 br bl b--primary";
		if(MassFriends.length > 0){
			document.getElementById("MassFriendsNumber").innerHTML = MassFriends.length;
			document.getElementById("MassFriendsNumber").className = "dib ph1 ml2 f7 fw4 silver br1 bg-mid-gray";
		}else{
			document.getElementById("MassFriendsNumber").innerHTML = "";
			document.getElementById("MassFriendsNumber").removeAttribute("class");
		};
		let x = boobs.MassMessageFriendsList
		if(x){
			let MMF = "";
			for(let i = 0;i<x.length;i++){
				let comma = (i >= x.length - 1) ? "" : ", ";
				MMF += "<span class='MessageSpan'><a href='javascript:void(0);' mass-message='MessagePage' mmid='" + x[i][0] + "' mmu='" + x[i][1] + "' title='Remove " + x[i][1] + "'>" + x[i][1] + "</a>" + comma + "</span>";
			};
			document.getElementById("MassFriendsNumber").className = "dib ph1 ml2 f7 fw4 text br1 bg-mid-gray";
			document.getElementsByTagName("main")[0].innerHTML = "<div id='mmTable' style='width: 80%; margin: auto;'><table width='100%'><tbody><tr><th width='20%'>To:</th><td width='80%'>" + MMF + "<br /><a href='javascript:void(0);' id='DeleteList' style='float: right;'>(remove all)</a></td></tr><tr><th width='20%'><label>Subject:</label></th><td width='80%'><input id='MassMessageSubject' placeholder='Subject' class='relative z-5 w105 w217-l pv1 ph2 f6 lh-copy moon-gray bg-dark-gray bn br0 ph-dark input-reset' style='width: 100%;' /></td></tr><tr><th width='20%'><label>Message:</label></th><td width='80%'><textarea id='MassMessageBody' placeholder='Type your message' class='text expand relative z-5 w105 w217-l pv1 ph2 f6 lh-copy moon-gray bg-dark-gray bn br0 ph-dark input-reset' style='width: 100%; min-height: 250px; overflow: show; overflow-wrap: break-word; resize: horizontal; height: 270px;'></textarea></td></tr><tr><td colspan='2' width='100%'><center><br /><a href='javascript:void(0);' id='sendMM' style='background-color: #a00; font-size: 1.2em; padding: 5px 15px; text-decoration: none;'>Send Message</a></center></td></tr></tbody></table></div>"
			for(let a of document.querySelectorAll("a[mass-message]")){
				a.addEventListener("click", MassMessageFriend_A);
			};
			if(Format){
				RunFormatButtons(document.querySelector("textarea#MassMessageBody"), true);
				let style = document.createElement("style");
				document.head.appendChild(style);
				style.sheet.insertRule(".FormatButtons > a { text-decoration: none !important; background-color: #333; color: #ddd; height: 30px; width: 30px; padding: 5px; }");
				style.sheet.insertRule(".TooltipText { cursor: default !important;  text-align: initial !important; display: block; z-index: 9999; overflow: hidden; position: absolute; background-color: #3f3f3f; border: 1px solid #cccccc; border-radius: 15px; padding: 10px; margin: 10px; font-size: 12px; color: #aaa; width: 163px; }");
			};
			document.getElementById("DeleteList").addEventListener("click", function(){
				let DELETEEEE = confirm("Are you sure you want to remove all users from the mass message?\n\nIf you want to remove a certain user, you can do so by clicking on their name.");
				if(DELETEEEE){
					RemoveList();
				}else{
					return;
				};
			});
			document.getElementById("sendMM").addEventListener("click", function(){
				if(document.getElementById("MassMessageSubject").value === ""){
					alert("Please enter a subject");
				}else if(document.getElementById("MassMessageBody").value === ""){
					alert("You must enter a message to send before you send the message!");
				}else{
					Old_MMFS = document.getElementById("MassMessageSubject").value;
					Old_MMFB = document.getElementById("MassMessageBody").value;
					StartSendMMF();
				};
			});
		}else{
			let MMFInfo = "<div style='width: 80%; margin: auto;'><center><h1 style='color: #c00;'>Oops!  No friends are selected to mass message! :(</h1></center><br />";
			MMFInfo += "<p style='font-size: 1.1em'>In order to Mass Message your friends you have to select which friends you want to mass message. ";
			MMFInfo += "How?  Follow these simple steps:<br /><br />";
			MMFInfo += "1. Go back to your Friends list. <br />";
			MMFInfo += "2. Click the \"add to mass message\" link next to the friend(s) you want to mass message.<br />";
			MMFInfo += "3. Come back to this page by clicking on the \"Mass Message\" link at the top.<br />";
			MMFInfo += "4. Simply fill out the Subject line and Message info.<br />";
			MMFInfo += "5. Click Send Message!<br /><br />";
			MMFInfo += "If you accidently added a friend, or would like to remove them from the message, you can either click on the \"remove from mass message\" link in the friends list, or click on that users name when you are typing your message.  If you would like to remove all users, click on \"remove all\".<br /><br />"
			MMFInfo += "Small Tip:  If you type {Username} into the subject or message, it will change into the Username that the current message is sending to!</p></div>";
			document.getElementsByTagName("main")[0].innerHTML = MMFInfo;
		}
	};
	function StartSendMMF(){
		document.getElementById("mmTable").innerHTML = "<div style='width: 100%; font-style: italic; font-size: 1.2em;'><center>All Messages Sent! :D</center></div>";
		document.getElementById("MassFriendsNumber").innerHTML = ((MassFriends.length - 1) >= OnNumber) ? (MassFriends.length) - OnNumber : "";
		if(OnNumber <= MassFriends.length - 1){
			New_MMFS = (Old_MMFS.match(/\{Username\}/g)) ? Old_MMFS.replace(/\{Username\}/g, MassFriends[OnNumber][1]) : Old_MMFS;
			New_MMFB = (Old_MMFB.match(/\{Username\}/g)) ? Old_MMFB.replace(/\{Username\}/g, MassFriends[OnNumber][1]) : Old_MMFB;	
			document.getElementById("mmTable").innerHTML = "<div style='width: 100%; font-style: italic; font-size: 1.2em;'><center>Sending Message to " + MassFriends[OnNumber][1] + "</center></div>";
			if(boobs.DebugFLE && boobs.DebugFLE == true){
				setTimeout(function(){
					OnNumber++;
					StartSendMMF();
				}, 500);
			}else{
				SendMsg(MassFriends[OnNumber][0], MassFriends[OnNumber][1]);
			};
		}else{
			RemoveList();
		};
	};
	function SendMsg(id, username){
		let auth = document.querySelector("meta[name='csrf-token']").getAttribute("content");
		let name = document.querySelector("meta[name='csrf-param']").getAttribute("content");
		AJAXPost(main_url + "/conversations", {"with": [id], "subject": New_MMFS, "body": New_MMFB, "source": "profile"}, auth).then(
			function(OnSent){
				document.getElementById("MassFriendsNumber").innerHTML = MassFriends.length - OnNumber;
				setTimeout(function(){
					OnNumber++;
					Step2();
				}, 1200);
			},
			function(NotSent){
				document.getElementById("mmTable").innerHTML = "<div style='width: 100%; font-style: italic; font-size: 1.2em;'><center>Error sending message to " + AllUsers[OnNumber][1] + "<br />User was de-activated or removed.<br />Messaging next person...</center></div>";
				setTimeout(function(){
					OnNumber++;
					Step2();
				}, 2000);
			}
		);
	};
	var MassFriends = new Array();
    let Format = getTypes(boobs.CheckboxName).AddFormatButtons;
	let Old_MMFS, New_MMFS;
	let Old_MMFB, New_MMFB;
	let OnNumber = 0;
	let tablelist = document.querySelector("[role='tablist']");
	let table_link = document.createElement("a");
	table_link.id = "TABLE_ID_YO";
	table_link.className = "dib link f6 lh-title gray hover-silver";
	table_link.innerHTML = "<div class='pv2 ph3 br bl b--transparent'><div class='pv1'>Mass Message<span id='MassFriendsNumber'></span></div></div>"
	if(!document.getElementById("TABLE_ID_YO") && location.href.match("/users/" + user_id + "/friends")){
        tablelist.appendChild(table_link);
    }
	table_link.addEventListener("click", function(){
		window.location.href = main_url + "/users/" + user_id + "/friends?MassMessageFriends";
	});
	if(location.href.match(/(\d+)\/friends/i)){
		let unfriend = document.getElementsByTagName("a");
		let card = document.getElementsByClassName("w-50-ns w-100 ph1");
		for(let aa of card){
			let click_event = aa.firstChild.getAttribute("onclick");
			aa.querySelector("div.f6.lh-copy.fw4.silver.nowrap.truncate").setAttribute("onclick", click_event);
			aa.firstChild.removeAttribute("onclick");
			if(SearchBreakUnfriendFix) aa.innerHTML = aa.innerHTML;
		};
		for(let a of unfriend){
			if(a.innerHTML === "unfriend" && !a.parentNode.querySelector("a[name='MassMessageLink']")){
				let a_new = document.createElement("a");
				a_new.name = "MassMessageLink";
				a_new.setAttribute("mass-message", "false");
				a_new.setAttribute("mass-message-user", a.parentNode.parentNode.querySelector("a.link.f5.fw7.secondary").innerHTML);
				a_new.className = "mid-gray hover-silver link underline";
				a_new.style.float = "right";
				a_new.innerHTML = "add to mass message";
				a.after(a_new);
				//a.parentNode.innerHTML += "<a name='MassMessageLink' mass-message='false' mass-message-user='" + a.parentNode.parentNode.querySelector("a.link.f5.fw7.secondary").innerHTML + "' href='javascript:void(0);' class='mid-gray hover-silver link underline' style='float: right;'>add to mass message</a>";
				if(SearchBreakUnfriendFix === true){
					a.href = "javascript:void(0);";
					a.addEventListener("click", function(){
						let Username = this.parentNode.parentNode.querySelector("a.link.f5.fw7.secondary");
						document.querySelector("div[data-id='unfriend-" + Username.href.split("/users/")[1] + "']").className = "fixed top-0 right-0 bottom-0 left-0 z-9999 pa3 bg-black-80 tc overflow-auto fade-in";
					});
				};
			};
		};
		for(let a of document.querySelectorAll("a[name='MassMessageLink']")){
			a.addEventListener("click", MassMessageFriend_A);
		};
	};
	if(location.href.match("MassMessageFriends")){
		StartMassMessageFriends(Format);
	};
	LoadList();
};
//=======================================================
//
// End "MassMessage.js" Functions for FLE
//
//=======================================================
//=======================================================
//
// Start "Events.js" Functions for FLE
//
//=======================================================
function ExportToCSV(hiya){
	function Pagination(){
		document.getElementById("csvSetup").style.display = "none";
		document.getElementById("csvLoading").style.display = "block";
		if(AllUsers.length === 0 || GoAroundAgain){
			if(pagination){
				AJAXGet(main_url + Location + (/\?status=maybe/.test(location.href) ? "/maybe" : "") + "?page=" + +loadPage, function(NextPage){
					let LoadedHTML = document.createElement("div");
					LoadedHTML.innerHTML = NextPage;
					let user = (NewMassMessage) ? LoadedHTML.getElementsByClassName("w-50-ns w-100 ph1") : LoadedHTML.getElementsByClassName("fl-member-card__user");
					let Username;
					let UserLower;
					let UserID;
					let Users;
					for(let a of user){
						if(NewMassMessage == true){
							Users = a.querySelector("a.link.f5.fw7.secondary");
							Username = Users.innerText;
							UserLower = Username.toLowerCase();
							UserID = Users.href.split("/users/")[1];
							UserAGR = Users.parentNode.querySelector("span.f6").innerText.replace(/\s+/g," ").trim();
							AllUsers[AllUsers.length] = [Username, UserID, UserAGR];
						}else if(NewMassMessage == false){
							Username = a.innerHTML;
							UserLower = Username.toLowerCase();
							UserID = a.href.split("/users/")[1];
							UserAGR = a.parentNode.querySelector(".fl-member-card__info").innerText.replace(/\s+/g," ").trim();
							AllUsers[AllUsers.length] = [Username, UserID, UserAGR];
						};
					};
					+loadPage++;
					if(+loadPage <= +lastPage){
						GoAroundAgain = true;
						Pagination();
					}else{
						GoAroundAgain = false;
						CreateCSV(EventName + (/\?status=maybe/.test(location.href) ? " Maybe's" : " RSVP's") + " Checklist.csv", AllUsers);
					};
				});
			};
			if(!pagination){
				let user = (NewMassMessage) ? document.getElementsByClassName("w-50-ns w-100 ph1") : document.getElementsByClassName("fl-member-card__user");
				let Username;
				let UserLower;
				let UserID;
				let Users;
				for(let a of user){
					if(NewMassMessage == true){
						Users = a.querySelector("a.link.f5.fw7.secondary");
						Username = Users.innerText;
						UserLower = Username.toLowerCase();
						UserID = Users.href.split("/users/")[1];
						UserAGR = Users.parentNode.querySelector("span.f6").innerText.replace(/\s+/g," ").trim();
						AllUsers[AllUsers.length] = [Username, UserID, UserAGR];
					}else if(NewMassMessage == false){
						Username = a.innerHTML;
						UserLower = Username.toLowerCase();
						UserID = a.href.split("/users/")[1];
						UserAGR = a.parentNode.querySelector(".fl-member-card__info").innerText.replace(/\s+/g," ").trim();
						AllUsers[AllUsers.length] = [Username, UserID, UserAGR];
					};
				};
				CreateCSV(EventName + (/\?status=maybe/.test(location.href) ? " Maybe's" : " RSVP's") + " Checklist.csv", AllUsers);
			};
		}else{
			CreateCSV(EventName + (/\?status=maybe/.test(location.href) ? " Maybe's" : " RSVP's") + " Checklist.csv", AllUsers);
		};
	};
	function CreateCSV(filename){
		let csvFile = "FetLife Username";
		//if(document.querySelector("#ShowUserAGR:checked")) csvFile += ",Age/Sex/Role";
		if(hiya.CSVFields){
			for(let a of hiya.CSVFields){
				if(document.querySelector("[name='Show" + a[1].split(" ").join("") + "']").checked === true){
					csvFile += "," + a[1];
				};
			};
		};
		csvFile += "\n";
		let x = 1;
		for(let i of AllUsers){
			csvFile += x++ + ". " + i[0]; // Username with Number
			//if(document.querySelector("#ShowUserAGR:checked")) csvFile += "," + i[2];
			csvFile += "\n";
		};
		let blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
		let url = URL.createObjectURL(blob);
		let link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		document.getElementById("csvSetup").style.display = "block";
		document.getElementById("csvLoading").style.display = "none";		
	};
	let EventOwner;
	let EventName = document.querySelector("header h1").innerText;
	let NewMassMessage;
	if(document.getElementsByClassName("fl-nav__nickname")[0]){
		EventOwner = document.getElementsByClassName("fl-nav__nickname")[0].innerHTML;
		NewMassMessage = false;
	}else if(document.querySelector("nav > div > a[href*='/users/'][title='View Profile'] > span")){
		EventOwner = document.querySelector("nav > div > a[href*='/users/'][title='View Profile'] > span").innerText;
		NewMassMessage = true;
	};
	let moderate = false;
	let pagination;
	let links;
	let currentPage;
	let loadPage;
	let lastPage;
	let AllUsers = new Array();
	let GoAroundAgain = false;
	let q = document.getElementsByTagName("a");
	for(let g in q){
		if((q[g].title === "moderation" || q[g].className === "moderate_button") && q[g].innerHTML.match("moderate") || (hiya.DebugFLE && hiya.DebugFLE == true)){
			moderate = true;
		};
	};
	if(moderate === true){
		pagination = document.getElementsByClassName("pagination")[0];
		if(pagination){
			links = pagination.getElementsByTagName("a");
			currentPage = pagination.getElementsByClassName("current")[0];
			lastPage = "";
			loadPage = currentPage.innerHTML;
			for(let z in links){
				if(/\?page=(\d+)/i.test(links[z].href) && links[z].className !== "next_page"){
					lastPage = links[z].innerHTML;
				};
			};
		};
		if(NewMassMessage == true){
			let Tabs = document.querySelector("main > div > header");
			if(!Tabs.parentNode.getElementsByClassName("box")[0]){
				Tabs.querySelector("div.flex-none > div > div").innerHTML += "<a id='CSVLink' style='float: right;' href='javascript:void(0);' onclick='var rawr = document.getElementById(\"csvTable\"); (rawr.style.display == \"none\") ? rawr.style.display = \"inline\" : rawr.style.display = \"none\";' class='flex-none no-underline fade-color db pv2 ph3 f6 br1 lh-copy gray hover-silver'>Create Guest List</a>";
				let new_div = document.createElement("div");
				new_div.id = "csvTable";
				new_div.style.display = "none";
				CSVTable = "<div id='csvSetup' style='margin-bottom: 20px;'>";
				if(hiya.CSVFields){
					for(let a of hiya.CSVFields){
						// if(a[1].toLowerCase() === "agegenderrole"){
						// 	CSVTable += "<div style='font-size: 1.2em;'><input style='width: 1.5em; height: 1.5em;' name='ShowUserAGR' type='checkbox' " + ((a[0] == true) ? "checked='true' " : "") + "/> Show Age/Gender/Role Field?</div>";
						// };
						if(a[1].toLowerCase() !== "agegenderrole"){
							CSVTable += "<div style='font-size: 1.2em;'><input style='width: 1.5em; height: 1.5em;' name='Show" + a[1].split(" ").join("") + "' type='checkbox' " + ((a[0] == true) ? "checked='true' " : "") + "/> Show " + a[1] + " Field?</div>";
						};
					};
				};
				CSVTable += "<br /><br /><center><a href='javascript:void(0);' id='startCSV' style='background-color: #a00; font-size: 1.2em; padding: 5px 15px; text-decoration: none;'>Create List</a></center></div><div id='csvLoading' style='display: none;'><div width='100%' class='large italic'><center>Creating File, Please Wait...<br /><br /><span id='LoadingContainerSPAN'></span></center></div></div>";
				new_div.innerHTML = CSVTable;
				Tabs.after(new_div);
			};
		}else if(NewMassMessage == false){
			let Tabs = document.getElementById("tabnav");
			if(!Tabs.parentNode.getElementsByClassName("box")[0]){
				Tabs.innerHTML += "<li style='float: right;'><a href='javascript:void(0);' id='CSVLink' onclick='let rawr = document.getElementById(\"csvTable\"); (rawr.style.display == \"none\") ? rawr.style.display = \"inline\" : rawr.style.display = \"none\";'>Create Guest List</a></li>";
				let new_div = document.createElement("div");
				new_div.id = "csvTable";
				new_div.style.display = "none";
				CSVTable = "<div id='csvSetup'>";
				if(hiya.CSVFields){
					for(let a of hiya.CSVFields){
						CSVTable += "<div style='font-size: 1.2em;'><input style='width: 1.5em; height: 1.5em;' name='Show" + a[1].split(" ").join("") + "' type='checkbox' " + ((a[0] == true) ? "checked='true' " : "") + "/> Show " + a[1] + " Field?</div>";
					};
				};
				CSVTable += "<br /><br /><center><a href='javascript:void(0);' id='startCSV' style='background-color: #a00; font-size: 1.2em; padding: 5px 15px; text-decoration: none;'>Create List</a></center></div><div id='csvLoading' style='display: none;'><div width='100%' class='large italic'><center>Creating File, Please Wait...<br /><br /><span id='LoadingContainerSPAN'></span></center></div></div>";
				new_div.innerHTML = CSVTable;
				Tabs.after(new_div);
			};
		};
		document.getElementById("LoadingContainerSPAN").innerHTML = LoadingContainer();
		document.getElementById("startCSV").onclick = Pagination;
	};
};
//=======================================================
//
// End "Events.js" Functions for FLE
//
//=======================================================
//=======================================================
//
// Start TESTING
//
//=======================================================
function Perks(){
    let ajax = new XMLHttpRequest();
    ajax.onload = function(){
        let reply = JSON.parse(ajax.responseText);
        if(location.href.match("/users/")){
            let FLESupporter = document.createElement("a");
            FLESupporter.className = "fl-badge FLE-Supporter";
            FLESupporter.href = "/groups/188715";
            FLESupporter.innerHTML = "FLE Supporter";
            for(let x of reply.Donors){
                let a = new RegExp(x.id,"i");
                if(location.href.match(a) && document.getElementById("profile")){
                    let badge_area = document.getElementById("maincontent").getElementsByClassName("span-4 last")[0];
                    badge_area.getElementsByTagName("div")[2] ? badge_area.getElementsByTagName("div")[2].after(FLESupporter) : badge_area.appendChild(FLESupporter);
                };
            };
        };
        if(location.href.match("groups/188715$")){
            let donators_header = document.createElement("h6");
            donators_header.className = "bottom quiet";
            donators_header.innerHTML = "Supporters";
            let group_donators = document.createElement("ul");
            group_donators.className = "group_donators group_mods";
            for(let x of reply.Donors){
                if(!x.group){
                    group_donators.innerHTML += "<li><a href='/users/" + x.id + "' class='small' title='View " + x.name + " profile'>" + x.name + "</a></li>";
                };
            };
            let group_mods = document.querySelector("ul.group_mods");
            group_mods.after(donators_header, group_donators);
        };
    };
    ajax.onerror = false;
    ajax.open("get", "https://www.fetlifeenhancer.droppages.com/Donators.json", true);
    ajax.send();
};
//=======================================================
//
// End TESTING
//
//=======================================================

//=======================================================
//
// Start Misc Functions for FLE
//
//=======================================================
function AJAXGet(url, NextPage, auth){
	return new Promise(function(resolve, reject){
		let ajax = new XMLHttpRequest();
		ajax.onload = function(){
			if(NextPage){
				NextPage(this.responseText);
				return;
			};
			//Grab New CSRF-Token if !NextPage
			let CSRF = document.createElement("div");
			CSRF.innerHTML = this.responseText;
			let NewCSRF = CSRF.querySelector("meta[name='csrf-token']").getAttribute("content");
			//document.querySelector("form#NewForm input[name='" + document.querySelector("meta[name='csrf-param']").getAttribute("content") + "']").value = NewCSRF;
			resolve(NewCSRF);
		};
		ajax.onerror = reject;
		ajax.open("get", url, true);
		auth && ajax.setRequestHeader("X-CSRF-Token", auth);
		ajax.send();
	});
};
function AJAXPost(url, options, auth){
	return new Promise(function(resolve, reject){
		/*
		NOTES:  This commented area is old and only kept if Fetlife updates things again.
		let params = typeof options == "string" ? options : Object.keys(options).map(
			function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(options[k]) }
		).join("&");
		*/
		let params = JSON.stringify(options);
		let ajax = new XMLHttpRequest();
		ajax.onload = function(){
			resolve(this.responseText);
		};
		ajax.onerror = reject;
		ajax.open("post", url);
		ajax.setRequestHeader('Accept', 'text/html');
		ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
		auth && ajax.setRequestHeader("X-CSRF-Token", auth);
		ajax.send(params);
	});
};
function validURL(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return !!pattern.test(str);
};
function StillLoading(Func){
	setTimeout(Func, 100);
};
function onError(error){
	console.log(`Error: ${error}`);
};
//=======================================================
//
// End Misc Functions for FLE
//
//=======================================================
//=======================================================
//
// Start Load/Save Functions for FLE
//
//=======================================================
function FLESettings(a){
	if(!(document.getElementsByClassName("fl-menu")[0] || document.getElementById("sidebar"))){
		StillLoading(function(){FLESettings(a)});
	};
	if(user_id){
		if(document.getElementsByClassName("fl-menu")[0]){
			var SettingsIcon = "<svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='16' height='16' viewBox='0 0 24 24'><path d='M 9.6679688 2 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 4.5058594 4.9785156 L 2.1738281 9.0214844 L 4.1132812 10.707031 C 4.0445153 11.128986 4 11.558619 4 12 C 4 12.441381 4.0445153 12.871014 4.1132812 13.292969 L 2.1738281 14.978516 L 4.5058594 19.021484 L 6.9296875 18.185547 C 7.5961042 18.732596 8.3550224 19.166199 9.1757812 19.476562 L 9.6679688 22 L 14.332031 22 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 19.494141 19.021484 L 21.826172 14.978516 L 19.886719 13.292969 C 19.955485 12.871014 20 12.441381 20 12 C 20 11.558619 19.955485 11.128986 19.886719 10.707031 L 21.826172 9.0214844 L 19.494141 4.9785156 L 17.070312 5.8144531 C 16.403896 5.2674041 15.644978 4.8338012 14.824219 4.5234375 L 14.332031 2 L 9.6679688 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z'></path></svg>";
			var div = document.getElementsByClassName("fl-menu")[0];
			var settings = document.createElement("div");
            settings.id = "FLE-Settings-fl-menu";
			settings.className = "fl-menu__separator fl-menu__content-actions";
			settings.innerHTML = "<div id='ExtraLinks' class='fl-menu__buttons-wrapper'><a id='AddOnSettings' class='fl-menu__button' style='display: block !important; float: relative; width: 100%' href='javascript:void(0);' title='Open FLE Settings'>" + SettingsIcon + "FLE Settings <!--<span style='float: right;'>[v]</span>--></a></div>";
            var settings_list = document.createElement("div");
            settings_list.id = "FLE-SettingsList";
            settings_list.className = "pa3 bb b--mid-primary";
            settings_list.style.display = "none";
            settings_list.innerHTML = "<ul class='list ma0 pa0 pl2'></ul>";
            settings.append(settings_list);
        };
		if(document.getElementById("sidebar")){
			var SettingsIcon = "<svg class='relative pd1 mr1' xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24'><path d='M 9.6679688 2 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 4.5058594 4.9785156 L 2.1738281 9.0214844 L 4.1132812 10.707031 C 4.0445153 11.128986 4 11.558619 4 12 C 4 12.441381 4.0445153 12.871014 4.1132812 13.292969 L 2.1738281 14.978516 L 4.5058594 19.021484 L 6.9296875 18.185547 C 7.5961042 18.732596 8.3550224 19.166199 9.1757812 19.476562 L 9.6679688 22 L 14.332031 22 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 19.494141 19.021484 L 21.826172 14.978516 L 19.886719 13.292969 C 19.955485 12.871014 20 12.441381 20 12 C 20 11.558619 19.955485 11.128986 19.886719 10.707031 L 21.826172 9.0214844 L 19.494141 4.9785156 L 17.070312 5.8144531 C 16.403896 5.2674041 15.644978 4.8338012 14.824219 4.5234375 L 14.332031 2 L 9.6679688 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z'></path></svg>";
			var div = document.getElementById("sidebar").firstChild;
			var settings = document.createElement("div");
			settings.id = "FLE-Settings-sidebar";
			settings.className = "pa3 bb b-gray-850";
			settings.innerHTML = "<div class='cf' id='ExtraLinks'><div class='fl w-50 pl2 pr1 pb1' style='width: 100%'><a id='AddOnSettings' class='db pv3 pl3 pr2 no-underline gray-300 hover-gray-50 fill-gray-300 hover-fill-gray-50 bg-gray-800 hover-bg-gray-500 theme-hover-bg-gray-600 bg-animate f6 fw7 w-100 truncate' href='javascript:void(0);' title='Open FLE Settings'>" + SettingsIcon + "		<span>FLE Settings</span></a></div></div>";
            var settings_list = document.createElement("div");
            settings_list.id = "FLE-SettingsList";
            settings_list.className = "pa3 bb b--mid-primary";
            settings_list.style.display = "none";
            settings_list.innerHTML = "<ul class='list ma0 pa0 pl2'></ul>";
            settings.append(settings_list);
        };
		div.childNodes[0].after(settings);
		document.getElementById("AddOnSettings").addEventListener("click", function(){
            //let a = document.getElementById("FLE-SettingsList");
            //(a.style.display == "none") ? a.style.display = "" : a.style.display = "none";
            OpenSettings(a);
        });
        LoadSettings(a);
        Perks();
	}else{
		document.getElementById("sidebar").getElementsByTagName("ul")[0].innerHTML += "<li><a id='AddOnSettings' class='dib link pv1 moon-gray hover-near-white lh-title' style='font-size: 18px;' title='Open FLE Settings' href='javascript:void(0)'>FLE Settings</a></li>";
		document.querySelector("#AddOnSettings").addEventListener("click", function(){
			chrome.storage.sync.set({
				FLESettings: Math.floor(Math.random() * 1234567890)
			});
		});
	};
};
function OpenSettings(Restore){
    function ClickedOutsideSettings(manufacture){
        if(manufacture.target.id === "FLE-Inner"){
            document.getElementById("FetLifeEnhancer").style.display = "none";
            document.removeEventListener("click", ClickedOutsideSettings);
        };
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
            DeleteSync(CLASS + "s");
        };
    };
    if(!document.getElementById("SettingsCSS")){
        let SettingsCSS = document.createElement("style");
        SettingsCSS.id = "SettingsCSS";
        document.head.appendChild(SettingsCSS);
        SettingsCSS.sheet.insertRule("#Content{margin:auto;width:60%;padding:10px 20px;font-family: 'Lucida Grande', 'Lucida Sans Unicode', Arial, Verdana, sans-serif !important;font-size: 14px;}");
        SettingsCSS.sheet.insertRule("#Content > :not(hr){position:relative;border:0;font:inherit;line-height:18px;text-overflow:ellipsis}");
        SettingsCSS.sheet.insertRule("#Content hr{background:rgba(255,255,255,0.295);border:0;height:1px;margin:2px 0}");
        SettingsCSS.sheet.insertRule("#Content > div > h1,#FloatyBoxyThingy > div > h1{font-family: 'Lucida Grande', 'Lucida Sans Unicode', Arial, Verdana, sans-serif !important;font-weight:bold !important;font-size:26px;padding:20px;margin:10px 1px}");
        SettingsCSS.sheet.insertRule("#Content > div:not(.active) > h1{cursor:pointer;border-radius:15px;background-color:#2c2c2c;color:#aaa}");
        SettingsCSS.sheet.insertRule("#Content > div:not(.active) > h1:hover{color:#eee}");
        SettingsCSS.sheet.insertRule("#Content > div.active > h1,#FloatyBoxyThingy > div.active > h1{border-radius:15px 15px 0 0;background-color:#c00;color:#eee}");
        SettingsCSS.sheet.insertRule("#Content div.active ul, #Content div.text{border-radius:0 0 15px 15px;margin:-10px 1px 10px;padding:10px;list-style:none;background-color:#2c2c2c;color:#aaa;cursor:default}");
        SettingsCSS.sheet.insertRule("#Content div:not(.active) ul{display:none}");
        SettingsCSS.sheet.insertRule("#Content ul li{display:flex;flex-flow:row wrap}");
        SettingsCSS.sheet.insertRule("#Content ul li:first-of-type{padding:0 5px 10px}");
        SettingsCSS.sheet.insertRule("#Content ul li:not(:first-of-type){padding:10px 5px}");
        SettingsCSS.sheet.insertRule("#Content li.border:not(:last-child){border-bottom:1px solid rgba(255,255,255,0.295)}");
        SettingsCSS.sheet.insertRule("#Content .subheader{border-radius:15px;width:100%;background-color:#3f3f3f;padding:10px!important}");
        SettingsCSS.sheet.insertRule("#Content .name{flex:0 0 70%;font-size:17px;align-items:center;padding:10px 8px 0 0}");
        SettingsCSS.sheet.insertRule("#Content .description{font-size:13px}");
        SettingsCSS.sheet.insertRule("#Content .checkbox,#Content .textbox,#Content .buttonbox{display:flex;flex:1;align-items:center;border-left:1px dashed rgba(255,255,255,0.295);padding:0 0 0 15px;font-size:16px}");
        SettingsCSS.sheet.insertRule("#Content .textbox,#Content .buttonbox{padding:0 0 0 20px !important}");
        SettingsCSS.sheet.insertRule(".showme{width:100%;padding:10px 0 0;display:none;flex-flow:row wrap}");
        SettingsCSS.sheet.insertRule("#Content input[type='checkbox']{width:20px;height:20px}");
        SettingsCSS.sheet.insertRule("#Content .enable-disable{padding:0 0 0 10px}");
        SettingsCSS.sheet.insertRule("#Content input[type='text'],#Content input[type='password'],#Content textarea{border:0;color:#eee;background-color:#777}");
        SettingsCSS.sheet.insertRule("#Content input[type='checkbox'] + .enable-disable:before{content:'Disabled'}");
        SettingsCSS.sheet.insertRule("#Content input[type='checkbox']:checked + .enable-disable:before{content:'Enabled'}");
        SettingsCSS.sheet.insertRule("#Content .Info{width:100%}");
        SettingsCSS.sheet.insertRule("#Content .Info > .InfoHeader{display:flex;align-items:center;border-radius:15px;background-color:#3f3f3f;padding:10px;font-size:16px}");
        SettingsCSS.sheet.insertRule("#Content .Info > .InfoHeader > div:not(:last-child){flex:0 0 35%;padding:0 4px 0 0}");
        SettingsCSS.sheet.insertRule("#Content .Info > div{display:flex;padding-top:4px}");
        SettingsCSS.sheet.insertRule("#Content .Info > .Location > div:not(:last-child),.Info > .Account > div:not(:last-child){flex:0 0 35%;padding:10px 4px 0 0}");
        SettingsCSS.sheet.insertRule("#Content .Info > .Location > div:last-child,.Info > .Account > div:last-child{display:flex;flex:1;align-items:center;border-left:1px dashed rgba(255,255,255,0.295);padding:10px 0 0 20px}");
        SettingsCSS.sheet.insertRule("#Content .Info > .Location > div > input[type='text'],.Info > .Account > div > input[type='text'],.Info > .Account > div > input[type='password']{width:80%}");
        SettingsCSS.sheet.insertRule("#Content .Info > .CSVField > div:nth-child(1){flex:0 0 10%;display:flex;justify-content:center!important;padding:10px 4px 0 0}");
        SettingsCSS.sheet.insertRule("#Content .Info > .CSVField > div:nth-child(2){flex:0 0 60%;padding:10px 4px 0 0}");
        SettingsCSS.sheet.insertRule("#Content .Info > .CSVField > div:nth-child(0){flex:0 0 35%;padding:10px 4px 0 0}");
        SettingsCSS.sheet.insertRule("#Content .Info > .CSVField > div:last-child{display:flex;flex:1;align-items:center;border-left:1px dashed rgba(255,255,255,0.295);padding:10px 0 0 20px}");
        SettingsCSS.sheet.insertRule("#Content .Info > .CSVField > div > input[type='text']{width:80%}");
        SettingsCSS.sheet.insertRule("#Content .InfoButton{width:100%;padding:10px 0 0}");
        SettingsCSS.sheet.insertRule("#Content .Tooltip{border-bottom:1px dotted rgba(255,255,255,0.295)}");
        SettingsCSS.sheet.insertRule("#Content .TooltipText{display:none;position:absolute;background-color:#3f3f3f;border:1px solid #ccc;border-radius:15px;padding:10px;margin:10px;font-size:12px;color:#aaa;max-width:250px;opacity:0;transition:opacity .5s}");
        SettingsCSS.sheet.insertRule("#Content .Tooltip:hover .TooltipText{display:block;z-index:99999;position:absolute;overflow:hidden;opacity:1}");
        SettingsCSS.sheet.insertRule("#Content #FloatyLinks{top:0;right:0;position:fixed;color:#fff;font-size:12px}");
        SettingsCSS.sheet.insertRule("#Content #FloatyLinks > div,#Version > div{background-color:#2c2c2c;border-radius:15px;padding:10px;margin:10px 20px 10px 10px}");
        SettingsCSS.sheet.insertRule("#Content #FloatyLinks > div > a > img{width:40px;height:auto}");
        SettingsCSS.sheet.insertRule("#Content a:link{color:#aaa;text-decoration:underline;cursor:pointer!important}");
        SettingsCSS.sheet.insertRule("#Content a:hover{color:#c00}");
        SettingsCSS.sheet.insertRule("#Content a:visited,a:active{color:#aaa}");

    };
    if(!document.getElementById("FetLifeEnhancer")){
        let a = document.createElement("div");
        a.id = "FetLifeEnhancer";
        Object.assign(a.style, {
            zIndex: "3000000001",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(85,85,85,0.7)",
            padding: 0,
            margin: 0,
            overflow: "auto"
        });
        let b = document.createElement("div");
        b.id = "FLE-Inner";
        Object.assign(b.style, {
            zIndex: "3000000002",
            width: "100%",
            height: "100%",
            margin: "auto"
        });
        let Settings = new Array();
        // Category ->
        //    CheckboxName, Name, (Optional: Description)
        let CloseFLESettings = "<span style='float: right;'><a href='javascript:void(0);' id='CloseFLESettings'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><polygon fill-rule='evenodd' fill='#eee' points='6.444 8 1 2.556 2.556 1 8 6.444 13.444 1 15 2.556 9.556 8 15 13.444 13.444 15 8 9.556 2.556 15 1 13.444'></polygon></svg></a></span>";
        Settings["User Interface Settings" + CloseFLESettings] = [
            ["FloatyNav", "Keep Navigation Bar on top"],
            ["FriendsInNav", "Add a \"Friends\" link to the navigation bar"],
            ["MentionLinks", "Make all user mentions clickable links", "Changes all @Username mentions into links that go to that users profile."],
            ["AddFormatButtons", "Add Format Buttons to textareas", "Adds Bold, Italics, List, ect. buttons around FetLife so you no longer have to remember the formatting options."],
            ["QuickEditAboutMe", "Quick edit \"About Me\" section of profile", "Quickly edit your \"About Me\" section of your profile by clicking on the \"quick edit\" link."],
            ["ArchiveDeleteInbox", "Mass Archive/Delete messages in your inbox", "Adds checkboxes to the side of each message in your inbox so you can quickly Archive and Delete messages.  Also adds new Archive and Delete buttons."],
            ["QuickReply", "Quick Reply Messages", "Compose premade messages to quick reply to people.<br />Adds a section labeled \"Quick Replies\" when replying to messages (Above the \"Delete/Archive\" on the right). To add/edit messages and other settings, go to your inbox on FetLife and click on \"Quick Reply Settings\"."],
            ["NotificationBox", "Facebook Style Friend Requests", "When you click on the Friend Requests icon in the navigation, it makes it load like Facebooks where it puts them all into a floaty box instead of loading a new page."]
        ];
        Settings["Event Settings"] = [
            ["MassMessage", "Mass Message RSVPs/Maybes on your event", "Adds a 'Mass Message' tab when viewing the 'RSVP' or 'Maybe' list of your own event(s)."],
            ["ExportToCSV", "Create Guest List of RSVPs/Maybes", "Adds a \"Create Guest List\" tab when viewing the \"RSVP\" or \"Maybe\" list of your own event(s).  When clicked, you can download and print a premade list/spreadsheet of each user whom is \"RSVP\" or \"Maybe\".", "<div class='showme'><div class='Info' id='CSVFields'><div class='InfoHeader'><div>Enabled</div><div>Additional Fields<span class='Tooltip'>(?)<span class='TooltipText'>Create your own fields for the spreadsheet, such as if a user paid, or if they have arrived.</span></span></div><div><!--unicorns and rainbows!--></div></div></div><div class='InfoButton' id='AddCSVField'><input type='button' name='AddCSVField' value='Add Field' /></div></div>"],
            ["AddToGoogleCalendar", "Add event to Google Calendar", "Adds a link above the time of the event that when pressed, will open a new page to add the event to your Google calendar"]
        ];
        Settings["Gallery Settings"] = [
            ["MultiImageUpload", "Upload Multiple Pictures", "Allows you to upload multiple pictures with ease!  When you are on the upload picture page, just click the \"Add More Pictures\" button."],
            ["BulkDeletePhotos", "Bulk Delete Pictures", "Quickly delete any of your picures.  When you are viewing all your pictures, click on the checkbox labeled \"Bulk Delete\" then choose which pictures to delete by clicking on them."],
            ["SaveYourPics", "Right-Click to save your pictures", "When viewing your pictures (and only yours), you will be able to save your pictures by right-clicking and choosing \"Save As\"."]
        ];
        Settings["Miscellaneous"] = [
            ["PrettyTextareas", "Pretty Textareas", "Changes all the white textareas/input boxes to match the rest of FetLife."],
            ["MassMessageFriends", "Mass Message Friends", "Adds a \"Mass Message\" tab when viewing your friends list."],
            ["OTHER", "Restore default settings", "<div class='buttonbox'><input type='button' value='Reset!' name='RestoreSettings' /></div>"]
        ];
        let EverySetting = "";
        EverySetting = "<div id='FloatyLinks'><div id='Donate-Paypal'><a href='https://www.paypal.me/princessbabytaytay' target='_blank' title='Support me by donating!'><img src='https://i.imgur.com/mPn4etx.png' /></a></div><div id='FLEGroup'><a href='https://fetlife.com/groups/188715' target='_blank' title='Need help?  Join the FetLife Group!'><img src='https://i.imgur.com/auee969.png' /></a></div></div>";
        for(let Category of Object.keys(Settings)){
            EverySetting += "<div class='active'><h1>" + Category + "</h1><ul>";
            for(let Feature of Object.keys(Settings[Category])){
                //alert(Settings[Category][Feature][0] + "\n" + Settings[Category][Feature][1] + "\n" + Settings[Category][Feature][2])
                if(Settings[Category][Feature][0] === "OTHER"){
                    EverySetting += "<li class='border'><div class='name'>" + Settings[Category][Feature][1] + "</div>" + Settings[Category][Feature][2] + "</li>";
                }else if(Settings[Category][Feature][3]){
                    EverySetting += "<li class='border toggle'><div class='name'>" + Settings[Category][Feature][1] + ((Settings[Category][Feature][2]) ? "<div class='description'>" + Settings[Category][Feature][2] + "</div>" : "") + "</div><div class='checkbox'><input class='FLE-Checkboxes' type='checkbox' name='" + Settings[Category][Feature][0] + "' /><span class='enable-disable'></span></div>" + Settings[Category][Feature][3] + "</li>";
                }else{
                    EverySetting += "<li class='border'><div class='name'>" + Settings[Category][Feature][1] + ((Settings[Category][Feature][2]) ? "<div class='description'>" + Settings[Category][Feature][2] + "</div>" : "") + "</div><div class='checkbox'><input class='FLE-Checkboxes' type='checkbox' name='" + Settings[Category][Feature][0] + "' /><span class='enable-disable'></span></div></li>";
                };
            };
            EverySetting += "</ul></div>";
        };
        let c = document.createElement("div");
        c.id = "Content";
        c.innerHTML = EverySetting;
        b.append(c);
        a.append(b);
        document.body.append(a);
        document.querySelector("#CloseFLESettings").onclick = function(){
            document.getElementById("FetLifeEnhancer").style.display = "none";
        };
        for(let x of document.querySelectorAll("input.FLE-Checkboxes")){
            x.addEventListener("click", SaveSettings);
        };
        document.querySelector("#Content [name=RestoreSettings]").addEventListener("click", function(){
            var ConfirmIt = confirm("Are you sure you would like to reset all your settings?");
            if(ConfirmIt == true){
                DeleteSync(key);
                window.location.reload(true);
            };
        });
        for(let a of Restore.CheckboxName){
            document.querySelector("input.FLE-Checkboxes[name='" + a + "']:not([name*='CSVField']").setAttribute("checked", "true");
            if(a === "ExportToCSV"){
                document.querySelector("input.FLE-Checkboxes[name='ExportToCSV']:not([name*='CSVField']").parentNode.parentNode.querySelector("div.showme").style.display = "flex";
            };
        };
        //============All CSVFields loading Stuff
        if(Restore.CSVFields){
            let LoadedField = "";
            for(let a of Restore.CSVFields){
                LoadedField += "<div class='CSVField'>";
                LoadedField += "<div><input type='checkbox' name='CSVField1' " + ((a[0] == true) ? "checked='true'" : "") + "/></div>";
                LoadedField += "<div><input type='text' name='CSVField2' value='" + a[1] + "' placeholder='Enter Field Name' /></div>";
                LoadedField += "<div><input type='button' name='CSVFieldDelete' value='Delete' /></div>";
                LoadedField += "</div>";
            };
            document.querySelector("#CSVFields").innerHTML += LoadedField;
            for(let x of document.querySelectorAll(".CSVField > div > [type=text]")){
                x.addEventListener("keyup", SaveSettings);
            };
            for(let x of document.querySelectorAll(".CSVField > div > input[type='checkbox']")){
                x.addEventListener("click", SaveSettings);
            };
            for(let x of document.querySelectorAll("#Content [name$='Delete']")){
                x.addEventListener("click", DeleteInputs);
            };
        };
        document.querySelector("input.FLE-Checkboxes[name='ExportToCSV']").addEventListener("click", function(){
            if(this.checked === true){
                this.parentNode.nextElementSibling.style.display = "flex";
            }else{
                this.parentNode.nextElementSibling.style.display = "none";
            };
        });
        document.querySelector("#Content input[name=AddCSVField]").addEventListener("click", function(){
            AddMoreInputs("CSVField","checkbox","text","","Enter Field Name");
            SaveSettings();
        });
        //=============End CSVFields loading Stuff
        document.addEventListener("click", ClickedOutsideSettings);
    }else{
        document.getElementById("FetLifeEnhancer").style.display = "";
        document.addEventListener("click", ClickedOutsideSettings);
    };
};
function LoadSettings(boobs){
    let FN = getTypes(boobs.CheckboxName);
    //User Interface Settings
    if(FN.FloatyNav && (!document.getElementById("tabnav") || !document.querySelector("nav.fixed"))){
        FloatNavigation();
    };
    if(FN.FriendsInNav == true && !document.getElementById("FriendLink") && user_id){
        FriendsInNav();
    };
    if(FN.MentionLinks && !/\/settings\//i.test(location.href)){
        MentionLinks();
    };
    if(FN.AddFormatButtons){
        RunFormatButtons(document.querySelector("textarea#wall_post_body")); // Wall Post
        RunFormatButtons(document.querySelector("div.input-group > textarea.form-control")); // Picture Comment and New Message and Message Reply
    };
    if(FN.QuickEditAboutMe && window.location.href.match("/users/" + user_id) && document.querySelector("a[href='/settings/profile/about']")){
        QEAboutMe(FN.AddFormatButtons, boobs);
    };
    if(FN.ArchiveDeleteInbox && location.href.match(".com/inbox")){
        MassArchiveDeleteMessages();
    };
    if(FN.QuickReply){
        QuickReply(boobs, FN.AddFormatButtons);
    };
    if(FN.NotificationBox && user_id){
        NotificationBox(FN.FloatyNav);
    };
    //Event Settings
    if(FN.FavoriteLocations && location.href.match("/events/near$")){
        SavedLocations();
    };
    if(FN.MassMessage && Location.match(/(\d+)\/(rsvps|rsvps\/maybe)/i) && !Location.match(/\?page=\d+/i)){
        MassMessageEvent(boobs);
    };
    if(FN.ExportToCSV && location.href.match(/(\d+)\/(rsvps|rsvps\/maybe)/i) && !location.href.match(/\?page=\d+/i)){
		ExportToCSV(boobs);
	};
    if(FN.AddToGoogleCalendar && location.href.match("/events/([0-9]+)$")){
        GoogleCalendar();
    };
    //Gallery Settings
    if(FN.MultiImageUpload && location.href.match("/pictures/new")){
        MultiImageUpload();
    };
    if(FN.BulkDeletePhotos && location.href.match("/users/" + user_id + "/pictures")){
        BulkDeletePhotos();
    };
    if(FN.SaveYourPics && location.href.match(user_id + "/pictures/[0-9]+$")){
		SaveYourPics();
	};
    //Miscelaneous
    if(FN.MassMessageFriends){
        MassMessageFriends(boobs, true); //second value fixes a bug if SearchFriends is active "SearchBreakUnfriendFix"
    };
    if(FN.PrettyTextareas){
        let NewStyles = document.createElement("style");
        document.head.appendChild(NewStyles);
        NewStyles.sheet.insertRule("textarea.text, textarea.asuka_src, textarea.expand_on_show, textarea#video_description, textarea#picture_caption, input[type='text'] {background-color: #303030 !important; color: #ccc !important; border-color: #555; }");
        NewStyles.sheet.insertRule("textarea.text:focus, textarea.asuka_src:focus, textarea.expand_on_show:focus, textarea#video_description:focus, textarea#picture_caption:focus, input[type='text']:focus {border-color: #444; }");
    };
};
function SaveSettings(){
    var CheckValue = new Array();
    const checkboxes = document.querySelectorAll("input.FLE-Checkboxes[type='checkbox']");
    /*
    for(let item of checkboxes){
        if(item.checked){
            GM.setValue(item.getAttribute("name"), true);
        }else if(!item.checked){
            GM.deleteValue(item.getAttribute("name"));
        };
    };
    */
    for(let item of checkboxes){
        if(item.checked){
            CheckValue.push(item.getAttribute("name"));
        };
    };
    SetSync("CheckboxName", CheckValue);
    let CSVFields = new Array();
    for(let item of document.querySelectorAll(".CSVField")){
        if(item){
            var CSVCheck = item.querySelector("[name=CSVField1]").checked;
            var CSVName = item.querySelector("[name=CSVField2]").value;
            if(CSVName.split(" ").join("") !== ""){
                CSVFields.push([CSVCheck, CSVName]);
                //GM.setValue("CSVFields", JSON.stringify(CSVFields));
                SetSync("CSVFields", CSVFields);
            };
        };
    };
    //If SearchFriends is turned off, delete all needed values.
    if(document.querySelector("input.FLE-Checkboxes[name='SearchFriends']").checked === false){
        //GM.deleteValue("SearchedFriends");
        //GM.DeleteValue("SearchFriendsListNumber");
        DeleteSync("SearchedFriends");
        DeleteSync("SearchFriendsListNumber");
    };
};
const isExtension = (typeof GM === "undefined") ? true : false;
// Gets requested item value
const GetSync = new Promise(async function(resolve, reject){
    if(isExtension){
        chrome.storage.sync.get(null, resolve);
    }else{
        let rawr = {};
        for(let key of await GM.listValues()){
            rawr[key] = JSON.parse(await GM.getValue(key));
        };
        resolve(rawr);
    };
});
// Set an items value
const SetSync = async function(item, value){
    if(isExtension){
        chrome.storage.sync.set({[item]: value});
    }else{
        await GM.setValue(item, JSON.stringify(value));
    };
};
// Delete Single Value in FetLifeEnhancer
const DeleteSync = async function(item){
    if(isExtension){
        chrome.storage.sync.remove(item);
    }else{
        await GM.deleteValue(item);
    };
};
// Delete All values in FetlifeEnhancer
const ClearSync = async function(){
    if(isExtension){
        chrome.storage.sync.clear();
    }else{
        for(let key of await GM.listValues()){
            DeleteSync(key);
        };
    };
}
function getTypes(selectedItem){
	let dataTypes = {};
	for(let items of selectedItem){
		dataTypes[items] = true;
    };
    return dataTypes;
};
var main_url = "https://fetlife.com";
var Location = window.location.href.split(".com")[1].split("?")[0];
var LoadingInsides = "<center><img src='https://ass1.fetlife.com/std/spinners/circle_big.gif' /></center>";
var LoadingContainer = function(CreateNew){
	if(!document.getElementById("LoadingCSS")){
		let LoadingCSS = document.createElement("style");
		LoadingCSS.id = "LoadingCSS";
		//LoadingCSS.href = chrome.runtime.getURL("css/Main.css");
        document.head.appendChild(LoadingCSS);
        LoadingCSS.sheet.insertRule("@-webkit-keyframes bounce { 0%, 80%, 100% { -webkit-transform: scale(0); transform: scale(0); } 40% { -webkit-transform:scale(0.9); transform: scale(0.9); } }");
        LoadingCSS.sheet.insertRule("@keyframes bounce { 0%, 80%, 100% { -webkit-transform: scale(0); transform: scale(0); } 40% { -webkit-transform: scale(0.9); transform: scale(0.9); } }");
        LoadingCSS.sheet.insertRule(".L-Spinner { width:70px; margin:0 auto; text-align: center; }");
        LoadingCSS.sheet.insertRule(".L-Spinner div { display: inline-block; width: 18px; height: 18px; background-color:#424242; border-radius: 100%; /*! -webkit-animation:bounce 1.4s infinite ease-in-out both; */ animation: bounce 1.4s infinite ease-in-out both; }");
        LoadingCSS.sheet.insertRule(".L-Spinner .L-Bounce1 { -webkit-animation-delay: -.32s; animation-delay: -.32s; }");
        LoadingCSS.sheet.insertRule(".L-Spinner .L-Bounce2 { -webkit-animation-delay: -.16s; animation-delay: -.16s; }");
	};
	if(CreateNew){
		let LoadingDIV = document.createElement("div");
		LoadingDIV.id = "LoadingContainer";
		LoadingDIV.innerHTML = "<div class='L-Center' style='margin: 5px auto 5px auto;'><div class='L-Spinner'><div class='L-Bounce1'></div><div class='L-Bounce2'></div><div class='L-Bounce3'></div></div></div>";
		return LoadingDIV;
	};
	return "<div id='LoadingContainer'><div class='L-Center' style='margin: 5px auto 5px auto;'><div class='L-Spinner'><div class='L-Bounce1'></div><div class='L-Bounce2'></div><div class='L-Bounce3'></div></div></div></div>";
};
var ExtraLocations = false;
var Linkz = document.links;
window.MobileCheck = function(){
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

for(a of Linkz){
    if(a.className === "flex flex-none dib ml2-ns ml1 mr3-ns mr2 pr2-l fw4 gray hover-gray-200 link"){
		var user_id = a.href.split("users/")[1].split("?")[0];
		var user_name = a.innerText;
		var navNickname = true;
    }else if(a.className === "flex flex-none dib ml2-ns ml1 mr3-ns mr2 pr2-l fw4 gray hover-light-silver link"){
		var user_id = a.href.split("users/")[1].split("?")[0];
		var user_name = a.innerText;
		var navNickname = false;
    }else if(a.className === "fl-nav__nickname"){
		var user_id = a.href.split("users/")[1].split("?")[0];
		var user_name = a.innerText;
		var navNickname = true;
	}
};
GetSync.then(FLESettings, onError);
//=======================================================
//
// End Load/Save Functions for FLE
//
//=======================================================