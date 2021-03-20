function SaveYourPics(){
	let del = document.getElementsByTagName("a");
	let is_owner = false;
	for(a in del){
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
        for(l of picture){
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
            for(l of picture){
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
            for(l of picture){
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
            let picture = document.querySelectorAll("a.aspect-ratio--1x1.DELETE_ME");
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

GetSync.then(function(a){
	if(getTypes(a.CheckboxName).SaveYourPics && location.href.match(user_id + "/pictures/[0-9]+$")){
		SaveYourPics();
	};
    if(getTypes(a.CheckboxName).MultiImageUpload && location.href.match("/pictures/new")){
        MultiImageUpload();
    };
    if(getTypes(a.CheckboxName).BulkDeletePhotos && location.href.match("/users/" + user_id + "/pictures")){
        BulkDeletePhotos();
    };
}, onError);

