function UI(boobs){
    let FN = getTypes(boobs.CheckboxName);
	if(FN.FloatyNav && (!document.getElementById("tabnav") || !document.querySelector("nav.fixed"))){
        FloatNavigation();
    };
    if(FN.NotificationBox && user_id){
        NotificationBox(FN.FloatyNav);
    };
    if(FN.AddToGoogleCalendar && location.href.match("/events/([0-9]+)$")){
        GoogleCalendar();
    };
    if(FN.QuickEditAboutMe && !/\/settings\//i.test(location.href)){
        QEAboutMe(FN.AddFormatButtons, boobs);
    };
    if(FN.AddFormatButtons){
        RunFormatButtons(document.querySelector("textarea#wall_post_body")); // Wall Post
        RunFormatButtons(document.querySelector("div.input-group > textarea.form-control")); // Picture Comment and New Message and Message Reply
    };
    if(FN.MentionLinks && !/\/settings\//i.test(location.href)){
        MentionLinks();
    };
    if(FN.FriendsInNav && !document.getElementById("FriendLink") && user_id){
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
    if(FN.QuickReply){
        QuickReply(boobs, FN.AddFormatButtons);
    };
    if(FN.ArchiveDeleteInbox && location.href.match(".com/inbox")){
        MassArchiveDeleteMessages();
    };
    if(FN.PrettyTextareas && !/\/events\/near$/i.test(location.href)){
        let NewStyles = document.createElement("style");
        //NewStyles.rel = "stylesheet";
        //NewStyles.href = chrome.runtime.getURL("css/Textareas.css");
        document.head.appendChild(NewStyles);
        NewStyles.sheet.insertRule("textarea.text, textarea.asuka_src, textarea.expand_on_show, textarea#video_description, textarea#picture_caption, input[type='text']:not(.input-group) {background-color: #303030 !important; color: #ccc !important; border-color: #555; }");
        NewStyles.sheet.insertRule("textarea.text:focus, textarea.asuka_src:focus, textarea.expand_on_show:focus, textarea#video_description:focus, textarea#picture_caption:focus, input[type='text']:focus {border-color: #444; }");
    };
};

function FloatNavigation(){
    let nav = document.getElementsByTagName("nav")[0];
    if(document.getElementById("maincontent")) document.getElementById("maincontent").style.paddingTop = "68px";
    nav.style.position = "fixed";
    nav.style.width = "100%";
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
                            textarea.value = textarea.value.substring(0, start) + "[" +  Name + "](" + Link + ")" + textarea.value.substring(finish, textarea.value.length);
                            textarea.selectionEnd = finish + +(("[](" + Link + ")").length);
                        }else if(start || start == "0"){
                            textarea.value = textarea.value.substring(0, start) + "[" +  Name + "](" + Link + ")" + textarea.value.substring(finish, textarea.value.length);
                            textarea.selectionEnd = finish + +(("[" +  Name + "](" + Link + ")").length);
                        }else{
                            textarea.value += "[" +  Name + "](" + Link + ")\n";
                            textarea.selectionEnd = finish + +(("[" +  Name + "](" + Link + ")").length);
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
                NewSel = "";
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
                textarea.value +=  StartText + "TEXT" + ((EndText) ? EndText : "");
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
        if(location.href.match("/conversations/(.*)|QuickReplySettings|/groups/")){
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
        for(x of document.querySelectorAll("div.FormatButtons")){
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
        
        //Remove All addEventListener functions from textarea.
        //added format buttons no longer work for some odd reason, but form still submits.
        //textarea.parentElement.innerHTML = textarea.parentElement.innerHTML;
    };
};

function QEAboutMe(Format, Karen){
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
                document.getElementById("QEAM").innerHTML = "<fieldset><textarea class='text' id='AboutMeInfo' style='background: #333; color: #ccc; width: 100%;'>" + OldAboutMe + "</textarea><a href='javascript:void(0);' id='SaveAboutMeInfo' style='background-color: #a00; font-size: 1.2em; padding: 5px 15px; margin-top: 7px; text-decoration: none; float: right;'>Update</a></fieldset>";
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
        let c = "<a href='javascript:void(0);' name='QuickEditABoutMe'>quick edit</a>";
        let d = a.href;
        a.parentNode.innerHTML = "(" + b + " / " + c + ")";
        document.querySelector("a[name='QuickEditABoutMe']").addEventListener("click",function(){
            let bio = this.parentElement.parentElement;
            if(!document.getElementById("QEAM")){
                let QEAM = document.createElement("div");
                QEAM.id = "QEAM";
                QEAM.innerHTML = LoadingContainer();
                bio.after(QEAM);
                SetupAboutMe(d);
            };
        });
        for(let a of Karen.Locations){
            if(a[1] === "DEBUG.Mode = On" && (user_id === "3367935" || user_id === "9780960")){
                let FLEDebug = document.createElement("a");
                FLEDebug.className = "fl-badge FLE-Debug";
                FLEDebug.href = "javascript:void(0);";
                FLEDebug.innerHTML = "Turn Debug " + (Karen.DebugFLE == true ? "Off" : "On");
                let badge_area = document.getElementById("maincontent").getElementsByClassName("span-4 last")[0];
                badge_area.getElementsByTagName("div")[2] ? badge_area.getElementsByTagName("div")[2].after(FLEDebug) : badge_area.appendChild(FLEDebug);
                document.querySelector(".FLE-Debug").addEventListener("click", function(){
                    if(!Karen.DebugFLE){
                        SetSync("DebugFLE", true);
                        document.body.style.border = "3px solid red";
                        this.innerHTML = "Turn Debug Off";
                    }else{
                        DeleteSync("DebugFLE");
                        document.body.style.border = "";
                        this.innerHTML = "Turn Debug On";
                    };
                });
            };
        };
    };
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

function MassArchiveDeleteMessages(){
    function PlaceCheckbox(){
        let AllMessages = document.getElementsByClassName("relative flex items-center w-100 pa3 hover-bg-gray-800 bg-animate pointer bb b-gray-800 hover-show bg-transparent")
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

GetSync.then(UI, onError);