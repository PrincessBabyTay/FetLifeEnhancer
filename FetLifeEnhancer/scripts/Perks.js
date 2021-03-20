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