function dg(s){
  return document.getElementById(s);
}
window.onload=function (){
  dg("button").onclick=function (){ 
    try{
      document.getElementById("output").innerHTML=Function(document.getElementById("input").value)(); 
    }catch(error){
      document.getElementById("error").value=new Date().getTime()+"ms, "+new Date().toTimeString()+"\n"+(error?"\n"+error.name+": "+error.message+(error.stack?"\n"+error.stack:""):"");
      throw error;
    }
  }
  initVersions();
};
function fetch(url,callback,onfail){
  var xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange=function (){
    if (this.readyState==4&&this.status==200){
      if (this.status==200){
        callback(this.responseText);
      }else{
        if (onfail) onfail(url);
        else showNetWorkError(url);
      }
    }
  };
  xhttp.open("GET",url,true);
  xhttp.send();
}
var apiUrl="https://api.github.com/repos/Naruyoko/OmegaNum.js";
var filesUrl="https://github.com/Naruyoko/OmegaNum.js/raw";
var releases;
var tags;
var tagsByName;
var OmegaNum;
var versions;
function showNetWorkError(url){
  throw Error("Network error: "+url);
}
function addProcessItem(s){
  var node=document.createElement("li");
  node.innerHTML=s;
  dg("process").appendChild(node);
  node=null;
}
function changeProcessItem(s){
  var node=dg("process").lastElementChild;
  node.innerHTML=s;
  node=null;
}
function initVersions(){
  addProcessItem("Fetching list...0 of 2");
  var listFetched=0;
  fetch(
    apiUrl+"/releases?per_page=100",
    function (s){
      releases=JSON.parse(s);
      changeProcessItem(++listFetched==2?"Fetching list...Done.":"Fetching list...1 of 2");
      if (listFetched==2) processReleases();
    });
  fetch(
    apiUrl+"/tags?per_page=100",
    function (s){
      tags=JSON.parse(s);
      changeProcessItem(++listFetched==2?"Fetching list...Done.":"Fetching list...1 of 2");
      if (listFetched==2) processReleases();
    });
}
function processReleases(){
  tagsByName=Object.create(null);
  for (var i=0;i<tags.length;i++) tagsByName[tags[i]["name"]]=tags[i];
  versions=Object.create(null);
  addProcessItem("Making results...");
  for (var i=0;i<releases.length;i++){
    var release=releases[i];
    var releaseName=release["name"];
    var tag=tagsByName[release["tag_name"]];
    var node=document.createElement("option");
    node.innerHTML=releaseName+" ("+tag["commit"]["sha"].substring(0,6)+")";
    node.value=i+"";
    dg("version").appendChild(node);
    node=null;
  }
  changeProcessItem("Making results...Done.");
  switchVersion();
}
function switchVersion(){
  var releaseIndex=dg("version").value;
  var release=releases[releaseIndex];
  var releaseName=release["name"];
  if (versions[releaseName]){
    OmegaNum=versions[releaseName];
  }else{
    var tag=tagsByName[release["tag_name"]];
    var sha=tag["commit"]["sha"];
    addProcessItem("Fetching <a href=\""+release["html_url"]+"\">"+releaseName+"</a>...");
    fetch(
      filesUrl+"/"+sha+"/OmegaNum.js",
      function (s){
        OmegaNum=undefined;
        (Function(atob(JSON.parse(s).content)))();
        versions[releaseName]=OmegaNum;
      });
    changeProcessItem("Fetching <a href=\""+release["html_url"]+"\">"+releaseName+"</a>...Done.");
  }
}