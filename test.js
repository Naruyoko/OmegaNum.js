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
  getFirst();
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
var commitsLink="https://api.github.com/repos/Naruyoko/OmegaNum.js/commits";
var latestLink="https://raw.githack.com/Naruyoko/OmegaNum.js/master/OmegaNum.js";
var commits;
var filteredCommits;
var OmegaNum;
var versions={};
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
function getFirst(){
  addProcessItem("Fetching list...");
  fetch(
    commitsLink,
    function (s){
      commits=JSON.parse(s);
      changeProcessItem("Fetching list...Done.");
      filterDiffed();
    });
}
function filterDiffed(){
  filteredCommits=[];
  var lastCommitIndex=-1;
  var lastLibSHA="";
  function getNext(){
    lastCommitIndex++;
    fetch(
      commits[lastCommitIndex].commit.tree.url,
      function (s){
        changeProcessItem("Fetching commits..."+(lastCommitIndex+1)+" of "+commits.length);
        var tree=JSON.parse(s);
        var libIndex=0;
        while (libIndex<tree.tree.length&&tree.tree[libIndex].path!="OmegaNum.js") libIndex++;
        if (libIndex!=tree.tree.length&&lastLibSHA!=tree.tree[libIndex].sha){
          lastLibSHA=tree.tree[libIndex].sha;
          tree.libIndex=libIndex;
          tree.commitIndex=lastCommitIndex;
          filteredCommits.push(tree);
        };
        if (lastCommitIndex==commits.length-1){
          changeProcessItem("Fetching commits...Done.");
          showVersions();
        }else{
          getNext();
        }
      });
  }
  addProcessItem("Fetching commits...0 of "+commits.length);
  getNext();
}
function showVersions(){
  addProcessItem("Making results...");
  for (var i=0;i<filteredCommits.length;i++){
    var commit=commits[filteredCommits[i].commitIndex];
    var node=document.createElement("option");
    if (commit.commit.message.length>30){
      node.innerHTML=commit.commit.message.substring(0,27)+"... ("+commit.sha.substring(0,6)+")";
    }else{
      node.innerHTML=commit.commit.message+" ("+commit.sha.substring(0,6)+")";
    }
    node.value=i;
    dg("version").appendChild(node);
    node=null;
  }
  changeProcessItem("Making results...Done.");
  changeLibVersion();
}
function changeLibVersion(){
  var versionIndex=dg("version").value;
  var sha=commits[filteredCommits[versionIndex].commitIndex].sha;
  if (versions[sha]){
    OmegaNum=versions[sha];
  }else{
    addProcessItem("Fetching version "+sha+"...");
    fetch(
      filteredCommits[versionIndex].tree[filteredCommits[versionIndex].libIndex].url,
      function (s){
        OmegaNum=undefined;
        (Function(atob(JSON.parse(s).content)))();
        versions[sha]=OmegaNum;
      });
    changeProcessItem("Fetching version "+sha+"...Done.");
  }
}