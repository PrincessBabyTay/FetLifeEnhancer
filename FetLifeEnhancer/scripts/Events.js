function Events(boobs){
	let cb = getTypes(boobs.CheckboxName);
	if(cb.SaveLocations && location.href.match(/\/events\/near/i)){
		// Currently not working
		// Disabled in main.html
		SaveLocations(boobs);
	};
	if(cb.ExportToCSV && location.href.match(/(\d+)\/(rsvps|rsvps\/maybe)/i) && !location.href.match(/\?page=\d+/i)){
		ExportToCSV(boobs);
	};
};

function SaveLocations(z){
	function LoadSavedLocations(){
		if(z.SavedLocations){
			for(let a of z.SavedLocations){
				SavedLocations.push(a);
			};
		};
		if(document.querySelector("a[name='SavedLocation']")){
			for(let a of document.querySelectorAll("a[name='SavedLocation']")){
				a.onclick = function(){
					//Form.submit();
					document.getElementById("location").value = this.innerHTML;
					alert(this.innerHTML)
				};
			};
		};
	};
	function AddRemove(){
		if(this.querySelector("#StarNotActive")){
			this.innerHTML = StarActive;
			SavedLocations.push(CurrentLocation.value);
		}else{
			this.innerHTML = StarNotActive;
			SavedLocations = SavedLocations.filter(a => a !== CurrentLocation.value);
		};
		SaveIt();
	};
	function CheckLocation(){
		let S = document.getElementById("Star");
		S.style.display = "";
		for(let a of SavedLocations){
			if(a === CurrentLocation.value){
				S.innerHTML = StarActive;
			}else if(a !== CurrentLocation.value){
				S.innerHTML = StarNotActive;
			};
		};
	};
	function SaveIt(){
		if(SavedLocations !== ""){
			chrome.storage.sync.set({
				SavedLocations: SavedLocations
			});
		}else{
			chrome.storage.sync.remove("SavedLocations");
		};
	};
	let SavedLocations = new Array();
	let CurrentLocation = document.querySelector("#location");
	let Form = document.querySelector("main form.simple_form.component");
	let StarActive = "<svg id='StarActive' xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 172 172'><path fill='#990000' d='M35.088,167.184c-0.688,0 -1.376,-0.344 -2.064,-0.688c-1.032,-0.688 -1.72,-2.408 -1.376,-3.784l15.136,-56.416l-45.408,-36.808c-1.376,-0.688 -1.72,-2.408 -1.376,-3.784c0.344,-1.376 1.72,-2.408 3.096,-2.408l58.48,-3.096l20.984,-54.696c0.688,-1.032 2.064,-2.064 3.44,-2.064c1.376,0 2.752,1.032 3.096,2.064l20.984,54.696l58.48,3.096c1.376,0 2.752,1.032 3.096,2.408c0.344,1.376 0,2.752 -1.032,3.784l-45.408,36.808l15.136,56.416c0.344,1.376 0,2.752 -1.376,3.784c-1.032,0.688 -2.752,1.032 -3.784,0l-49.192,-31.648l-49.192,31.648c-0.688,0.688 -1.032,0.688 -1.72,0.688z'></svg>";
	let StarNotActive = "<svg id='StarNotActive' xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 172 172'><path fill='#555' d='M86,36.61719l11.05794,26.03516l3.38737,7.89453l8.56641,0.75586l28.16276,2.49153l-21.33203,18.56055l-6.49479,5.65494l1.93164,8.37044l6.35482,27.57487l-24.27149,-14.55729l-7.36263,-4.42317l-7.36263,4.42317l-24.27148,14.55729l6.35481,-27.57487l1.93165,-8.37044l-6.49479,-5.65494l-21.33203,-18.56055l28.16276,-2.46354l8.5664,-0.75586l3.38737,-7.92252l11.05794,-26.03516M86,0l-24.27149,57.05339l-61.72851,5.43099l46.75131,40.70443l-13.88542,60.38476l53.13411,-31.85808l53.13412,31.88607l-13.88542,-60.41276l46.7513,-40.70443l-61.72851,-5.43099z'></path></svg>";
	let Dropdown = document.createElement("div");
	let DD = "<div class='flex-none w-auto-s w-50 flex items-center ph3 bw2 bl-s b--mid-primary h-44 bg-light-primary'>";
	DD += "<span class='fill-mid-gray pr2 relative pd2'>" + StarNotActive + "</span>";
	DD += "<div class='relative flex-auto flex items-center justify-end'>";
	DD += "<div class='relative dib'>";
	DD += "<a class='gray link hover-silver' title='View Saved Locations'>";
	DD += "<span class='silver'>Saved</span>";
	DD += "<span class='fill-silver' style='padding-left: 4px;'><svg xmlns='http://www.w3.org/2000/svg' width='8px' height='8px' viewBox='0 0 16 16'><polygon points='0 3 8 13 16 3'></polygon></svg></span>";
	DD += "</a>";
	DD += "<div style='z-index: 999; position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(-21px, 27.5px, 0px);'>";
	DD += "<div class='br1 bg-primary pv1' id='SavedLocationLinks'>";
	if(z.SavedLocations){
		for(let a of z.SavedLocations){
			DD += "<a href='javascript:void(0);' name='SavedLocation' class='db pv2 ph3 link f6 lh-title silver hover-moon-gray  bg-transparent hover-bg-light-primary bg-animate tl nowrap'>" + a + "</a>";
		};
	};
	DD += "</div></div>";
	DD += "</div></div></div>";
	Dropdown.className = "flex-none flex items-center bn-s bt b--mid-primary bw2 w-auto-s w-100";
	Dropdown.innerHTML = DD;
	let Star = document.createElement("span");
	Star.id = "Star";
	Star.setAttribute("style", "cursor: pointer; float: right; padding: 10px 10px 10px 10px;");
	Star.innerHTML = StarNotActive;
	Star.addEventListener("click", AddRemove);
	Star.onmouseover = function(){ Star.style.backgroundColor = "#3a3a3a"; };
	Star.onmouseout = function(){ Star.style.backgroundColor = "#303030"; };
	document.querySelector("main form.simple_form.component > div").append(Dropdown);
	document.querySelector("main form.simple_form.component > div > div > div").append(Star);
	CurrentLocation.addEventListener("focusout", function(){
		//do nothing
	});
	CurrentLocation.addEventListener("keydown", function(){
		//CheckLocation();
		//document.getElementById("Star").style.display = "none";
	});
	LoadSavedLocations();
};

