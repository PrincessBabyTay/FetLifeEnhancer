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
const Squishy = "DEBUG.Mode = On";
var main_url = "https://fetlife.com";
var Location = window.location.href.split(".com")[1].split("?")[0];
var LoadingInsides = "<center><img src='https://ass1.fetlife.com/std/spinners/circle_big.gif' /></center>";
var LoadingContainer = function(CreateNew){
	if(!document.getElementById("LoadingCSS")){
		let LoadingCSS = document.createElement("link");
		LoadingCSS.rel = "stylesheet";
		LoadingCSS.id = "LoadingCSS";
		LoadingCSS.href = chrome.runtime.getURL("css/Main.css");
		document.head.appendChild(LoadingCSS);
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
    if(a.className === "flex flex-none ml2-ns ml1 mr3-ns mr2 pr2-l fw4 gray-400 hover-gray-200 link"){
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
GetSync.then(LoadOtherSettings, onError);

function Konami(code){
	var The = "", konami = code;
	window.document.onkeydown = function(e){
		The += e ? e.keyCode : event.keyCode;
		if(The == konami.split(",").join("")){
			window.document.addEventListener("click", Unicorns);
			window.document.addEventListener("keydown", Unicorns);
		};
	};
};
function Unicorns(){
	var Images = new Array(), n = 0;
	Images[n++] = [chrome.runtime.getURL("images/tanuki.png"), 205, 210];
	Images[n++] = [chrome.runtime.getURL("images/kitty.png"), 155, 200];
	Images[n++] = [chrome.runtime.getURL("images/unicorn.png"), 305, 310];
	Images[n++] = [chrome.runtime.getURL("images/miku.png"), 205, 210];
	let x = Math.floor(Math.random() * Images.length);
	let w = Math.floor(Math.random() * (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - Images[x][1]));
	let h = Math.floor(Math.random() * (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - Images[x][2]));
	document.body.innerHTML += "<img src='" + Images[x][0] + "' alt='Image' style='top: " + h + "px; left: " + w + "px; position: absolute; cursor: pointer; z-index: 9;' class='YAY' />";
	document.querySelectorAll("img.YAY").addEventListener("click",Unicorns);
};
function getTypes(selectedItem){
	let dataTypes = {};
	if(selectedItem){
		for(let items of selectedItem){
			dataTypes[items] = true;
		};
	};
    return dataTypes;
};
function LoadOtherSettings(boobs){
	if(boobs.CSVFields){
		for(diaper of boobs.CSVFields){
			if(diaper[1] === Squishy){
				SetSync("DebugFLE", diaper[0]);
			};
		};
		if(boobs.DebugFLE && boobs.DebugFLE == true){
			document.body.style.border = "3px solid red";
		};
	}
	FLESettings();
};
function FLESettings(){
	if(!(document.getElementsByClassName("fl-menu")[0] || document.getElementById("sidebar"))){
		StillLoading(FLESettings);
	};
	if(user_id){
		if(document.getElementsByClassName("fl-menu")[0]){
			var SettingsIcon = "<svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='16' height='16' viewBox='0 0 24 24'><path d='M 9.6679688 2 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 4.5058594 4.9785156 L 2.1738281 9.0214844 L 4.1132812 10.707031 C 4.0445153 11.128986 4 11.558619 4 12 C 4 12.441381 4.0445153 12.871014 4.1132812 13.292969 L 2.1738281 14.978516 L 4.5058594 19.021484 L 6.9296875 18.185547 C 7.5961042 18.732596 8.3550224 19.166199 9.1757812 19.476562 L 9.6679688 22 L 14.332031 22 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 19.494141 19.021484 L 21.826172 14.978516 L 19.886719 13.292969 C 19.955485 12.871014 20 12.441381 20 12 C 20 11.558619 19.955485 11.128986 19.886719 10.707031 L 21.826172 9.0214844 L 19.494141 4.9785156 L 17.070312 5.8144531 C 16.403896 5.2674041 15.644978 4.8338012 14.824219 4.5234375 L 14.332031 2 L 9.6679688 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z'></path></svg>";
			var div = document.getElementsByClassName("fl-menu")[0];
			var settings = document.createElement("div");
			settings.id = "FLE-Settings-fl-menu";
			settings.className = "fl-menu__separator fl-menu__content-actions";
			settings.innerHTML = "<div id='ExtraLinks' class='fl-menu__buttons-wrapper'><a id='AddOnSettings' class='fl-menu__button' style='float: relative; width: 100%' href='javascript:void(0);' title='Open FLE Settings'>" + SettingsIcon + "FLE Settings</a></div>";
		};
		if(document.getElementById("sidebar")){
			var SettingsIcon = "<svg class='relative pd1 mr1' xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24'><path d='M 9.6679688 2 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 4.5058594 4.9785156 L 2.1738281 9.0214844 L 4.1132812 10.707031 C 4.0445153 11.128986 4 11.558619 4 12 C 4 12.441381 4.0445153 12.871014 4.1132812 13.292969 L 2.1738281 14.978516 L 4.5058594 19.021484 L 6.9296875 18.185547 C 7.5961042 18.732596 8.3550224 19.166199 9.1757812 19.476562 L 9.6679688 22 L 14.332031 22 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 19.494141 19.021484 L 21.826172 14.978516 L 19.886719 13.292969 C 19.955485 12.871014 20 12.441381 20 12 C 20 11.558619 19.955485 11.128986 19.886719 10.707031 L 21.826172 9.0214844 L 19.494141 4.9785156 L 17.070312 5.8144531 C 16.403896 5.2674041 15.644978 4.8338012 14.824219 4.5234375 L 14.332031 2 L 9.6679688 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z'></path></svg>";
			var div = document.getElementById("sidebar").firstChild;
			var settings = document.createElement("div");
			settings.id = "FLE-Settings-sidebar";
			settings.className = "pa3 bb b-gray-850";
			settings.innerHTML = "<div class='cf' id='ExtraLinks'><div class='fl w-50 pl2 pr1 pb1' style='width: 100%'><a id='AddOnSettings' class='db pv3 pl3 pr2 no-underline gray-300 hover-gray-50 fill-gray-300 hover-fill-gray-50 bg-gray-800 hover-bg-gray-500 theme-hover-bg-gray-600 bg-animate f6 fw7 w-100 truncate' href='javascript:void(0);' title='Open FLE Settings'>" + SettingsIcon + "		<span>FLE Settings</span></a></div></div>";
		};
		div.childNodes[0].after(settings);
		document.getElementById("AddOnSettings").addEventListener("click", function(){
			chrome.storage.sync.set({
				FLESettings: Math.floor(Math.random() * 1234567890)
			});
		});
		if(location.href.match("fetlife.com/home")){
			Konami("38,38,40,40,37,39,37,39,66,65");
		};
	}else{
		document.getElementById("sidebar").getElementsByTagName("ul")[0].innerHTML += "<li><a id='AddOnSettings' class='dib link pv1 moon-gray hover-near-white lh-title' style='font-size: 18px;' title='Open FLE Settings' href='javascript:void(0)'>FLE Settings</a></li>";
		document.querySelector("#AddOnSettings").addEventListener("click", function(){
			chrome.storage.sync.set({
				FLESettings: Math.floor(Math.random() * 1234567890)
			});
		});
	};
};
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
function AJAXStories(){
	return new Promise(function(resolve, reject){
		let ajax = new XMLHttpRequest();
		ajax.onload = function(){
			let reply = JSON.parse(ajax.responseText);
			resolve(reply.stories.length);
		};
		ajax.onerror = reject;
		ajax.open("get", "https://fetlife.com/home/v4_stories.json?subfeed=everything");
		ajax.send();
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
function waitForElement(querySelector, timeout = 0){
    const startTime = new Date().getTime();
    return new Promise((resolve, reject)=>{
        const timer = setInterval(()=>{
            const now = new Date().getTime();
            if(querySelector){
                clearInterval(timer);
                resolve();
            }else if(timeout && now - startTime >= timeout){
                clearInterval(timer);
                reject();
            };
        }, 100);
    });
};
function onError(error){
	console.log(`Error: ${error}`);
};