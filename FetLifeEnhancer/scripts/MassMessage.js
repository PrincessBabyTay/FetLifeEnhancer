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
						if(ExcludeUser.indexOf(UserLower) == -1){
							AllUsers[AllUsers.length] = [UserID, Username];
						};
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
					if(ExcludeUser.indexOf(UserLower) == -1){
						AllUsers[AllUsers.length] = [UserID, Username];
					};
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
		if((q[g].title === "moderation" || q[g].className === "moderate_button") && q[g].innerHTML.match("moderate") || (item.DebugFLE && item.DebugFLE == true)){
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
		if(item.ExcludeMassMessage && item.ExcludeMassMessage !== ""){
			let getExcluded = item.ExcludeMassMessage;
			getExcluded = getExcluded.toLowerCase();
			getExcluded = getExcluded.replace(/\s+/g, "");
			let getExcludedSplit = getExcluded.split(",");
			for(let x in getExcludedSplit){
				ExcludeUser[ExcludeUser.length] = getExcludedSplit[x];
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
	function PlaceMassMessageLink(){
		if(location.href.match(/(\d+)\/friends/i)){
			let pics = document.getElementsByTagName("div");
			let card = document.getElementsByClassName("w-50-m w-100 ph1");
			for(let aa of card){
				let click_event_element = aa.getElementsByClassName("w-100 br1 pointer bg-animate hover-bg-gray-950 bg-gray-900")[0]
				let click_event = click_event_element.getAttribute("onclick");
				aa.querySelector("div.lh-copy.gray-300.nowrap.truncate").setAttribute("onclick", click_event);
				click_event_element.removeAttribute("onclick");
				if(SearchBreakUnfriendFix) aa.innerHTML = aa.innerHTML;
			};
			for(let a of pics){
				if(a.className == "f6 fw4 lh-copy gray-500 nowrap truncate" && !a.querySelector("a[name='MassMessageLink']")){
					let a_new = document.createElement("a");
					a_new.name = "MassMessageLink";
					a_new.setAttribute("mass-message", "false");
					a_new.setAttribute("mass-message-user", a.parentNode.parentNode.querySelector("a.link.f5.fw7.secondary").innerHTML);
					a_new.className = "mid-gray hover-silver link underline";
					a_new.style.float = "right";
					a_new.innerHTML = "add to mass message";
					a.append(a_new);
					//a.parentNode.innerHTML += "<a name='MassMessageLink' mass-message='false' mass-message-user='" + a.parentNode.parentNode.getElementsByClassName("link span f5 fw7 secondary")[0].innerHTML + "' href='javascript:void(0);' class='mid-gray hover-silver link underline' style='float: right;'>add to mass message</a>";
					// if(SearchBreakUnfriendFix === true){
					// 	a.href = "javascript:void(0);";
					// 	a.addEventListener("click", function(){
					// 		let Username = this.parentNode.parentNode.getElementsByClassName("link span f5 fw7 secondary")[0];
					// 		document.querySelector("div[data-id='unfriend-" + Username.href.split("/users/")[1] + "']").className = "fixed top-0 right-0 bottom-0 left-0 z-9999 pa3 bg-black-80 tc overflow-auto fade-in";
					// 	});
					// };
				};
			};
			for(let a of document.querySelectorAll("a[name='MassMessageLink']")){
				a.addEventListener("click", MassMessageFriend_A);
			};
		};
	};
	function LoadList(){
		if(boobs.MassMessageFriendsList){
			for(let a of boobs.MassMessageFriendsList){
				MassFriends.push([a[0],a[1]]);
			};
			document.getElementById("MassFriendsNumber").innerHTML = boobs.MassMessageFriendsList.length;
			for(let c of boobs.MassMessageFriendsList){
				if(location.href.match("MassMessageFriends")){
					document.getElementById("MassFriendsNumber").className = "dib ph1 ml2 f7 fw4 br1 text bg-gray-500 theme-gray-950";
				}else{
					document.getElementById("MassFriendsNumber").className = "dib ph1 ml2 f7 fw4 br1 gray-300 bg-gray-700";
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
			let parent_a = this.parentNode.parentNode.getElementsByClassName("link f5 fw7 secondary mr1")[0];
			let Username = parent_a.innerHTML;
			let ID = parent_a.href.split("/users/")[1];
			this.innerHTML = "remove from mass message";
			this.setAttribute("mass-message","true");
			MassFriends.push([ID, Username]);
			document.getElementById("MassFriendsNumber").innerHTML = MassFriends.length;
			document.getElementById("MassFriendsNumber").className = "dib ph1 ml2 f7 fw4 silver br1 bg-dark-gray";
		}else if(this.getAttribute("mass-message") == "true"){
			let parent_a = this.parentNode.parentNode.getElementsByClassName("link f5 fw7 secondary mr1")[0];
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
		let RemoveActiveTab = document.getElementsByClassName("dib link f6 lh-title bg-gray-850 br1 br--top text bt b-red-600 theme-b-red-500 bw1")[0];
		RemoveActiveTab.className = "dib link f6 lh-title gray hover-gray-300";
		RemoveActiveTab.firstChild.className = "pv2 ph3 br bl b-transparent";
		RemoveActiveTab.getElementsByTagName("span")[0].className = "dib ph1 ml2 f7 fw4 br1 gray-300 bg-gray-700";
		let z = document.querySelector("#TABLE_ID_YO");
		z.className = "dib link f6 lh-title bg-gray-850 br1 br--top text bt b-red-600 theme-b-red-500 bw1";
		z.firstChild.className = "pv2 ph3 br bl b-gray-800";
		if(MassFriends.length > 0){
			document.getElementById("MassFriendsNumber").innerHTML = MassFriends.length;
			document.getElementById("MassFriendsNumber").className = "dib ph1 ml2 f7 fw4 br1 text bg-gray-500 theme-gray-950";
		}else{
			document.getElementById("MassFriendsNumber").innerHTML = "";
			document.getElementById("MassFriendsNumber").removeAttribute("class");
		};
		let x = boobs.MassMessageFriendsList;
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
	table_link.className = "dib link f6 lh-title gray hover-gray-300";
	table_link.innerHTML = "<div class='pv2 ph3 br bl b-transparent'><div class='pv1'>Mass Message<span id='MassFriendsNumber'></span></div></div>"
	if(!document.getElementById("TABLE_ID_YO") && location.href.match("/users/" + user_id + "/friends")){
		tablelist.appendChild(table_link);
	};
	table_link.addEventListener("click", function(){
		window.location.href = main_url + "/users/" + user_id + "/friends?MassMessageFriends";
	});
	document.addEventListener("scroll", PlaceMassMessageLink);

	if(location.href.match("MassMessageFriends")){
		StartMassMessageFriends(Format);
	};
	PlaceMassMessageLink();
	LoadList();
};

function CustomFriendsList(){
	if(location.href.match(/(\d+)\/friends/i)){
		let unfriend = document.getElementsByTagName("a");
		let b = document.createElement("a");
		b.name = "AddToList";
		b.className = "relative z-5 w105 w217-l pv1 ph2 f6 lh-copy moon-gray bg-dark-gray bn br0 ph-dark input-reset";
		b.innerHTML = "+list";
		for(let a of unfriend){
			if(a.innerHTML === "unfriend"){
				a.parentNode.append(b);
			};
		};
		for(let a of document.querySelectorAll("a[name='AddToList']")){
			//a.addEventListener("click", ShowLists);
		};
	};
};

if(Location.match(/(\d+)\/(rsvps|rsvps\/maybe)/i) && !Location.match(/\?page=\d+/i)){
	GetSync.then(MassMessageEvent, onError);
};
if(location.href.match(/(\d+)\/(friends|following|followers)/i) && location.href.match("users/" + user_id)){
	GetSync.then(function(a){
		/*
		CustomFriendsList(a);
		if(getTypes(a.CheckboxName).CustomFriendsList && location.href.match("users/" + user_id + "/friends")){
			CustomFriendsList(a);
		};
		*/
		if(getTypes(a.CheckboxName).MassMessageFriends){
			MassMessageFriends(a, true); //Second value fixes a bug if SearchFriends is active "SearchBreakUnfriendFix"
		};
	}, onError);
};