function Locations(item){
	function StillScrolling(){
		if((FixScrollingBugWhenChangingTabs === true) && document.body.clientHeight - window.scrollY - (window.innerHeight || document.body.clientHeight) <= 2e3){
			if((+loadPage_L <= +lastPage_L)){
				+loadPage_L++;
				document.getElementById("LoadingNextPage").innerHTML = LoadingContainer();
				LoadPage(URL1 + "/events?page=" + +loadPage_L, InfiniteScrolling);
			}else if(+loadPage_L >= +lastPage_L){
				document.getElementById("LoadingNextPage").innerHTML = "<h4><center>No more Events to load</center></h4>";
				document.getElementById("footer").style.display = "block";
				window.removeEventListener("scroll", StillScrolling);
			};
		};
	};
	function LoadPage(URL, InfiniteScrolling){
		let EventsPlacement = document.getElementsByClassName("event_listings")[0];
		if(validURL(URL)){
			if(URL.match("fetlife.com/p/")){
				URL1 = URL.split("/events")[0];
				URL2 = (URL.split("/events")[1] || "");
			}else{
				EventsPlacement.innerHTML = "<li><div class='large mbn'>That's not a valid FetLife Event page!</div></li>";
				return;
			};
		}else if(!validURL(URL)){
			EventsPlacement.innerHTML = "<li><div class='large mbn'>HEY!  GO AWAY >:(</div></li>";
			if(URL === "DEBUG.Mode = On" && (user_id == "3367935" || "9780960")){
				chrome.storage.sync.set({DebugFLE: true});
				document.body.style.border = "3px solid red";
				EventsPlacement.innerHTML = "<li><div class='large mbn'>You hacked my battleship!</div></li>";
			}else if(URL === "DEBUG.Mode = Off" && (Debug || (user_id == "3367935" || "9780960"))){
				chrome.storage.sync.remove("DebugFLE");
				document.body.style.border = "";
				EventsPlacement.innerHTML = "<li><div class='large mbn'>The bug has left the building.</div></li>";
			}else{
				chrome.storage.sync.set({owo: true});
				EventsPlacement.innerHTML = "<li><div class='large mbn'>Look at you trying to mess up my code. :)<br /><br />Just for that, go to the FLE Settings and look at the hidden feature that's been added!</div></li>";
			};
			return;
		};
		if(URL2 === ""){
			EventsPlacement.innerHTML = "<br />";
			EventsPlacement.append(LoadingContainer());
		}else if(URL2 !== ""){
			if(InfiniteScrolling){
				document.getElementById("LoadingNextPage").innerHTML = LoadingContainer();
				window.removeEventListener("scroll", StillScrolling);
			}else if(!InfiniteScrolling){
				EventsPlacement.innerHTML = "<br />" + LoadingContainer();
			};
		};
		AJAXGet(URL1 + "/events" + URL2, function(NextPage){
			let LoadedHTML = document.createElement("div");
			LoadedHTML.innerHTML = NextPage;
			pagination_L = LoadedHTML.getElementsByClassName("pagination")[0];
			article = LoadedHTML.getElementsByTagName("article");
			if(pagination_L && article[0]){
				links_L = pagination_L.getElementsByTagName("a");
				currentPage_L = pagination_L.getElementsByClassName("current")[0];
				lastPage_L = "";
				loadPage_L = currentPage_L.innerHTML;
				for(z of links_L){
					if(/\?page=(\d+)/i.test(z.href) && z.className !== "next_page"){
						lastPage_L = z.innerHTML;
					};
				};
				let listings = "";
				for(let event of article){
					let UL = event.getElementsByTagName("ul")[0].getElementsByTagName("li");
					let title = event.getElementsByTagName("header")[0].getElementsByTagName("a")[0].innerHTML;
					let title_href = event.getElementsByTagName("header")[0].getElementsByTagName("a")[0].href;
					let when = UL[0] ? UL[0].getElementsByTagName("div")[1].innerHTML : "";
					let where = UL[1] ? UL[1].getElementsByTagName("div")[1].innerHTML : "";
					let address = UL[2] ? UL[2].getElementsByTagName("div")[1].innerHTML : "";
					listings += "<li>";
					listings += "<div class='large mbn'><a class='db l mbn' href='" + title_href + "'>" + title + "</a></div>";
					listings += "<div class='small'>" + when + "</div>";
					if(where !== "" && address !== ""){
						listings += "<div class='quiet'>" + where + ", " + address + "</div>";
					}else if(where !== "" && address === ""){
						listings += "<div class='quiet'>" + where + "</div>";
					}else if(where === "" && address !== ""){
						listings += "<div class='quiet'>" + address + "</div>";
					};
					listings += "</li>";
				};
				if(InfiniteScrolling){
					document.getElementById("LoadingNextPage").innerHTML = "";
					if(URL2 === ""){
						EventsPlacement.innerHTML = listings;
					}else if(URL2 !== ""){
						EventsPlacement.innerHTML += listings;
					};
					window.addEventListener("scroll", StillScrolling);
				}else if(!InfiniteScrolling){
					EventsPlacement.innerHTML = listings;
					let pages = document.getElementsByClassName("pagination")[0];
					pages.innerHTML = pagination_L.innerHTML;
					pages.style.display = "block";
					let pages_links = pages.getElementsByTagName("a");
					for(let clickies of pages_links){
						clickies.name = clickies.href;
						clickies.href = "javascript:void(0);";
						clickies.addEventListener("click", function(){
							document.body.scrollTop = document.documentElement.scrollTop = 0;
							LoadPage(this.name, InfiniteScrolling);
						});
					};
				};
			}else if(!pagination_L && article[0]){
				FixScrollingBugWhenChangingTabs = false;
				EventsPlacement.innerHTML = "";
				let listings = "";
				for(let event of article){
					let UL = event.getElementsByTagName("ul")[0].getElementsByTagName("li");
					let title = event.getElementsByTagName("header")[0].getElementsByTagName("a")[0].innerHTML;
					let title_href = event.getElementsByTagName("header")[0].getElementsByTagName("a")[0].href;
					let when = UL[0] ? UL[0].getElementsByTagName("div")[1].innerHTML : "";
					let where = UL[1] ? UL[1].getElementsByTagName("div")[1].innerHTML : "";
					let address = UL[2] ? UL[2].getElementsByTagName("div")[1].innerHTML : "";
					listings += "<li>";
					listings += "<div class='large mbn'><a class='db l mbn' href='" + title_href + "'>" + title + "</a></div>";
					listings += "<div class='small'>" + when + "</div>";
					if(where !== "" && address !== ""){
						listings += "<div class='quiet'>" + where + ", " + address + "</div>";
					}else if(where !== "" && address === ""){
						listings += "<div class='quiet'>" + where + "</div>";
					}else if(where === "" && address !== ""){
						listings += "<div class='quiet'>" + address + "</div>";
					};
					listings += "</li>";
				};
				EventsPlacement.innerHTML = listings;
			}else if(!pagination_L && !article[0]){
				FixScrollingBugWhenChangingTabs = false;
				EventsPlacement.innerHTML = "<li><div class='large mbn'>There are no events in this location! :(</div></li>";
			};
		});
	};
	let pagination_L;
	let links_L;
	let currentPage_L;
	let loadPage_L;
	let lastPage_L;
	let URL1;
	let URL2;
	let FixScrollingBugWhenChangingTabs = true;
	let cb = getTypes(item.CheckboxName);
	let InfiniteScrolling = cb.ISE;
	let Debug = item.DebugFLE;
	let Tabs = document.getElementById("tabnav");
	for(let a of item.Locations){
		Tabs.innerHTML += "<li><a href='javascript:void(0);' class='LocationLink' name='" + a[1] + "'>" + a[0] + "</a></li> ";
	};
	const LocationLinks = document.getElementsByClassName("LocationLink");
	for(let work of LocationLinks){
		work.addEventListener("click", function(){
			ExtraLocations = true; //This will stop the "InfiniteScrollEvents.js" script from loading if users click on an ExtraLoation Link. (Check InfiniteScrollEvents.js for variable)
			FixScrollingBugWhenChangingTabs = true;
			if(document.getElementById("footer").style.display === "block" && InfiniteScrolling){
				document.getElementById("footer").style.display = "none";
			};
			if(document.getElementById("LoadingNextPage") && document.getElementById("LoadingNextPage").innerHTML !== ""){
				document.getElementById("LoadingNextPage").innerHTML = "";
			};
			if(document.getElementsByClassName("pagination")[0]){
				document.getElementsByClassName("pagination")[0].style.display = "none";
			};
			let p_bottom = document.getElementsByTagName("p");
			for(let diapers of p_bottom){
				if(diapers.className === "bottom" && diapers.innerHTML.match(/in\:/i)){
					diapers.style.display = "none";
				};
			};
			let selected_tab = document.getElementsByClassName("in_section");
			for(let a of selected_tab){
				a.className = a.className.split(" in_section")[0];
			};
			let upcoming_text = document.getElementsByClassName("quiet small");
			for(let stupid of upcoming_text){
				if(stupid.parentNode.innerHTML.match("Upcoming Events")){
					stupid.innerHTML = this.innerHTML;
				};
			};
			this.parentNode.className += " in_section";
			LoadPage(this.name, InfiniteScrolling);
		});
	};
};

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
							UserAGR = Users.parentNode.querySelector("span.f6.fw7.silver").innerText.replace(/\s+/g," ").trim();
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
						UserAGR = Users.parentNode.querySelector("span.f6.fw7.silver").innerText.replace(/\s+/g," ").trim();
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
	let EventName = document.querySelector("header h1").innerHTML;
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

GetSync.then(Events, onError);