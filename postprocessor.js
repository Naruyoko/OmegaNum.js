const fs=require("fs");
const process=require("process");
const extensions=[".js",".min.js",".esm.js",".cjs.js"];
let successes=0;
for (const extension of extensions){
  const path="dist/OmegaNum"+extension;
  try{
    fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
    let data=fs.readFileSync(path,"utf8");
    if (extension==".min.js"){
      const classCallCheckRegex=/function\(\w+,\w+\){if\(!\(\w+ instanceof \w+\)\)throw new TypeError\("Cannot call a class as a function"\)}\(this,\w+\),this\.array=\[0\],this\.sign=1,/;
      const classCallCheck=data.match(classCallCheckRegex);
      if (classCallCheck==null){
        throw Error("Failed to match class call check");
      }
      data=data.replace(classCallCheckRegex,"");
      console.log("%s -!",classCallCheck[0]);
      fs.writeFileSync(path,data);
    }else{
      const classCallCheckRegex=/_classCallCheck\(this, \w+\)/;
      const callAsFunctionFallbackRegex=/if \(!\(this instanceof \w+\)\) return new \w+\(\w+, \w+\)/;
      const classCallCheck=data.match(classCallCheckRegex);
      const callAsFunctionFallback=data.match(callAsFunctionFallbackRegex);
      if (classCallCheck==null||callAsFunctionFallback==null){
        throw Error("Failed to match class call check and its replacement");
      }
      data=data.replace(callAsFunctionFallbackRegex,"0").replace(classCallCheckRegex,callAsFunctionFallback[0]);
      console.log("%s -> %s",classCallCheck[0],callAsFunctionFallback[0]);
      fs.writeFileSync(path,data);
    }
    console.log("Modified %s",path);
    successes++;
  }catch(e){
    console.error(e);
    console.error("Unable to modify %s",path);
  }
}
console.log("Successfully modified %d of %d",successes,extensions.length);
if (successes!=extensions.length) process.exit(1);