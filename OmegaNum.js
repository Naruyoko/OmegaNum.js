//Code snippets and templates from Decimal.js

;(function (globalScope) {
  'use strict';


  // --  EDITABLE DEFAULTS  -- //
    var OmegaNum = {

      // The rounding mode used by default by `toInteger`, `toDecimalPlaces`, `toExponential`,
      // `toFixed`, `toPrecision` and `toSignificantDigits`.
      //
      // ROUND_UP         0 Away from zero.
      // ROUND_DOWN       1 Towards zero.
      // ROUND_CEIL       2 Towards +Infinity.
      // ROUND_FLOOR      3 Towards -Infinity.
      // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
      // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
      // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
      // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
      // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
      //
      // E.g.
      // `OmegaNum.rounding = 4;`
      // `OmegaNum.rounding = OmegaNum.ROUND_HALF_UP;`
      // Unused
      rounding: 4,                           // 0 to 8

      // The maximum number of arrows accepted in operation.
      // It will warn and then return Infinity if exceeded.
      // This is to prevent loops to not be breaking, and also to prevent memory leaks.
      // 1000 means operation above {1000} is disallowed.
      // `OmegaNum.maxArrow = 1000;`
      maxArrow: 1e3,
      
      // Whether or not to print calculation steps on console.
      // `OmegaNum.debug = true;`
      debug: false
    },


  // -- END OF EDITABLE DEFAULTS -- //


    external = true,

    omegaNumError = '[OmegaNumError] ',
    invalidArgument = omegaNumError + 'Invalid argument: ',

    mathfloor = Math.floor,
    mathpow = Math.pow,

    isOmegaNum = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,

    ONE,
    BASE = 10,
    LOG_BASE = 1,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_E = Math.log10(MAX_SAFE_INTEGER),    // 1286742750677284

    // OmegaNum.prototype object
    P={},
    // OmegaNum static object
    Q={};

  // OmegaNum prototype methods

  /*
   *  absoluteValue             abs
   *  arrow
   *  ceiling                   ceil
   *  chain
   *  comparedTo                cmp
   *  cubeRoot                  cbrt
   *  divide                    div
   *  equals                    eq
   *  floor
   *  generalLogarithm          log10
   *  greaterThan               gt
   *  greaterThanOrEqualTo      gte
   *  hyper
   *  isFinite
   *  isInteger                 isint
   *  isNaN
   *  isNegative                isneg
   *  isPositive                ispos
   *  lessThan                  lt
   *  lessThanOrEqualTo         lte
   *  logarithm                 logBase
   *  minus                     sub
   *  modulo                    mod
   *  naturalLogarithm          ln        log
   *  negated                   neg
   *  plus                      add
   *  reciprocate               rec
   *  root
   *  round
   *  squareRoot                sqrt
   *  times                     mul
   *  tetrate                   tetr
   *  toNumber
   *  toPower                   pow
   *  toString
   */
  P.absoluteValue=P.abs=function(){
   	var x=this.clone();
    x.sign=1;
    return x;
  }
  Q.absoluteValue=Q.abs=function(x){
    return OmegaNum(x).abs();
  }
  P.negate=P.neg=function (){
    var x=this.clone();
    x.sign=x.sign*-1;
    return x;
  }
  Q.negate=Q.neg=function (x){
    return OmegaNum(x).neg();
  }
  P.compareTo=P.cmp=function (other){
    other=OmegaNum(other);
    if ((this.sign==1)&&(other.sign==-1)) return 1;
    if ((this.sign==-1)&&(other.sign==1)) return -1;
    if (this.array.length>other.array.length) return 1;
    if (this.array.length<other.array.length) return -1;
    for (var i=this.array.length-1;i>=0;i--){
      if (this.array[i]>other.array[i]) return 1;
      if (this.array[i]<other.array[i]) return -1;
    }
    return 0;
  }
  Q.compare=Q.cmp=function (x,y){
    return OmegaNum(x).cmp(y);
  }
  P.greaterThan=P.gt=function (other){
    return this.cmp(other)>0;
  }
  Q.greaterThan=Q.gt=function (x,y){
    return OmegaNum(x).gt(y);
  }
  P.greaterThanOrEqualTo=P.gte=function (other){
    return this.cmp(other)>=0;
  }
  Q.greaterThanOrEqualTo=Q.gte=function (x,y){
    return OmegaNum(x).gte(y);
  }
  P.lessThan=P.lt=function (other){
    return this.cmp(other)<0;
  }
  Q.lessThan=Q.lt=function (x,y){
    return OmegaNum(x).lt(y);
  }
  P.lessThanOrEqualTo=P.lte=function (other){
    return this.cmp(other)<=0;
  }
  Q.lessThanOrEqualTo=Q.lte=function (x,y){
    return OmegaNum(x).lte(y);
  }
  P.equalsTo=P.equal=P.eq=function (other){
    return this.cmp(other)==0;
  }
  Q.equalsTo=Q.equal=Q.eq=function (x,y){
    return OmegaNum(x).eq(y);
  }
  P.minimum=P.min=function (other){
    return this.lt(other)?this.clone():OmegaNum(other);
  }
  Q.minimum=Q.min=function (x,y){
    return OmegaNum(x).min(y);
  }
  P.maximum=P.max=function (other){
    return this.gt(other)?this.clone():OmegaNum(other);
  }
  Q.maximum=Q.max=function (x,y){
    return OmegaNum(x).max(y);
  }
  P.isPositive=P.ispos=function (){
    return this.gt(0);
  }
  Q.isPositive=Q.ispos=function (x){
    return OmegaNum(x).ispos();
  }
  P.isNegative=P.isneg=function (){
    return this.lt(0);
  }
  Q.isNegative=Q.isneg=function (x){
    return OmegaNum(x).isneg();
  }
  P.isNaN=function (){
    return isNaN(this.array[0]);
  }
  Q.isNaN=function (x){
    return OmegaNum(x).isNaN();
  }
  P.isFinite=function (){
    return isFinite(this.array[0]);
  }
  Q.isFinite=function (x){
    return OmegaNum(x).isFinite();
  }
  P.isInteger=P.isint=function (){
    if (this.sign==-1) return this.abs().isint();
    if (this.gt(MAX_SAFE_INTEGER)) return true;
    return Number.isInteger(this.toNumber());
  }
  Q.isInteger=Q.isint=function (x){
    return OmegaNum(x).isint();
  }
  P.floor=function (){
    if (this.isInteger) return this.clone();
    return OmegaNum(Math.floor(this.toNumber()));
  }
  Q.floor=function (x){
    return OmegaNum(x).floor();
  }
  P.ceiling=P.ceil=function (){
    if (this.isInteger) return this.clone();
    return OmegaNum(Math.ceil(this.toNumber()));
  }
  Q.ceiling=Q.ceil=function (x){
    return OmegaNum(x).ceil();
  }
  P.round=function (){
    if (this.isInteger) return this.clone();
    return OmegaNum(Math.round(this.toNumber()));
  }
  Q.round=function (x){
    return OmegaNum(x).round();
  }
  P.plus=P.add=function (other){
    var x=this.clone();
    var other=OmegaNum(other);
    if (OmegaNum.debug) console.log(this+"+"+other);
    if (x.sign==-1) return x.neg().add(other.neg()).neg();
    if (other.sign==-1) return x.sub(other.neg());
    if (x.max(other).gt("e"+MAX_SAFE_INTEGER)||x.div(other).max(other.div(x)).gt(MAX_SAFE_INTEGER)) return x.max(other);
    var y=x.min(other);
    x=x.max(other);
    if (!x.array[1]){
      return OmegaNum(x.toNumber()+y.toNumber());
    }else if (x.array[1]==1){
      if (y.array[1]<1){
        y.array[0]=Math.log10(y.array[0]);
        y.array[1]++;
      }
      return OmegaNum([y.array[0]+Math.log10(Math.pow(10,x.array[0]-y.array[0])+1),1]);
    }
  }
  Q.plus=Q.add=function (x,y){
    return OmegaNum(x).add(y);
  }
  P.minus=P.sub=function (other){
    var x=this.clone();
    var other=OmegaNum(other);
    if (OmegaNum.debug) console.log(this+"-"+other);
    if (x.sign==-1) return x.neg().sub(other.neg()).neg();
    if (other.sign==-1) return x.add(other.neg());
    if (x.max(other).gt("e"+MAX_SAFE_INTEGER)||x.div(other).max(other.div(x)).gt(MAX_SAFE_INTEGER)){
      return x.gt(other)?x:OmegaNum(other).neg();
    }
    var y=x.min(other);
    x=x.max(other);
    if (!x.array[1]){
      var r=OmegaNum(x.toNumber()-y.toNumber());
      return this.gt(other)?r:r.neg();
    }else if (x.array[1]==1){
      if (y.array[1]<1){
        y.array[0]=Math.log10(y.array[0]);
        y.array[1]++;
      }
      var r=OmegaNum([y.array[0]+Math.log10(Math.pow(10,x.array[0]-y.array[0])-1),1]);
      return this.gt(other)?r:r.neg();
    }
  }
  Q.minus=Q.sub=function (x,y){
    return OmegaNum(x).sub(y);
  }
  P.times=P.mul=function (other){
    var other=OmegaNum(other);
    if (OmegaNum.debug) console.log(this+"*"+other);
    if (this.sign*other.sign==-1) return this.abs().mul(other.abs()).neg();
    if (this.sign==-1) return this.abs().mul(other.abs());
    if (other.eq(0)) return OmegaNum(0);
    if (other.eq(1)) return this.clone();
    if (this.max(other).gt("ee"+MAX_SAFE_INTEGER)) return this.gt(other)?this.clone():OmegaNum(0);
    if (this*other<=MAX_SAFE_INTEGER) return OmegaNum(this*other);
    return OmegaNum.pow(10,this.log10().add(other.log10()));
  }
  Q.times=Q.mul=function (x,y){
    return OmegaNum(x).mul(y);
  }
  P.divide=P.div=function (other){
    var other=OmegaNum(other);
    if (OmegaNum.debug) console.log(this+"/"+other);
    if (this.sign*other.sign==-1) return this.abs().div(other.abs()).neg();
    if (this.sign==-1) return this.abs().div(other.abs());
    if (this.eq(other)) return ONE;
    if (this.max(other).gt("ee"+MAX_SAFE_INTEGER)) return this.max(other);
    if (this/other<=MAX_SAFE_INTEGER) return OmegaNum(this/other);
    return OmegaNum.pow(10,this.log10().sub(other.log10()));
  }
  Q.divide=Q.div=function (x,y){
    return OmegaNum(x).div(y);
  }
  P.reciprocate=P.rec=function (){
    if (OmegaNum.debug) console.log(this+"^-1");
    if (this.isNaN()||this.eq(0)) return OmegaNum(NaN);
    if (this.abs().gt(Number.MAX_VALUE)) return OmegaNum(0);
    return OmegaNum(1/this);
  }
  Q.reciprocate=Q.rec=function (x){
    return OmegaNum(x).rec();
  }
  P.modular=P.mod=function (other){
    return this.sub(this.mul(this.floor(this.div(other))));
  }
  Q.modular=Q.mod=function (x,y){
    return OmegaNum(x).mod(y);
  }
  P.toPower=P.pow=function (other){
    var other=OmegaNum(other);
    if (OmegaNum.debug) console.log(this+"^"+other);
    if (other.eq(0)) return ONE;
    if (other.eq(1)) return this.clone;
    if (other.lt(0)) return this.pow(other.neg()).rec();
    if (other.lt(1)) return this.root(other.rec());
    if (this.lt(0)&&other.isint()){
      if (other.mod(2).lt(1)) return this.abs().pow(other);
      return this.abs().pow(other).neg();
    }
    if (this.lt(0)) return OmegaNum(NaN);
    if (this.eq(1)) return ONE;
    if (this.eq(0)) return OmegaNum(0);
    if (this.max(other).gt("eee"+MAX_SAFE_INTEGER)) return this.max(other);
    if (this.eq(10)){
      if (other.gt(0)){
        other.array[1]=(other.array[1]+1)||1;
        other.standarlize();
        return other;
      }else{
        return OmegaNum(Math.pow(10,other));
      }
    }
    if (Math.pow(this,other)<=MAX_SAFE_INTEGER) return OmegaNum(Math.pow(this,other));
    return OmegaNum.pow(10,this.log10().mul(other));
  }
  Q.toPower=Q.pow=function (x,y){
    return OmegaNum(x).pow(y);
  }
  P.squareRoot=P.sqrt=function (){
    return this.root(2);
  }
  Q.squareRoot=Q.sqrt=function (x){
    return OmegaNum(x).root(2);
  }
  P.cubeRoot=P.cbrt=function (){
    return this.root(3);
  }
  Q.cubeRoot=Q.cbrt=function (x){
    return OmegaNum(x).root(3);
  }
  P.root=function (other){
    var other=OmegaNum(other);
    if (OmegaNum.debug) console.log(this+"root"+other);
    if (other.eq(1)) return this.clone;
    if (other.lt(0)) return this.root(other.neg()).rec();
    if (other.lt(1)) return this.pow(other.rec());
    if (this.lt(0)) return OmegaNum(NaN);
    if (this.eq(1)) return ONE;
    if (this.eq(0)) return OmegaNum(0);
    if (this.max(other).gt("eee"+MAX_SAFE_INTEGER)) return this.max(other);
    return OmegaNum.pow(10,this.log10().div(OmegaNum.log10(other)));
  }
  Q.root=function (x,y){
    return OmegaNum(x).pow(y);
  }
  P.generalLogarithm=P.log10=function (){
    var x=this.clone();
    if (OmegaNum.debug) console.log("log"+this);
    if (x.lt(0)) return OmegaNum(NaN);
    if (x.eq(0)) return OmegaNum(-Infinity);
    if (x.lt(MAX_SAFE_INTEGER)) return OmegaNum(Math.log10(x.toString()));
    if (x.gt("10^^"+MAX_SAFE_INTEGER)) return x;
    x.array[1]--;
    return x;
  }
  Q.generalLogarithm=Q.log10=function (x){
    return OmegaNum(x).log10();
  }
  P.logarithm=P.logBase=function (base){
    return this.log10().mul(OmegaNum.log10(base));
  }
  Q.logarithm=Q.logBase=function (x,base){
    return OmegaNum(x).logBase(base);
  }
  P.naturalLogarithm=P.log=P.ln=function (){
    return this.logBase(Math.E);
  }
  Q.naturalLogarithm=Q.log=Q.ln=function (x){
    return OmegaNum(x).ln();
  }
  P.tetrate=P.tetr=function (other){
    var other=OmegaNum(other);
    if (OmegaNum.debug) console.log(this+"^^"+other);
    if (!other.isint()||other.lt(0)) return OmegaNum(NaN);
    if (this.eq(0)&&other.eq(0)) return OmegaNum(NaN);
    if (this.eq(0)) return OmegaNum(0);
    if (this.eq(1)) return ONE;
    if (other.eq(0)) return ONE;
    if (other.eq(1)) return this.clone();
    if (other.eq(2)) return this.pow(this);
    if (this.eq(2)&&other.eq(3)) return OmegaNum(16);
    if (this.eq(2)&&other.eq(4)) return OmegaNum(65536);
    if (this.max(other).gt("10^^^"+MAX_SAFE_INTEGER)) return this.max(other);
    if (other.gt(MAX_SAFE_INTEGER)){
      other.array[2]=(other.array[2]+1)||1;
      other.standarlize();
      return other;
    }
    var r=this.pow(this.pow(this));
    other=other.sub(3);
    while (other.gt(0)&&r.lt("e"+MAX_SAFE_INTEGER)){
      r=this.pow(r);
      other=other.sub(1);
    }
    r.array[1]=(r.array[1]+other.toNumber())||other.toNumber();
    r.standarlize();
    return r;
  }
  Q.tetrate=Q.tetr=function (x,y){
    return OmegaNum(x).tetr(y);
  }
  P.arrow=function (arrows){
    arrows=OmegaNum(arrows);
    if (!arrows.isint()||arrows.lt(0)) return other=>OmegaNum(NaN);
    if (arrows.eq(0)) return other=>this.mul(other);
    if (arrows.eq(1)) return other=>this.pow(other);
    if (arrows.eq(2)) return other=>this.tetr(other);
    return other=>{
      var other=OmegaNum(other);
    if (OmegaNum.debug) console.log(this+"{"+arrows+"}"+other);
      if (!other.isint()||other.lt(0)) return OmegaNum(NaN);
      if (other.eq(0)) return ONE;
      if (other.eq(1)) return this.clone();
      if (arrows.gte(OmegaNum.maxArrow)){
        console.warn("Number too large to reasonably handle it: tried to "+arrows.add(2)+"-ate.");
        return OmegaNum(Infinity);
      }
      if (other.eq(2)) return this.arrow(arrows-1)(this);
      if (this.max(other).gt("10{"+(arrows.add(1))+"}"+MAX_SAFE_INTEGER)) return this.max(other);
      if (other.gt(MAX_SAFE_INTEGER)){
        other.array[arrows]=(other.array[arrows]+1)||1;
        other.standarlize();
        return other;
      }
      var r=this.arrow(arrows-1)(this.arrow(arrows-1)(this));
      r.array[arrows-1]=(r.array[arrows-1]+other.sub(3).toNumber())||other.sub(3).toNumber();
      r.standarlize();
      return r;
    };
  }
  P.chain=function (other,arrows){
    return this.arrow(arrows)(other)
  }
  Q.arrow=function (x,z,y){
    return OmegaNum(x).arrow(z)(y);
  }
  Q.chain=function (x,y,z){
    return OmegaNum(x).arrow(z)(y);
  }
  Q.hyper=function (z){
    return (x,y)=>OmegaNum(x).arrow(z+2)(y);
  }
  P.standarlize=function (){
  	var b;
    var x=this;
    if (!x.array.length) x.array=[0];
    for (var i=0;i<x.array.length;i++){
      if (x.array[i]==null){
        x.array[i]=0;
      }
      if (!isFinite(x.array[i])){
        x.array=[Infinity];
        return;
      }
      if (isNaN(x.array[i])){
        x.array=[NaN];
        return;
      }
    }
    do{
      b=false;
      while (x.array[x.array.length-1]===0){
      	x.array.pop();
      	b=true;
      }
      if (x.array[0]>MAX_SAFE_INTEGER){
        if (!x.array[1]) x.array[1]=0;
        x.array[1]++;
        x.array[0]=Math.log10(x.array[0]);
        b=true;
      }
      if ((x.array[0]<MAX_E)&&(x.array[1])){
        x.array[0]=Math.pow(10,x.array[0]);
        x.array[1]--;
        b=true;
      }
      if ((x.array[0]<MAX_SAFE_INTEGER)&&(!x.array[1])&&(x.array.length>=2)){
        for (var i=2;!(this.array[i])&&(i<this.array.length);i++) continue;
        x.array[i-1]=x.array[0];
        x.array[0]=10;
        x.array[i]--;
        b=true;
      }
      for (var i=1;i<x.array.length;i++){
        if (x.array[i]>MAX_SAFE_INTEGER){
          if (!x.array[i+1]) x.array[i+1]=0;
          x.array[i+1]++;
          x.array[0]=x.array[i]+1;
          x.array[i]=0;
          b=true;
        }
      }
    }while(b);
    if (!x.array.length) x.array=[0];
    return x;
  }
  P.toNumber=function (){
    //console.log(this.array);
    if (this.sign==-1) return -1*this.abs();
    if ((this.array[1]>=2)||((this.array[1]==1)&&(this.array[0]>Math.log10(2)*1024))) return Infinity;
    for (var i=2;i<this.array.length;i++) if (this.array[i]) return Infinity;
    if (this.array[1]==1) return Math.pow(10,this.array[0]);
    return this.array[0];
  }
  P.toString=function (){
    if (this.sign==-1) return "-"+this.abs();
    if (!isFinite(this.array[0])) return "Infinity";
    if (isNaN(this.array[0])) return "NaN";
    var b=false;
    for (var i=2;!b&&(i<this.array.length);i++) if (this.array[i]) b=true;
    if (b){
      var s="";
      for (var i=2;i<this.array.length;i++){
        var q=i>=5?"{"+i+"}":"^".repeat(i);
        if (this.array[i]>1) s="(10"+q+")^"+this.array[i]+" "+s;
        else if (this.array[i]==1) s="10"+q+s;
      }
      return s+new OmegaNum(this.array.slice(0,2));
    }else if (!this.array[1]) return String(this.toNumber());
    else if (this.array[1]<3) return "e".repeat(this.array[1]-1)+Math.pow(10,this.array[0]-Math.floor(this.array[0]))+"e"+Math.floor(this.array[0]);
    else if (this.array[1]<8) return "e".repeat(this.array[1])+this.array[0];
    else return "(10^)^"+this.array[1]+" "+this.array[0];
  }
  P.clone=function (){
    return OmegaNum(this);
  }
  // OmegaNum methods

  /*
   *  clone
   *  config/set
   */

  /*
   * Create and return a OmegaNum constructor with the same configuration properties as this OmegaNum constructor.
   *
   */
  function clone(obj) {
    var i, p, ps;
    function OmegaNum(input) {
      var x=this;
      if (!(x instanceof OmegaNum)) return new OmegaNum(input);
      x.constructor=OmegaNum;
      x.array=[];
      if (typeof input=="number"){
        x.array[0]=Math.abs(input);
        x.sign=input<0?-1:1;
      }else if (typeof input=="string"){
        if (input.indexOf("10")==0){
          var w=input.substring(2).search(/[0-9e]/);
          if (input[2]=="{") w=input.substring(2).search("}")+1;
          if (w==-1) x=OmegaNum(NaN);
          var s=input.substring(2,w+2);
          var r=OmegaNum(input.substring(w+2));
          if (r.isNaN()) x=r;
          if (s[0]=="^"){
            r.array[w]=(r.array[w]+1)||1;
          }else if (s[0]=="{"){
            var n=Number(s.substring(1,w-1));
            if (isNaN(n)) x=OmegaNum(NaN);
            if (n<=0) x=OmegaNum(NaN);
            if (n>=OmegaNum.maxArrow){
              console.warn("Number too large to reasonably handle it: tried to "+arrows.add(2)+"-ate.");
              x=OmegaNum(Infinity);
            }
            r.array[n]=(r.array[n]+1)||1;
          }else x=OmegaNum(NaN);
          x=r;
        }else if (input.indexOf("e")==-1){
          x.array[0]=Number(input);
        }else{
          x.array=[0,input.search(/[0-9]./)];
          var s=input.substring(input.search(/[0-9]./)
          );
          if (isFinite(Number(s))){
            x.array[0]=Number(s);
          }else{
            x.array[0]=Number(s.substring(s.indexOf("e")+1));
            if (s.indexOf("e")>0) x.array[0]+=Math.log10(Number(s.substring(0,s.indexOf("e"))));
            x.array[1]++;
          }
        }
        if (input[0]=="-") x.sign=-1;
        else x.sign=1;
      }else if (input instanceof Array){
        this.array=input.slice(0);
        x.sign=1;
      }else if (input instanceof OmegaNum){
      	x.array=input.array.slice(0);
        x.sign=input.sign;
      }else{
        x=OmegaNum(NaN);
      }
      x.standarlize();
      return x;
    }
    OmegaNum.prototype = P;

    OmegaNum.ROUND_UP = 0;
    OmegaNum.ROUND_DOWN = 1;
    OmegaNum.ROUND_CEIL = 2;
    OmegaNum.ROUND_FLOOR = 3;
    OmegaNum.ROUND_HALF_UP = 4;
    OmegaNum.ROUND_HALF_DOWN = 5;
    OmegaNum.ROUND_HALF_EVEN = 6;
    OmegaNum.ROUND_HALF_CEIL = 7;
    OmegaNum.ROUND_HALF_FLOOR = 8;

    OmegaNum.clone=clone;
    OmegaNum.config=OmegaNum.set=config;
    //OmegaNum.abs=P.abs;
    OmegaNum=Object.assign(OmegaNum,Q);
    /*
    if (obj === void 0) obj = {};
    if (obj) {
      ps = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'LN10'];
      for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }

    OmegaNum.config(obj);
    */
    return OmegaNum;
  }


  /*
   * Configure global settings for a OmegaNum constructor.
   *
   * `obj` is an object with one or more of the following properties,
   *
   *   precision  {number}
   *   rounding   {number}
   *   toExpNeg   {number}
   *   toExpPos   {number}
   *
   * E.g. OmegaNum.config({ precision: 20, rounding: 4 })
   *
   */
  function config(obj){
    if (!obj||typeof obj!=='object') {
      throw Error(decimalError+'Object expected');
    }
    var i,p,v,
      ps = [
        'precision',1,MAX_DIGITS,
        'rounding',0,8,
        'toExpNeg',-1/0,0,
        'toExpPos',0,1/0
      ];
    for (i = 0; i < ps.length; i += 3) {
      if ((v = obj[p = ps[i]]) !== void 0) {
        if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
        else throw Error(invalidArgument + p + ': ' + v);
      }
    }

    if ((v = obj[p = 'LN10']) !== void 0) {
        if (v == Math.LN10) this[p] = new this(v);
        else throw Error(invalidArgument + p + ': ' + v);
    }

    return this;
  }


  // Create and configure initial OmegaNum constructor.
  OmegaNum=clone(OmegaNum);

  OmegaNum['default']=OmegaNum.OmegaNum=OmegaNum;

  // Internal constant.
  ONE=new OmegaNum(1);

  // Export.

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () {
      return OmegaNum;
    });
  // Node and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = OmegaNum;
    // Browser.
  } else {
    if (!globalScope) {
      globalScope = typeof self != 'undefined' && self && self.self == self
        ? self : Function('return this')();
    }
    globalScope.OmegaNum = OmegaNum;
  }
})(this);
document.getElementById("button").onclick=function (){
  var e=document.getElementById("input").value;
  var q;
  if (e[0]=="[") q=OmegaNum(JSON.parse(e));
  else q=OmegaNum(e);
  document.getElementById("output").innerHTML=q+"<br>"+q.toNumber()+"<br>"+JSON.stringify(q.array);
}
document.getElementById("button2").onclick=function (){
  document.getElementById("output2").innerHTML=eval(document.getElementById("input2").value);
}
