(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.OmegaNum = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  var omegaNumError = "[OmegaNumError] ";
  var invalidArgument = omegaNumError + "Invalid argument: ";
  var isOmegaNum = /^[-\+]*(Infinity|NaN|(10(\^+|\{[1-9]\d*\})|\(10(\^+|\{[1-9]\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/;
  var MAX_SAFE_INTEGER = 9007199254740991;
  var MAX_E = Math.log10(MAX_SAFE_INTEGER); //15.954589770191003
  //from break_eternity.js

  function decimalPlaces(value, places) {
    var len = places + 1;
    var numDigits = Math.ceil(Math.log10(Math.abs(value)));
    var rounded = Math.round(value * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);
    return parseFloat(rounded.toFixed(Math.max(len - numDigits, 0)));
  }

  function f_gamma(n) {
    if (!isFinite(n)) return n;

    if (n < -50) {
      if (n == Math.trunc(n)) return Number.NEGATIVE_INFINITY;
      return 0;
    }

    var scal1 = 1;

    while (n < 10) {
      scal1 = scal1 * n;
      ++n;
    }

    n -= 1;
    var l = 0.9189385332046727; //0.5*Math.log(2*Math.PI)

    l += (n + 0.5) * Math.log(n);
    l -= n;
    var n2 = n * n;
    var np = n;
    l += 1 / (12 * np);
    np *= n2;
    l += 1 / (360 * np);
    np *= np * n2;
    l += 1 / (1260 * np);
    np *= n2;
    l += 1 / (1680 * np);
    np *= n2;
    l += 1 / (1188 * np);
    np *= n2;
    l += 691 / (360360 * np);
    np *= n2;
    l += 7 / (1092 * np);
    np *= n2;
    l += 3617 / (122400 * np);
    return Math.exp(l) / scal1;
  } //All of these are from Patashu's break_eternity.js


  var OMEGA = 0.56714329040978387299997; //W(1,0)
  //from https://math.stackexchange.com/a/465183
  //The evaluation can become inaccurate very close to the branch point

  function f_lambertw(z, tol) {
    if (tol === undefined) tol = 1e-10;
    var w;
    var wn;
    if (!Number.isFinite(z)) return z;
    if (z === 0) return z;
    if (z === 1) return OMEGA;
    if (z < 10) w = 0;else w = Math.log(z) - Math.log(Math.log(z));

    for (var i = 0; i < 100; ++i) {
      wn = (z * Math.exp(-w) + w * w) / (w + 1);
      if (Math.abs(wn - w) < tol * Math.abs(wn)) return wn;
      w = wn;
    }

    throw Error("Iteration failed to converge: " + z); //return Number.NaN;
  } //from https://github.com/scipy/scipy/blob/8dba340293fe20e62e173bdf2c10ae208286692f/scipy/special/lambertw.pxd
  //The evaluation can become inaccurate very close to the branch point
  //at ``-1/e``. In some corner cases, `lambertw` might currently
  //fail to converge, or can end up on the wrong branch.


  function d_lambertw(zIn, tol) {
    if (tol === undefined) tol = 1e-10;
    var z = new OmegaNum(zIn);
    var w;
    var ew, wewz, wn;
    if (!z.isFinite()) return z;
    if (z.eq(OmegaNum.ZERO)) return z;

    if (z.eq(OmegaNum.ONE)) {
      //Split out this case because the asymptotic series blows up
      return new OmegaNum(OMEGA);
    } //Get an initial guess for Halley's method


    w = OmegaNum.ln(z); //Halley's method; see 5.9 in [1]

    for (var i = 0; i < 100; ++i) {
      ew = OmegaNum.exp(-w);
      wewz = w.sub(z.mul(ew));
      wn = w.sub(wewz.div(w.add(OmegaNum.ONE).sub(w.add(2).mul(wewz).div(OmegaNum.mul(2, w).add(2)))));
      if (OmegaNum.abs(wn.sub(w)).lt(OmegaNum.abs(wn).mul(tol))) return wn;
      w = wn;
    }

    throw Error("Iteration failed to converge: " + z); //return Decimal.dNaN;
  }

  var OmegaNum = /*#__PURE__*/function () {
    function OmegaNum(input, input2) {
      if (!(this instanceof OmegaNum)) return new OmegaNum(input, input2);

      this.array = [0];
      this.sign = 1; //@ts-ignore

      0;
      var x = this;
      var parsedObject = null;

      if (typeof input == "string" && (input[0] == "[" || input[0] == "{")) {
        try {
          parsedObject = JSON.parse(input);
        } catch (e) {//lol just keep going
        }
      }

      var temp, temp2;

      if (typeof input == "number" && !(input2 instanceof Array)) {
        temp = OmegaNum.fromNumber(input);
      } else if (parsedObject) {
        temp = OmegaNum.fromObject(parsedObject);
      } else if (typeof input == "string" && input[0] == "E") {
        temp = OmegaNum.fromHyperE(input);
      } else if (typeof input == "string") {
        temp = OmegaNum.fromString(input);
      } else if (input instanceof Array && (typeof input2 == "undefined" || typeof input2 == "number")) {
        temp = OmegaNum.fromArray(input, input2);
      } else if (typeof input == "number" && input2 instanceof Array) {
        temp = OmegaNum.fromArray(input, input2);
      } else if (input instanceof OmegaNum) {
        temp = input.array.slice(0);
        temp2 = input.sign;
      } else if (_typeof(input) == "object") {
        temp = OmegaNum.fromObject(input);
      } else {
        temp = [NaN];
        temp2 = 1;
      }

      if (temp instanceof OmegaNum) {
        x.array = temp.array;
        x.sign = temp.sign;
      } else {
        x.array = temp;
        x.sign = temp2 !== null && temp2 !== void 0 ? temp2 : 1;
      }

      return x;
    }

    _createClass(OmegaNum, [{
      key: "abs",
      value: function abs() {
        var x = this.clone();
        x.sign = 1;
        return x;
      }
    }, {
      key: "absoluteValue",
      value: function absoluteValue() {
        return this.abs();
      }
    }, {
      key: "neg",
      value: function neg() {
        var x = this.clone();
        x.sign = x.sign * -1;
        return x;
      }
    }, {
      key: "negate",
      value: function negate() {
        return this.neg();
      }
    }, {
      key: "cmp",
      value: function cmp(other) {
        if (!(other instanceof OmegaNum)) other = new OmegaNum(other);
        if (isNaN(this.array[0]) || isNaN(other.array[0])) return NaN;
        if (this.array[0] == Infinity && other.array[0] != Infinity) return this.sign;
        if (this.array[0] != Infinity && other.array[0] == Infinity) return -other.sign;
        if (this.array.length == 1 && this.array[0] === 0 && other.array.length == 1 && other.array[0] === 0) return 0;
        if (this.sign != other.sign) return this.sign;
        var m = this.sign;
        var r;
        if (this.array.length > other.array.length) r = 1;else if (this.array.length < other.array.length) r = -1;else {
          for (var i = this.array.length - 1; i >= 0; --i) {
            if (this.array[i] > other.array[i]) {
              r = 1;
              break;
            } else if (this.array[i] < other.array[i]) {
              r = -1;
              break;
            }
          }

          r = r || 0;
        }
        return r * m;
      }
    }, {
      key: "compareTo",
      value: function compareTo(other) {
        return this.cmp(other);
      }
    }, {
      key: "gt",
      value: function gt(other) {
        return this.cmp(other) > 0;
      }
    }, {
      key: "greaterThan",
      value: function greaterThan(other) {
        return this.gt(other);
      }
    }, {
      key: "gte",
      value: function gte(other) {
        return this.cmp(other) >= 0;
      }
    }, {
      key: "greaterThanOrEqualTo",
      value: function greaterThanOrEqualTo(other) {
        return this.gte(other);
      }
    }, {
      key: "lt",
      value: function lt(other) {
        return this.cmp(other) < 0;
      }
    }, {
      key: "lessThan",
      value: function lessThan(other) {
        return this.lt(other);
      }
    }, {
      key: "lte",
      value: function lte(other) {
        return this.cmp(other) <= 0;
      }
    }, {
      key: "lessThanOrEqualTo",
      value: function lessThanOrEqualTo(other) {
        return this.lte(other);
      }
    }, {
      key: "eq",
      value: function eq(other) {
        return this.cmp(other) === 0;
      }
    }, {
      key: "equal",
      value: function equal(other) {
        return this.eq(other);
      }
    }, {
      key: "equalsTo",
      value: function equalsTo(other) {
        return this.eq(other);
      }
    }, {
      key: "neq",
      value: function neq(other) {
        return this.cmp(other) !== 0;
      }
    }, {
      key: "notEqual",
      value: function notEqual(other) {
        return this.neq(other);
      }
    }, {
      key: "notEqualsTo",
      value: function notEqualsTo(other) {
        return this.neq(other);
      }
    }, {
      key: "min",
      value: function min(other) {
        return this.lt(other) ? this.clone() : new OmegaNum(other);
      }
    }, {
      key: "minimum",
      value: function minimum(other) {
        return this.min(other);
      }
    }, {
      key: "max",
      value: function max(other) {
        return this.gt(other) ? this.clone() : new OmegaNum(other);
      }
    }, {
      key: "maximum",
      value: function maximum(other) {
        return this.max(other);
      }
    }, {
      key: "ispos",
      value: function ispos() {
        return this.gt(OmegaNum.ZERO);
      }
    }, {
      key: "isPositive",
      value: function isPositive() {
        return this.ispos();
      }
    }, {
      key: "isneg",
      value: function isneg() {
        return this.lt(OmegaNum.ZERO);
      }
    }, {
      key: "isNegative",
      value: function isNegative() {
        return this.isneg();
      }
    }, {
      key: "isNaN",
      value: function (_isNaN) {
        function isNaN() {
          return _isNaN.apply(this, arguments);
        }

        isNaN.toString = function () {
          return _isNaN.toString();
        };

        return isNaN;
      }(function () {
        return isNaN(this.array[0]);
      })
    }, {
      key: "isFinite",
      value: function (_isFinite) {
        function isFinite() {
          return _isFinite.apply(this, arguments);
        }

        isFinite.toString = function () {
          return _isFinite.toString();
        };

        return isFinite;
      }(function () {
        return isFinite(this.array[0]);
      })
    }, {
      key: "isInfinite",
      value: function isInfinite() {
        return this.array[0] == Infinity;
      }
    }, {
      key: "isint",
      value: function isint() {
        if (this.sign == -1) return this.abs().isint();
        if (this.gt(OmegaNum.MAX_SAFE_INTEGER)) return true;
        return Number.isInteger(this.toNumber());
      }
    }, {
      key: "isInteger",
      value: function isInteger() {
        return this.isint();
      }
    }, {
      key: "floor",
      value: function floor() {
        if (this.isInteger()) return this.clone();
        return new OmegaNum(Math.floor(this.toNumber()));
      }
    }, {
      key: "ceil",
      value: function ceil() {
        if (this.isInteger()) return this.clone();
        return new OmegaNum(Math.ceil(this.toNumber()));
      }
    }, {
      key: "ceiling",
      value: function ceiling() {
        return this.ceil();
      }
    }, {
      key: "round",
      value: function round() {
        if (this.isInteger()) return this.clone();
        return new OmegaNum(Math.round(this.toNumber()));
      }
    }, {
      key: "add",
      value: function add(otherIn) {
        var x = this.clone();
        var other = new OmegaNum(otherIn);
        if (OmegaNum.debug >= OmegaNum.NORMAL) console.log(this + "+" + other);
        if (x.sign == -1) return x.neg().add(other.neg()).neg();
        if (other.sign == -1) return x.sub(other.neg());
        if (x.eq(OmegaNum.ZERO)) return other;
        if (other.eq(OmegaNum.ZERO)) return x;
        if (x.isNaN() || other.isNaN() || x.isInfinite() && other.isInfinite() && x.eq(other.neg())) return OmegaNum.NaN.clone();
        if (x.isInfinite()) return x;
        if (other.isInfinite()) return other;
        var p = x.min(other);
        var q = x.max(other);
        var t;

        if (q.gt(OmegaNum.E_MAX_SAFE_INTEGER) || q.div(p).gt(OmegaNum.MAX_SAFE_INTEGER)) {
          t = q;
        } else if (!q.array[1]) {
          t = new OmegaNum(x.toNumber() + other.toNumber());
        } else if (q.array[1] == 1) {
          var a = p.array[1] ? p.array[0] : Math.log10(p.array[0]);
          t = new OmegaNum([a + Math.log10(Math.pow(10, q.array[0] - a) + 1), 1]);
        } else {
          throw Error("Unexpected error");
        }

        return t;
      }
    }, {
      key: "plus",
      value: function plus(other) {
        return this.add(other);
      }
    }, {
      key: "sub",
      value: function sub(otherIn) {
        var x = this.clone();
        var other = new OmegaNum(otherIn);
        if (OmegaNum.debug >= OmegaNum.NORMAL) console.log(x + "-" + other);
        if (x.sign == -1) return x.neg().sub(other.neg()).neg();
        if (other.sign == -1) return x.add(other.neg());
        if (x.eq(other)) return OmegaNum.ZERO.clone();
        if (other.eq(OmegaNum.ZERO)) return x;
        if (x.isNaN() || other.isNaN() || x.isInfinite() && other.isInfinite()) return OmegaNum.NaN.clone();
        if (x.isInfinite()) return x;
        if (other.isInfinite()) return other.neg();
        var p = x.min(other);
        var q = x.max(other);
        var n = other.gt(x);
        var t;

        if (q.gt(OmegaNum.E_MAX_SAFE_INTEGER) || q.div(p).gt(OmegaNum.MAX_SAFE_INTEGER)) {
          t = q;
          t = n ? t.neg() : t;
        } else if (!q.array[1]) {
          t = new OmegaNum(x.toNumber() - other.toNumber());
        } else if (q.array[1] == 1) {
          var a = p.array[1] ? p.array[0] : Math.log10(p.array[0]);
          t = new OmegaNum([a + Math.log10(Math.pow(10, q.array[0] - a) - 1), 1]);
          t = n ? t.neg() : t;
        } else {
          throw Error("Unexpected error");
        }

        return t;
      }
    }, {
      key: "minus",
      value: function minus(other) {
        return this.sub(other);
      }
    }, {
      key: "mul",
      value: function mul(otherIn) {
        var x = this.clone();
        var other = new OmegaNum(otherIn);
        if (OmegaNum.debug >= OmegaNum.NORMAL) console.log(x + "*" + other);
        if (x.sign * other.sign == -1) return x.abs().mul(other.abs()).neg();
        if (x.sign == -1) return x.abs().mul(other.abs());
        if (x.isNaN() || other.isNaN() || x.eq(OmegaNum.ZERO) && other.isInfinite() || x.isInfinite() && other.abs().eq(OmegaNum.ZERO)) return OmegaNum.NaN.clone();
        if (other.eq(OmegaNum.ZERO)) return OmegaNum.ZERO.clone();
        if (other.eq(OmegaNum.ONE)) return x.clone();
        if (x.isInfinite()) return x;
        if (other.isInfinite()) return other;
        if (x.max(other).gt(OmegaNum.EE_MAX_SAFE_INTEGER)) return x.max(other);
        var n = x.toNumber() * other.toNumber();
        if (n <= MAX_SAFE_INTEGER) return new OmegaNum(n);
        return OmegaNum.pow(10, x.log10().add(other.log10()));
      }
    }, {
      key: "times",
      value: function times(other) {
        return this.mul(other);
      }
    }, {
      key: "div",
      value: function div(otherIn) {
        var x = this.clone();
        var other = new OmegaNum(otherIn);
        if (OmegaNum.debug >= OmegaNum.NORMAL) console.log(x + "/" + other);
        if (x.sign * other.sign == -1) return x.abs().div(other.abs()).neg();
        if (x.sign == -1) return x.abs().div(other.abs());
        if (x.isNaN() || other.isNaN() || x.isInfinite() && other.isInfinite() || x.eq(OmegaNum.ZERO) && other.eq(OmegaNum.ZERO)) return OmegaNum.NaN.clone();
        if (other.eq(OmegaNum.ZERO)) return OmegaNum.POSITIVE_INFINITY.clone();
        if (other.eq(OmegaNum.ONE)) return x.clone();
        if (x.eq(other)) return OmegaNum.ONE.clone();
        if (x.isInfinite()) return x;
        if (other.isInfinite()) return OmegaNum.ZERO.clone();
        if (x.max(other).gt(OmegaNum.EE_MAX_SAFE_INTEGER)) return x.gt(other) ? x.clone() : OmegaNum.ZERO.clone();
        var n = x.toNumber() / other.toNumber();
        if (n <= MAX_SAFE_INTEGER) return new OmegaNum(n);
        var pw = OmegaNum.pow(10, x.log10().sub(other.log10()));
        var fp = pw.floor();
        if (pw.sub(fp).lt(new OmegaNum(1e-9))) return fp;
        return pw;
      }
    }, {
      key: "divide",
      value: function divide(other) {
        return this.div(other);
      }
    }, {
      key: "rec",
      value: function rec() {
        if (OmegaNum.debug >= OmegaNum.NORMAL) console.log(this + "^-1");
        if (this.isNaN() || this.eq(OmegaNum.ZERO)) return OmegaNum.NaN.clone();
        if (this.abs().gt("2e323")) return OmegaNum.ZERO.clone();
        return new OmegaNum(1 / this.toNumber());
      }
    }, {
      key: "reciprocate",
      value: function reciprocate() {
        return this.rec();
      }
    }, {
      key: "mod",
      value: function mod(otherIn) {
        var other = new OmegaNum(otherIn);
        if (other.eq(OmegaNum.ZERO)) return OmegaNum.ZERO.clone();
        if (this.sign * other.sign == -1) return this.abs().mod(other.abs()).neg();
        if (this.sign == -1) return this.abs().mod(other.abs());
        return this.sub(this.div(other).floor().mul(other));
      }
    }, {
      key: "modular",
      value: function modular(other) {
        return this.mod(other);
      }
    }, {
      key: "gamma",
      value: //All of these are from Patashu's break_eternity.js
      //from HyperCalc source code
      function gamma() {
        var x = this.clone();
        if (x.gt(OmegaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
        if (x.gt(OmegaNum.E_MAX_SAFE_INTEGER)) return OmegaNum.exp(x);
        if (x.gt(OmegaNum.MAX_SAFE_INTEGER)) return OmegaNum.exp(OmegaNum.mul(x, OmegaNum.ln(x).sub(1)));
        var n = x.array[0];

        if (n > 1) {
          if (n < 24) return new OmegaNum(f_gamma(x.sign * n));
          var t = n - 1;
          var l = 0.9189385332046727; //0.5*Math.log(2*Math.PI)

          l += (t + 0.5) * Math.log(t);
          l -= t;
          var n2 = t * t;
          var np = t;
          var lm = 12 * np;
          var adj = 1 / lm;
          var l2 = l + adj;
          if (l2 == l) return OmegaNum.exp(l);
          l = l2;
          np *= n2;
          lm = 360 * np;
          adj = 1 / lm;
          l2 = l - adj;
          if (l2 == l) return OmegaNum.exp(l);
          l = l2;
          np *= n2;
          lm = 1260 * np;
          var lt = 1 / lm;
          l += lt;
          np *= n2;
          lm = 1680 * np;
          lt = 1 / lm;
          l -= lt;
          return OmegaNum.exp(l);
        } else return this.rec();
      }
    }, {
      key: "fact",
      value: function fact() {
        var x = this.clone();
        var f = OmegaNum.factorials;
        if (x.lt(OmegaNum.ZERO) || !x.isint()) return x.add(1).gamma();
        if (x.lte(170)) return new OmegaNum(f[+x]);
        var errorFixer = 1;
        return x.div(OmegaNum.E).pow(x).mul(x.mul(OmegaNum.PI).mul(2).sqrt()).times(errorFixer);
      }
    }, {
      key: "factorial",
      value: function factorial() {
        return this.fact();
      }
    }, {
      key: "pow",
      value: function pow(otherIn) {
        var other = new OmegaNum(otherIn);
        if (OmegaNum.debug >= OmegaNum.NORMAL) console.log(this + "^" + other);
        if (other.eq(OmegaNum.ZERO)) return OmegaNum.ONE.clone();
        if (other.eq(OmegaNum.ONE)) return this.clone();
        if (other.lt(OmegaNum.ZERO)) return this.pow(other.neg()).rec();

        if (this.lt(OmegaNum.ZERO) && other.isint()) {
          if (other.mod(2).lt(OmegaNum.ONE)) return this.abs().pow(other);
          return this.abs().pow(other).neg();
        }

        if (this.lt(OmegaNum.ZERO)) return OmegaNum.NaN.clone();
        if (this.eq(OmegaNum.ONE)) return OmegaNum.ONE.clone();
        if (this.eq(OmegaNum.ZERO)) return OmegaNum.ZERO.clone();
        if (this.max(other).gt(OmegaNum.TETRATED_MAX_SAFE_INTEGER)) return this.max(other);

        if (this.eq(10)) {
          if (other.gt(OmegaNum.ZERO)) {
            other.array[1] = other.array[1] + 1 || 1;
            other.standardize();
            return other;
          } else {
            return new OmegaNum(Math.pow(10, other.toNumber()));
          }
        }

        if (other.lt(OmegaNum.ONE)) return this.root(other.rec());
        var n = Math.pow(this.toNumber(), other.toNumber());
        if (n <= MAX_SAFE_INTEGER) return new OmegaNum(n);
        return OmegaNum.pow(10, this.log10().mul(other));
      }
    }, {
      key: "toPower",
      value: function toPower(other) {
        return this.pow(other);
      }
    }, {
      key: "exp",
      value: function exp() {
        return OmegaNum.pow(Math.E, this);
      }
    }, {
      key: "exponential",
      value: function exponential() {
        return this.exp();
      }
    }, {
      key: "sqrt",
      value: function sqrt() {
        return this.root(2);
      }
    }, {
      key: "squareRoot",
      value: function squareRoot() {
        return this.sqrt();
      }
    }, {
      key: "cbrt",
      value: function cbrt() {
        return this.root(3);
      }
    }, {
      key: "cubeRoot",
      value: function cubeRoot() {
        return this.cbrt();
      }
    }, {
      key: "root",
      value: function root(otherIn) {
        var other = new OmegaNum(otherIn);
        if (OmegaNum.debug >= OmegaNum.NORMAL) console.log(this + "root" + other);
        if (other.eq(OmegaNum.ONE)) return this.clone();
        if (other.lt(OmegaNum.ZERO)) return this.root(other.neg()).rec();
        if (other.lt(OmegaNum.ONE)) return this.pow(other.rec());
        if (this.lt(OmegaNum.ZERO) && other.isint() && other.mod(2).eq(OmegaNum.ONE)) return this.neg().root(other).neg();
        if (this.lt(OmegaNum.ZERO)) return OmegaNum.NaN.clone();
        if (this.eq(OmegaNum.ONE)) return OmegaNum.ONE.clone();
        if (this.eq(OmegaNum.ZERO)) return OmegaNum.ZERO.clone();
        if (this.max(other).gt(OmegaNum.TETRATED_MAX_SAFE_INTEGER)) return this.gt(other) ? this.clone() : OmegaNum.ZERO.clone();
        return OmegaNum.pow(10, this.log10().div(other));
      }
    }, {
      key: "log10",
      value: function log10() {
        var x = this.clone();
        if (OmegaNum.debug >= OmegaNum.NORMAL) console.log("log" + this);
        if (x.lt(OmegaNum.ZERO)) return OmegaNum.NaN.clone();
        if (x.eq(OmegaNum.ZERO)) return OmegaNum.NEGATIVE_INFINITY.clone();
        if (x.lte(OmegaNum.MAX_SAFE_INTEGER)) return new OmegaNum(Math.log10(x.toNumber()));
        if (!x.isFinite()) return x;
        if (x.gt(OmegaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
        x.array[1]--;
        return x.standardize();
      }
    }, {
      key: "generalLogarithm",
      value: function generalLogarithm() {
        return this.log10();
      }
    }, {
      key: "logBase",
      value: function logBase(base) {
        if (base === undefined) base = Math.E;
        return this.log10().div(OmegaNum.log10(base));
      }
    }, {
      key: "logarithm",
      value: function logarithm(base) {
        return this.logBase(base);
      }
    }, {
      key: "ln",
      value: function ln() {
        return this.logBase(Math.E);
      }
    }, {
      key: "log",
      value: function log() {
        return this.ln();
      }
    }, {
      key: "naturalLogarithm",
      value: function naturalLogarithm() {
        return this.ln();
      }
    }, {
      key: "lambertw",
      value: //All of these are from Patashu's break_eternity.js
      //The Lambert W function, also called the omega function or product logarithm, is the solution W(x) === x*e^x.
      //https://en.wikipedia.org/wiki/Lambert_W_function
      //Some special values, for testing: https://en.wikipedia.org/wiki/Lambert_W_function#Special_values
      function lambertw() {
        var x = this.clone();
        if (x.isNaN()) return x;
        if (x.lt(-0.3678794411710499)) throw Error("lambertw is unimplemented for results less than -1, sorry!");
        if (x.gt(OmegaNum.TETRATED_MAX_SAFE_INTEGER)) return x;

        if (x.gt(OmegaNum.EE_MAX_SAFE_INTEGER)) {
          x.array[1]--;
          return x;
        }

        if (x.gt(OmegaNum.MAX_SAFE_INTEGER)) return d_lambertw(x);else return new OmegaNum(f_lambertw(x.sign * x.array[0]));
      }
    }, {
      key: "tetr",
      value: //end break_eternity.js excerpt
      //Uses linear approximations for real height
      function tetr(otherIn, payloadIn) {
        if (payloadIn === undefined) payloadIn = OmegaNum.ONE;
        var t = this.clone();
        var other = new OmegaNum(otherIn);
        var payload = new OmegaNum(payloadIn);
        if (payload.neq(OmegaNum.ONE)) other = other.add(payload.slog(t));
        if (OmegaNum.debug >= OmegaNum.NORMAL) console.log(t + "^^" + other);
        var negln;
        if (t.isNaN() || other.isNaN() || payload.isNaN()) return OmegaNum.NaN.clone();

        if (other.isInfinite() && other.sign > 0) {
          if (t.gte(Math.exp(1 / Math.E))) return OmegaNum.POSITIVE_INFINITY.clone(); //Formula for infinite height power tower.

          negln = t.ln().neg();
          return negln.lambertw().div(negln);
        }

        if (other.lte(-2)) return OmegaNum.NaN.clone();

        if (t.eq(OmegaNum.ZERO)) {
          if (other.eq(OmegaNum.ZERO)) return OmegaNum.NaN.clone();
          if (other.mod(2).eq(OmegaNum.ZERO)) return OmegaNum.ZERO.clone();
          return OmegaNum.ONE.clone();
        }

        if (t.eq(OmegaNum.ONE)) {
          if (other.eq(OmegaNum.ONE.neg())) return OmegaNum.NaN.clone();
          return OmegaNum.ONE.clone();
        }

        if (other.eq(OmegaNum.ONE.neg())) return OmegaNum.ZERO.clone();
        if (other.eq(OmegaNum.ZERO)) return OmegaNum.ONE.clone();
        if (other.eq(OmegaNum.ONE)) return t;
        if (other.eq(2)) return t.pow(t);

        if (t.eq(2)) {
          if (other.eq(3)) return new OmegaNum(16);
          if (other.eq(4)) return new OmegaNum(65536);
        }

        var m = t.max(other);
        if (m.gt("10^^^" + MAX_SAFE_INTEGER)) return m;

        if (m.gt(OmegaNum.TETRATED_MAX_SAFE_INTEGER) || other.gt(OmegaNum.MAX_SAFE_INTEGER)) {
          if (this.lt(Math.exp(1 / Math.E))) {
            negln = t.ln().neg();
            return negln.lambertw().div(negln);
          }

          var j = t.slog(10).add(other);
          j.array[2] = (j.array[2] || 0) + 1;
          j.standardize();
          return j;
        }

        var y = other.toNumber();
        var f = Math.floor(y);
        var r = t.pow(y - f);
        var l = OmegaNum.NaN;

        for (var i = 0, m = OmegaNum.E_MAX_SAFE_INTEGER; f !== 0 && r.lt(m) && i < 100; ++i) {
          if (f > 0) {
            r = t.pow(r);

            if (l.eq(r)) {
              f = 0;
              break;
            }

            l = r;
            --f;
          } else {
            r = r.logBase(t);

            if (l.eq(r)) {
              f = 0;
              break;
            }

            l = r;
            ++f;
          }
        }

        if (i == 100 || this.lt(Math.exp(1 / Math.E))) f = 0;
        r.array[1] = r.array[1] + f || f;
        r.standardize();
        return r;
      }
    }, {
      key: "tetrate",
      value: function tetrate(other, payload) {
        return this.tetr(other, payload);
      }
    }, {
      key: "iteratedexp",
      value: //Implementation of functions from break_eternity.js
      function iteratedexp(other, payload) {
        return this.tetr(other, payload);
      }
    }, {
      key: "iteratedlog",
      value: //This implementation is highly inaccurate and slow, and probably be given custom code
      function iteratedlog(baseIn, otherIn) {
        if (baseIn === undefined) baseIn = 10;
        if (otherIn === undefined) otherIn = OmegaNum.ONE.clone();
        var t = this.clone();
        var base = new OmegaNum(baseIn);
        var other = new OmegaNum(otherIn);
        if (other.eq(OmegaNum.ZERO)) return t;
        if (other.eq(OmegaNum.ONE)) return t.logBase(base);
        return base.tetr(t.slog(base).sub(other));
      }
    }, {
      key: "layeradd",
      value: function layeradd(otherIn, baseIn) {
        if (baseIn === undefined) baseIn = 10;
        if (otherIn === undefined) otherIn = OmegaNum.ONE.clone();
        var t = this.clone();
        var base = new OmegaNum(baseIn);
        var other = new OmegaNum(otherIn);
        return base.tetr(t.slog(base).add(other));
      }
    }, {
      key: "layeradd10",
      value: function layeradd10(other) {
        return this.layeradd(other);
      }
    }, {
      key: "ssrt",
      value: //The super square-root function - what number, tetrated to height 2, equals this?
      //Other sroots are possible to calculate probably through guess and check methods, this one is easy though.
      //https://en.wikipedia.org/wiki/Tetration#Super-root
      function ssrt() {
        var x = this.clone();
        if (x.lt(Math.exp(-1 / Math.E))) return OmegaNum.NaN.clone();
        if (!x.isFinite()) return x;
        if (x.gt(OmegaNum.TETRATED_MAX_SAFE_INTEGER)) return x;

        if (x.gt(OmegaNum.EE_MAX_SAFE_INTEGER)) {
          x.array[1]--;
          return x;
        }

        var l = x.ln();
        return l.div(l.lambertw());
      }
    }, {
      key: "ssqrt",
      value: function ssqrt() {
        return this.ssrt();
      }
    }, {
      key: "slog",
      value: //Super-logarithm, one of tetration's inverses, tells you what size power tower you'd have to tetrate base to to get number. By definition, will never be higher than 1.8e308 in break_eternity.js, since a power tower 1.8e308 numbers tall is the largest representable number.
      //Uses linear approximation
      //https://en.wikipedia.org/wiki/Super-logarithm
      function slog(baseIn) {
        if (baseIn === undefined) baseIn = 10;
        var x = new OmegaNum(this);
        var base = new OmegaNum(baseIn);
        if (x.isNaN() || base.isNaN() || x.isInfinite() && base.isInfinite()) return OmegaNum.NaN.clone();
        if (x.isInfinite()) return x;
        if (base.isInfinite()) return OmegaNum.ZERO.clone();
        if (x.lt(OmegaNum.ZERO)) return OmegaNum.ONE.neg();
        if (x.eq(OmegaNum.ONE)) return OmegaNum.ZERO.clone();
        if (x.eq(base)) return OmegaNum.ONE.clone();

        if (base.lt(Math.exp(1 / Math.E))) {
          var a = OmegaNum.tetr(base, Infinity);
          if (x.eq(a)) return OmegaNum.POSITIVE_INFINITY.clone();
          if (x.gt(a)) return OmegaNum.NaN.clone();
        }

        if (x.max(base).gt("10^^^" + MAX_SAFE_INTEGER)) {
          if (x.gt(base)) return x;
          return OmegaNum.ZERO.clone();
        }

        if (x.max(base).gt(OmegaNum.TETRATED_MAX_SAFE_INTEGER)) {
          if (x.gt(base)) {
            x.array[2]--;
            x.standardize();
            return x.sub(x.array[1]);
          }

          return OmegaNum.ZERO.clone();
        }

        var r = 0;
        var t = (x.array[1] || 0) - (base.array[1] || 0);

        if (t > 3) {
          var l = t - 3;
          r += l;
          x.array[1] = x.array[1] - l;
        }

        for (var i = 0; i < 100; ++i) {
          if (x.lt(OmegaNum.ZERO)) {
            x = OmegaNum.pow(base, x);
            --r;
          } else if (x.lte(1)) {
            return new OmegaNum(r + x.toNumber() - 1);
          } else {
            ++r;
            x = OmegaNum.logBase(x, base);
          }
        }

        return new OmegaNum(r);
      }
    }, {
      key: "pent",
      value: //end break_eternity.js excerpt
      function pent(other) {
        return this.arrow(3)(other);
      }
    }, {
      key: "pentate",
      value: function pentate(other) {
        return this.pent(other);
      }
    }, {
      key: "arrow",
      value: //Uses linear approximations for real height
      function arrow(arrowsIn) {
        var t = this.clone();
        var arrows = new OmegaNum(arrowsIn);
        if (!arrows.isint() || arrows.lt(OmegaNum.ZERO)) return function (other) {
          return OmegaNum.NaN.clone();
        };
        if (arrows.eq(OmegaNum.ZERO)) return function (other) {
          return t.mul(other);
        };
        if (arrows.eq(OmegaNum.ONE)) return function (other) {
          return t.pow(other);
        };
        if (arrows.eq(2)) return function (other) {
          return t.tetr(other);
        };
        return function (otherIn) {
          var other = new OmegaNum(otherIn);
          if (OmegaNum.debug >= OmegaNum.NORMAL) console.log(t + "{" + arrows + "}" + other);
          if (other.lt(OmegaNum.ZERO)) return OmegaNum.NaN.clone();
          if (other.eq(OmegaNum.ZERO)) return OmegaNum.ONE.clone();
          if (other.eq(OmegaNum.ONE)) return t.clone();

          if (arrows.gte(OmegaNum.maxArrow)) {
            console.warn("Number too large to reasonably handle it: tried to " + arrows.add(2) + "-ate.");
            return OmegaNum.POSITIVE_INFINITY.clone();
          }

          var arrowsNum = arrows.toNumber();
          if (other.eq(2)) return t.arrow(arrows.sub(OmegaNum.ONE))(t);
          if (t.max(other).gt("10{" + (arrowsNum + 1) + "}" + MAX_SAFE_INTEGER)) return t.max(other);
          var r;

          if (t.gt("10{" + arrowsNum + "}" + MAX_SAFE_INTEGER) || other.gt(OmegaNum.MAX_SAFE_INTEGER)) {
            if (t.gt("10{" + arrowsNum + "}" + MAX_SAFE_INTEGER)) {
              r = t.clone();
              r.array[arrowsNum]--;
              r.standardize();
            } else if (t.gt("10{" + (arrowsNum - 1) + "}" + MAX_SAFE_INTEGER)) {
              r = new OmegaNum(t.array[arrowsNum - 1]);
            } else {
              r = OmegaNum.ZERO;
            }

            var j = r.add(other);
            j.array[arrowsNum] = (j.array[arrowsNum] || 0) + 1;
            j.standardize();
            return j;
          }

          var y = other.toNumber();
          var f = Math.floor(y);
          var arrows_m1 = arrows.sub(OmegaNum.ONE);
          r = t.arrow(arrows_m1)(y - f);

          for (var i = 0, m = new OmegaNum("10{" + (arrowsNum - 1) + "}" + MAX_SAFE_INTEGER); f !== 0 && r.lt(m) && i < 100; ++i) {
            if (f > 0) {
              r = t.arrow(arrows_m1)(r);
              --f;
            }
          }

          if (i == 100) f = 0;
          r.array[arrowsNum - 1] = r.array[arrowsNum - 1] + f || f;
          r.standardize();
          return r;
        };
      }
    }, {
      key: "chain",
      value: function chain(other, arrows) {
        return this.arrow(arrows)(other);
      }
    }, {
      key: "choose",
      value: function choose(other) {
        return OmegaNum.choose(this, other);
      } //end break_eternity.js excerpt

    }, {
      key: "standardize",
      value: function standardize() {
        var b;
        var x = this;
        if (OmegaNum.debug >= OmegaNum.ALL) console.log(x.toString());
        if (!x.array || !x.array.length) x.array = [0];

        if (x.sign != 1 && x.sign != -1) {
          if (typeof x.sign != "number") x.sign = Number(x.sign);
          x.sign = x.sign < 0 ? -1 : 1;
        }

        for (var l = x.array.length, i = 0; i < l; i++) {
          var e = x.array[i];

          if (e === null || e === undefined) {
            x.array[i] = 0;
            continue;
          }

          if (isNaN(e)) {
            x.array = [NaN];
            return x;
          }

          if (!isFinite(e)) {
            x.array = [Infinity];
            return x;
          }

          if (i !== 0 && !Number.isInteger(e)) x.array[i] = Math.floor(e);
        }

        do {
          if (OmegaNum.debug >= OmegaNum.ALL) console.log(x.toString());
          b = false;

          while (x.array.length && x.array[x.array.length - 1] === 0) {
            x.array.pop();
            b = true;
          }

          if (x.array[0] > MAX_SAFE_INTEGER) {
            x.array[1] = (x.array[1] || 0) + 1;
            x.array[0] = Math.log10(x.array[0]);
            b = true;
          }

          while (x.array[0] < MAX_E && x.array[1]) {
            x.array[0] = Math.pow(10, x.array[0]);
            x.array[1]--;
            b = true;
          }

          if (x.array.length > 2 && !x.array[1]) {
            for (i = 2; !x.array[i]; ++i) {
              continue;
            }

            x.array[i - 1] = x.array[0];
            x.array[0] = 1;
            x.array[i]--;
            b = true;
          }

          for (l = x.array.length, i = 1; i < l; ++i) {
            if (x.array[i] > MAX_SAFE_INTEGER) {
              x.array[i + 1] = (x.array[i + 1] || 0) + 1;
              x.array[0] = x.array[i] + 1;

              for (var j = 1; j <= i; ++j) {
                x.array[j] = 0;
              }

              b = true;
            }
          }
        } while (b);

        if (!x.array.length) x.array = [0];
        return x;
      }
    }, {
      key: "toNumber",
      value: function toNumber() {
        //console.log(this.array);
        if (this.sign == -1) return -1 * this.abs().toNumber();
        if (this.array.length >= 2 && (this.array[1] >= 2 || this.array[1] == 1 && this.array[0] > Math.log10(Number.MAX_VALUE))) return Infinity;
        if (this.array[1] == 1) return Math.pow(10, this.array[0]);
        return this.array[0];
      }
    }, {
      key: "toString",
      value: function toString() {
        if (this.sign == -1) return "-" + this.abs();
        if (isNaN(this.array[0])) return "NaN";
        if (!isFinite(this.array[0])) return "Infinity";
        var s = "";

        if (this.array.length >= 2) {
          for (var i = this.array.length - 1; i >= 2; --i) {
            var q = i >= 5 ? "{" + i + "}" : "^".repeat(i);
            if (this.array[i] > 1) s += "(10" + q + ")^" + this.array[i] + " ";else if (this.array[i] == 1) s += "10" + q;
          }
        }

        if (!this.array[1]) s += String(this.toNumber());else if (this.array[1] < 3) s += "e".repeat(this.array[1] - 1) + Math.pow(10, this.array[0] - Math.floor(this.array[0])) + "e" + Math.floor(this.array[0]);else if (this.array[1] < 8) s += "e".repeat(this.array[1]) + this.array[0];else s += "(10^)^" + this.array[1] + " " + this.array[0];
        return s;
      } //from break_eternity.js

    }, {
      key: "toStringWithDecimalPlaces",
      value: function toStringWithDecimalPlaces(places, applyToOpNums) {
        if (this.sign == -1) return "-" + this.abs();
        if (isNaN(this.array[0])) return "NaN";
        if (!isFinite(this.array[0])) return "Infinity";
        var b = 0;
        var s = "";
        var m = Math.pow(10, places);

        if (this.array.length >= 2) {
          for (var i = this.array.length - 1; !b && i >= 2; --i) {
            var x = this.array[i];

            if (applyToOpNums && x >= m) {
              ++i;
              b = x;
              x = 1;
            } else if (applyToOpNums && this.array[i - 1] >= m) {
              ++x;
              b = this.array[i - 1];
            }

            var q = i >= 5 ? "{" + i + "}" : "^".repeat(i);
            if (x > 1) s += "(10" + q + ")^" + x + " ";else if (x == 1) s += "10" + q;
          }
        }

        var k = this.array[0];
        var l = this.array[1] || 0;

        if (k > m) {
          k = Math.log10(k);
          ++l;
        }

        if (b) s += decimalPlaces(b, places);else if (!l) s += String(decimalPlaces(k, places));else if (l < 3) s += "e".repeat(l - 1) + decimalPlaces(Math.pow(10, k - Math.floor(k)), places) + "e" + decimalPlaces(Math.floor(k), places);else if (l < 8) s += "e".repeat(l) + decimalPlaces(k, places);else if (applyToOpNums) s += "(10^)^" + decimalPlaces(l, places) + " " + decimalPlaces(k, places);else s += "(10^)^" + l + " " + decimalPlaces(k, places);
        return s;
      } //these are from break_eternity.js as well

    }, {
      key: "toExponential",
      value: function toExponential(places, applyToOpNums) {
        if (this.array.length == 1) return (this.sign * this.array[0]).toExponential(places);
        return this.toStringWithDecimalPlaces(places, applyToOpNums);
      }
    }, {
      key: "toFixed",
      value: function toFixed(places, applyToOpNums) {
        if (this.array.length == 1) return (this.sign * this.array[0]).toFixed(places);
        return this.toStringWithDecimalPlaces(places, applyToOpNums);
      }
    }, {
      key: "toPrecision",
      value: function toPrecision(places, applyToOpNums) {
        if (this.array[0] === 0) return (this.sign * this.array[0]).toFixed(places - 1);
        if (this.array.length == 1 && this.array[0] < 1e-6) return this.toExponential(places - 1, applyToOpNums);
        if (this.array.length == 1 && places > Math.log10(this.array[0])) return this.toFixed(places - Math.floor(Math.log10(this.array[0])) - 1, applyToOpNums);
        return this.toExponential(places - 1, applyToOpNums);
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        return this.toString();
      } //Note: toArray() would be impossible without changing the layout of the array or lose the information about the sign

    }, {
      key: "toJSON",
      value: function toJSON() {
        if (OmegaNum.serializeMode == OmegaNum.JSON) {
          return {
            array: this.array.slice(0),
            sign: this.sign
          };
        } else if (OmegaNum.serializeMode == OmegaNum.STRING) {
          return this.toString();
        }
      }
    }, {
      key: "toHyperE",
      value: function toHyperE() {
        if (this.sign == -1) return "-" + this.abs().toHyperE();
        if (isNaN(this.array[0])) return "NaN";
        if (!isFinite(this.array[0])) return "Infinity";
        if (this.lt(OmegaNum.MAX_SAFE_INTEGER)) return String(this.array[0]);
        if (this.lt(OmegaNum.E_MAX_SAFE_INTEGER)) return "E" + this.array[0];
        var r = "E" + this.array[0] + "#" + this.array[1];

        for (var i = 2; i < this.array.length; ++i) {
          r += "#" + (this.array[i] + 1);
        }

        return r;
      }
    }, {
      key: "clone",
      value: function clone() {
        var temp = new OmegaNum();
        temp.array = this.array.slice(0);
        temp.sign = this.sign;
        return temp;
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

    }], [{
      key: "abs",
      value: function abs(x) {
        return new OmegaNum(x).abs();
      }
    }, {
      key: "absoluteValue",
      value: function absoluteValue(x) {
        return new OmegaNum(x).abs();
      }
    }, {
      key: "neg",
      value: function neg(x) {
        return new OmegaNum(x).neg();
      }
    }, {
      key: "negate",
      value: function negate(x) {
        return new OmegaNum(x).neg();
      }
    }, {
      key: "cmp",
      value: function cmp(x, y) {
        return new OmegaNum(x).cmp(y);
      }
    }, {
      key: "compare",
      value: function compare(x, y) {
        return new OmegaNum(x).cmp(y);
      }
    }, {
      key: "gt",
      value: function gt(x, y) {
        return new OmegaNum(x).gt(y);
      }
    }, {
      key: "greaterThan",
      value: function greaterThan(x, y) {
        return new OmegaNum(x).gt(y);
      }
    }, {
      key: "gte",
      value: function gte(x, y) {
        return new OmegaNum(x).gte(y);
      }
    }, {
      key: "greaterThanOrEqualTo",
      value: function greaterThanOrEqualTo(x, y) {
        return new OmegaNum(x).gte(y);
      }
    }, {
      key: "lt",
      value: function lt(x, y) {
        return new OmegaNum(x).lt(y);
      }
    }, {
      key: "lessThan",
      value: function lessThan(x, y) {
        return new OmegaNum(x).lt(y);
      }
    }, {
      key: "lte",
      value: function lte(x, y) {
        return new OmegaNum(x).lte(y);
      }
    }, {
      key: "lessThanOrEqualTo",
      value: function lessThanOrEqualTo(x, y) {
        return new OmegaNum(x).lte(y);
      }
    }, {
      key: "eq",
      value: function eq(x, y) {
        return new OmegaNum(x).eq(y);
      }
    }, {
      key: "equal",
      value: function equal(x, y) {
        return new OmegaNum(x).eq(y);
      }
    }, {
      key: "equalsTo",
      value: function equalsTo(x, y) {
        return new OmegaNum(x).eq(y);
      }
    }, {
      key: "neq",
      value: function neq(x, y) {
        return new OmegaNum(x).neq(y);
      }
    }, {
      key: "notEqual",
      value: function notEqual(x, y) {
        return new OmegaNum(x).neq(y);
      }
    }, {
      key: "notEqualsTo",
      value: function notEqualsTo(x, y) {
        return new OmegaNum(x).neq(y);
      }
    }, {
      key: "min",
      value: function min(x, y) {
        return new OmegaNum(x).min(y);
      }
    }, {
      key: "minimum",
      value: function minimum(x, y) {
        return new OmegaNum(x).min(y);
      }
    }, {
      key: "max",
      value: function max(x, y) {
        return new OmegaNum(x).max(y);
      }
    }, {
      key: "maximum",
      value: function maximum(x, y) {
        return new OmegaNum(x).max(y);
      }
    }, {
      key: "ispos",
      value: function ispos(x) {
        return new OmegaNum(x).ispos();
      }
    }, {
      key: "isPositive",
      value: function isPositive(x) {
        return new OmegaNum(x).ispos();
      }
    }, {
      key: "isneg",
      value: function isneg(x) {
        return new OmegaNum(x).isneg();
      }
    }, {
      key: "isNegative",
      value: function isNegative(x) {
        return new OmegaNum(x).isneg();
      }
    }, {
      key: "isNaN",
      value: function isNaN(x) {
        return new OmegaNum(x).isNaN();
      }
    }, {
      key: "isFinite",
      value: function isFinite(x) {
        return new OmegaNum(x).isFinite();
      }
    }, {
      key: "isInfinite",
      value: function isInfinite(x) {
        return new OmegaNum(x).isInfinite();
      }
    }, {
      key: "isint",
      value: function isint(x) {
        return new OmegaNum(x).isint();
      }
    }, {
      key: "isInteger",
      value: function isInteger(x) {
        return new OmegaNum(x).isint();
      }
    }, {
      key: "floor",
      value: function floor(x) {
        return new OmegaNum(x).floor();
      }
    }, {
      key: "ceil",
      value: function ceil(x) {
        return new OmegaNum(x).ceil();
      }
    }, {
      key: "ceiling",
      value: function ceiling(x) {
        return new OmegaNum(x).ceil();
      }
    }, {
      key: "round",
      value: function round(x) {
        return new OmegaNum(x).round();
      }
    }, {
      key: "add",
      value: function add(x, y) {
        return new OmegaNum(x).add(y);
      }
    }, {
      key: "plus",
      value: function plus(x, y) {
        return new OmegaNum(x).add(y);
      }
    }, {
      key: "sub",
      value: function sub(x, y) {
        return new OmegaNum(x).sub(y);
      }
    }, {
      key: "minus",
      value: function minus(x, y) {
        return new OmegaNum(x).sub(y);
      }
    }, {
      key: "mul",
      value: function mul(x, y) {
        return new OmegaNum(x).mul(y);
      }
    }, {
      key: "times",
      value: function times(x, y) {
        return new OmegaNum(x).mul(y);
      }
    }, {
      key: "div",
      value: function div(x, y) {
        return new OmegaNum(x).div(y);
      }
    }, {
      key: "divide",
      value: function divide(x, y) {
        return new OmegaNum(x).div(y);
      }
    }, {
      key: "rec",
      value: function rec(x) {
        return new OmegaNum(x).rec();
      }
    }, {
      key: "reciprocate",
      value: function reciprocate(x) {
        return new OmegaNum(x).rec();
      }
    }, {
      key: "mod",
      value: function mod(x, y) {
        return new OmegaNum(x).mod(y);
      }
    }, {
      key: "modular",
      value: function modular(x, y) {
        return new OmegaNum(x).mod(y);
      }
    }, {
      key: "gamma",
      value: function gamma(x) {
        return new OmegaNum(x).gamma();
      }
    }, {
      key: "fact",
      value: function fact(x) {
        return new OmegaNum(x).fact();
      }
    }, {
      key: "factorial",
      value: function factorial(x) {
        return new OmegaNum(x).fact();
      }
    }, {
      key: "pow",
      value: function pow(x, y) {
        return new OmegaNum(x).pow(y);
      }
    }, {
      key: "toPower",
      value: function toPower(x, y) {
        return new OmegaNum(x).pow(y);
      }
    }, {
      key: "exp",
      value: function exp(x) {
        return OmegaNum.pow(Math.E, x);
      }
    }, {
      key: "exponential",
      value: function exponential(x) {
        return new OmegaNum(x).exp();
      }
    }, {
      key: "sqrt",
      value: function sqrt(x) {
        return new OmegaNum(x).root(2);
      }
    }, {
      key: "squareRoot",
      value: function squareRoot(x) {
        return new OmegaNum(x).sqrt();
      }
    }, {
      key: "cbrt",
      value: function cbrt(x) {
        return new OmegaNum(x).root(3);
      }
    }, {
      key: "cubeRoot",
      value: function cubeRoot(x) {
        return new OmegaNum(x).cbrt();
      }
    }, {
      key: "root",
      value: function root(x, y) {
        return new OmegaNum(x).root(y);
      }
    }, {
      key: "log10",
      value: function log10(x) {
        return new OmegaNum(x).log10();
      }
    }, {
      key: "generalLogarithm",
      value: function generalLogarithm(x) {
        return new OmegaNum(x).log10();
      }
    }, {
      key: "logBase",
      value: function logBase(x, base) {
        return new OmegaNum(x).logBase(base);
      }
    }, {
      key: "logarithm",
      value: function logarithm(x, base) {
        return new OmegaNum(x).logBase(base);
      }
    }, {
      key: "ln",
      value: function ln(x) {
        return new OmegaNum(x).ln();
      }
    }, {
      key: "log",
      value: function log(x) {
        return new OmegaNum(x).ln();
      }
    }, {
      key: "naturalLogarithm",
      value: function naturalLogarithm(x) {
        return new OmegaNum(x).ln();
      }
    }, {
      key: "lambertw",
      value: function lambertw(x) {
        return new OmegaNum(x).lambertw();
      }
    }, {
      key: "tetr",
      value: function tetr(x, y, payload) {
        return new OmegaNum(x).tetr(y, payload);
      }
    }, {
      key: "tetrate",
      value: function tetrate(x, y, payload) {
        return new OmegaNum(x).tetr(y, payload);
      }
    }, {
      key: "iteratedexp",
      value: function iteratedexp(x, y, payload) {
        return new OmegaNum(x).iteratedexp(y, payload);
      }
    }, {
      key: "iteratedlog",
      value: function iteratedlog(x, y, z) {
        return new OmegaNum(x).iteratedlog(y, z);
      }
    }, {
      key: "layeradd",
      value: function layeradd(x, y, z) {
        return new OmegaNum(x).layeradd(y, z);
      }
    }, {
      key: "layeradd10",
      value: function layeradd10(x, y) {
        return new OmegaNum(x).layeradd10(y);
      }
    }, {
      key: "ssrt",
      value: function ssrt(x) {
        return new OmegaNum(x).ssqrt();
      }
    }, {
      key: "ssqrt",
      value: function ssqrt(x) {
        return new OmegaNum(x).ssrt();
      }
    }, {
      key: "slog",
      value: function slog(x, y) {
        return new OmegaNum(x).slog(y);
      }
    }, {
      key: "pent",
      value: function pent(x, y) {
        return OmegaNum.arrow(x, 3, y);
      }
    }, {
      key: "pentate",
      value: function pentate(x, y) {
        return new OmegaNum(x).pent(y);
      }
    }, {
      key: "arrow",
      value: function arrow(x, z, y) {
        return new OmegaNum(x).arrow(z)(y);
      }
    }, {
      key: "chain",
      value: function chain(x, y, z) {
        return new OmegaNum(x).arrow(z)(y);
      }
    }, {
      key: "hyper",
      value: function hyper(zIn) {
        var z = new OmegaNum(zIn);
        if (z.eq(OmegaNum.ZERO)) return function (x, y) {
          return new OmegaNum(y).eq(OmegaNum.ZERO) ? new OmegaNum(x) : new OmegaNum(x).add(OmegaNum.ONE);
        };
        if (z.eq(OmegaNum.ONE)) return function (x, y) {
          return OmegaNum.add(x, y);
        };
        return function (x, y) {
          return new OmegaNum(x).arrow(z.sub(2))(y);
        };
      } // All of these are from Patashu's break_eternity.js

    }, {
      key: "affordGeometricSeries",
      value: function affordGeometricSeries(resourcesAvailableIn, priceStartIn, priceRatioIn, currentOwned) {
        /*
          If you have resourcesAvailable, the price of something starts at
          priceStart, and on each purchase it gets multiplied by priceRatio,
          and you have already bought currentOwned, how many of the object
          can you buy.
        */
        var resourcesAvailable = new OmegaNum(resourcesAvailableIn);
        var priceStart = new OmegaNum(priceStartIn);
        var priceRatio = new OmegaNum(priceRatioIn);
        var actualStart = priceStart.mul(priceRatio.pow(currentOwned));
        return OmegaNum.floor(resourcesAvailable.div(actualStart).mul(priceRatio.sub(OmegaNum.ONE)).add(OmegaNum.ONE).log10().div(priceRatio.log10()));
      }
    }, {
      key: "affordArithmeticSeries",
      value: function affordArithmeticSeries(resourcesAvailableIn, priceStartIn, priceAddIn, currentOwnedIn) {
        /*
          If you have resourcesAvailable, the price of something starts at
          priceStart, and on each purchase it gets increased by priceAdd,
          and you have already bought currentOwned, how many of the object
          can you buy.
        */
        var resourcesAvailable = new OmegaNum(resourcesAvailableIn);
        var priceStart = new OmegaNum(priceStartIn);
        var priceAdd = new OmegaNum(priceAddIn);
        var currentOwned = new OmegaNum(currentOwnedIn);
        var actualStart = priceStart.add(currentOwned.mul(priceAdd));
        var b = actualStart.sub(priceAdd.div(2));
        var b2 = b.pow(2);
        return b.neg().add(b2.add(priceAdd.mul(resourcesAvailable).mul(2)).sqrt()).div(priceAdd).floor();
      }
    }, {
      key: "sumGeometricSeries",
      value: function sumGeometricSeries(numItems, priceStartIn, priceRatioIn, currentOwned) {
        /*
          If you want to buy numItems of something, the price of something starts at
          priceStart, and on each purchase it gets multiplied by priceRatio,
          and you have already bought currentOwned, what will be the price of numItems
          of something.
        */
        var priceStart = new OmegaNum(priceStartIn);
        var priceRatio = new OmegaNum(priceRatioIn);
        return priceStart.mul(priceRatio.pow(currentOwned)).mul(OmegaNum.sub(OmegaNum.ONE, priceRatio.pow(numItems))).div(OmegaNum.sub(OmegaNum.ONE, priceRatio));
      }
    }, {
      key: "sumArithmeticSeries",
      value: function sumArithmeticSeries(numItemsIn, priceStartIn, priceAdd, currentOwnedIn) {
        /*
          If you want to buy numItems of something, the price of something starts at
          priceStart, and on each purchase it gets increased by priceAdd,
          and you have already bought currentOwned, what will be the price of numItems
          of something.
        */
        var numItems = new OmegaNum(numItemsIn);
        var priceStart = new OmegaNum(priceStartIn);
        var currentOwned = new OmegaNum(currentOwnedIn);
        var actualStart = priceStart.add(currentOwned.mul(priceAdd));
        return numItems.div(2).mul(actualStart.mul(2).plus(numItems.sub(OmegaNum.ONE).mul(priceAdd)));
      } // Binomial Coefficients n choose k

    }, {
      key: "choose",
      value: function choose(n, k) {
        /*
          If you have n items and you take k out,
          how many ways could you do this?
        */
        return new OmegaNum(n).factorial().div(new OmegaNum(k).factorial().mul(new OmegaNum(n).sub(new OmegaNum(k)).factorial()));
      }
    }, {
      key: "fromNumber",
      value: function fromNumber(input) {
        if (typeof input != "number") throw Error(invalidArgument + "Expected Number");
        var x = new OmegaNum();
        x.array[0] = Math.abs(input);
        x.sign = input < 0 ? -1 : 1;
        x.standardize();
        return x;
      }
    }, {
      key: "fromString",
      value: function fromString(input) {
        var _a;

        if (typeof input != "string") throw Error(invalidArgument + "Expected String");
        var isJSON = false;

        if (typeof input == "string" && (input[0] == "[" || input[0] == "{")) {
          try {
            JSON.parse(input);
          } finally {
            isJSON = true;
          }
        }

        if (isJSON) {
          return OmegaNum.fromJSON(input);
        }

        var x = new OmegaNum();
        x.array = [0];

        if (!isOmegaNum.test(input)) {
          console.warn(omegaNumError + "Malformed input: " + input);
          x.array = [NaN];
          return x;
        }

        var negateIt = false;

        if (input[0] == "-" || input[0] == "+") {
          var numSigns = input.search(/[^-\+]/);
          var signs = input.substring(0, numSigns);
          negateIt = (((_a = signs.match(/-/g)) === null || _a === void 0 ? void 0 : _a.length) || 0) % 2 == 1;
          input = input.substring(numSigns);
        }

        if (input == "NaN") x.array = [NaN];else if (input == "Infinity") x.array = [Infinity];else {
          var a, b, c, d, i;

          while (input) {
            if (/^\(?10[\^\{]/.test(input)) {
              if (input[0] == "(") {
                input = input.substring(1);
              }

              var arrows;

              if (input[2] == "^") {
                a = input.substring(2).search(/[^\^]/);
                arrows = a;
                b = a + 2;
              } else {
                a = input.indexOf("}");
                arrows = Number(input.substring(3, a));
                b = a + 1;
              }

              if (arrows >= OmegaNum.maxArrow) {
                console.warn("Number too large to reasonably handle it: tried to " + (arrows + 2) + "-ate.");
                x.array = [Infinity];
                break;
              }

              input = input.substring(b);

              if (input[0] == ")") {
                a = input.indexOf(" ");
                c = Number(input.substring(2, a));
                input = input.substring(a + 1);
              } else {
                c = 1;
              }

              if (arrows == 1) {
                x.array[1] = (x.array[1] || 0) + c;
              } else if (arrows == 2) {
                a = x.array[1] || 0;
                b = x.array[0] || 0;
                if (b >= 1e10) ++a;
                if (b >= 10) ++a;
                x.array[0] = a;
                x.array[1] = 0;
                x.array[2] = (x.array[2] || 0) + c;
              } else {
                a = x.array[arrows - 1] || 0;
                b = x.array[arrows - 2] || 0;
                if (b >= 10) ++a;

                for (i = 1; i < arrows; ++i) {
                  x.array[i] = 0;
                }

                x.array[0] = a;
                x.array[arrows] = (x.array[arrows] || 0) + c;
              }
            } else {
              break;
            }
          }

          a = input.split(/[Ee]/);
          b = [x.array[0], 0];
          c = 1;

          for (i = a.length - 1; i >= 0; --i) {
            if (a[i]) d = Number(a[i]);else d = 1; //The things that are already there

            if (b[0] < MAX_E && b[1] === 0) {
              b[0] = Math.pow(10, c * b[0]);
            } else if (c == -1) {
              if (b[1] === 0) {
                b[0] = Math.pow(10, c * b[0]);
              } else if (b[1] == 1 && b[0] <= Math.log10(Number.MAX_VALUE)) {
                b[0] = Math.pow(10, c * Math.pow(10, b[0]));
              } else {
                b[0] = 0;
              }

              b[1] = 0;
            } else {
              b[1]++;
            } //Multiplying coefficient


            if (b[1] === 0) {
              b[0] *= Number(d);
            } else if (b[1] == 1) {
              b[0] += Math.log10(Number(d));
            } else if (b[1] == 2 && b[0] < MAX_E + Math.log10(Math.log10(Number(d)))) {
              b[0] += Math.log10(1 + Math.pow(10, Math.log10(Math.log10(Number(d))) - b[0]));
            } //Carrying


            if (b[0] < MAX_E && b[1]) {
              b[0] = Math.pow(10, b[0]);
              b[1]--;
            } else if (b[0] > MAX_SAFE_INTEGER) {
              b[0] = Math.log10(b[0]);
              b[1]++;
            }
          }

          x.array[0] = b[0];
          x.array[1] = (x.array[1] || 0) + b[1];
        }
        if (negateIt) x.sign *= -1;
        x.standardize();
        return x;
      }
    }, {
      key: "fromArray",
      value: function fromArray(input1, input2) {
        var array, sign;

        if (input1 instanceof Array && (input2 === undefined || typeof input2 == "number")) {
          array = input1;
          sign = input2;
        } else if (input2 instanceof Array && typeof input1 == "number") {
          array = input2;
          sign = input1;
        } else {
          throw Error(invalidArgument + "Expected an Array [and Boolean]");
        }

        var x = new OmegaNum();
        x.array = array.slice(0);
        if (sign) x.sign = Number(sign);else x.sign = 1;
        x.standardize();
        return x;
      }
    }, {
      key: "fromObject",
      value: function fromObject(input) {
        if (_typeof(input) != "object") throw Error(invalidArgument + "Expected Object");
        if (input === null) return OmegaNum.ZERO.clone();
        if (input instanceof Array) return OmegaNum.fromArray(input);
        if (input instanceof OmegaNum) return new OmegaNum(input);
        if (!(input.array instanceof Array)) throw Error(invalidArgument + "Expected that property 'array' exists");
        if (input.sign !== undefined && typeof input.sign != "number") throw Error(invalidArgument + "Expected that property 'sign' is Number");
        var x = new OmegaNum();
        x.array = input.array.slice(0);
        x.sign = Number(input.sign) || 1;
        x.standardize();
        return x;
      }
    }, {
      key: "fromJSON",
      value: function fromJSON(input) {
        if (_typeof(input) == "object") return OmegaNum.fromObject(input);
        if (typeof input != "string") throw Error(invalidArgument + "Expected String");
        var parsedObject, x;

        try {
          parsedObject = JSON.parse(input);
        } catch (e) {
          parsedObject = null;
          throw e;
        } finally {
          x = OmegaNum.fromObject(parsedObject);
        }

        parsedObject = null;
        return x;
      }
    }, {
      key: "fromHyperE",
      value: function fromHyperE(input) {
        var _a;

        if (typeof input != "string") throw Error(invalidArgument + "Expected String");
        var x = new OmegaNum();
        x.array = [0];

        if (!/^[-\+]*(0|[1-9]\d*(\.\d*)?|Infinity|NaN|E[1-9]\d*(\.\d*)?(#[1-9]\d*)*)$/.test(input)) {
          console.warn(omegaNumError + "Malformed input: " + input);
          x.array = [NaN];
          return x;
        }

        var negateIt = false;

        if (input[0] == "-" || input[0] == "+") {
          var numSigns = input.search(/[^-\+]/);
          var signs = input.substring(0, numSigns);
          negateIt = (((_a = signs.match(/-/g)) === null || _a === void 0 ? void 0 : _a.length) || 0) % 2 === 0;
          input = input.substring(numSigns);
        }

        if (input == "NaN") x.array = [NaN];else if (input == "Infinity") x.array = [Infinity];else if (input[0] != "E") {
          x.array[0] = Number(input);
        } else if (input.indexOf("#") == -1) {
          x.array[0] = Number(input.substring(1));
          x.array[1] = 1;
        } else {
          var array = input.substring(1).split("#");

          for (var i = 0; i < array.length; ++i) {
            var t = Number(array[i]);

            if (i >= 2) {
              --t;
            }

            x.array[i] = t;
          }
        }
        if (negateIt) x.sign *= -1;
        x.standardize();
        return x;
      }
    }, {
      key: "config",
      value: function config(obj) {
        if (!obj || _typeof(obj) !== 'object') {
          throw Error(omegaNumError + 'Object expected');
        }

        var i,
            p,
            v,
            ps = ['maxArrow', 1, Number.MAX_SAFE_INTEGER, 'serializeMode', 0, 1, 'debug', 0, 2];

        for (i = 0; i < ps.length; i += 3) {
          if ((v = obj[p = ps[i]]) !== void 0) {
            //@ts-ignore
            if (Math.floor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;else throw Error(invalidArgument + p + ': ' + v);
          }
        }

        return this;
      } // Create and configure initial OmegaNum constructor.

    }, {
      key: "default",
      get: function get() {
        return this;
      }
    }, {
      key: "OmegaNum",
      get: function get() {
        return this;
      }
    }, {
      key: "set",
      value: function set(obj) {
        this.config(obj);
      }
    }]);

    return OmegaNum;
  }();
  OmegaNum.maxArrow = 1e3;
  OmegaNum.serializeMode = 0;
  OmegaNum.debug = 0;
  OmegaNum.ZERO = new OmegaNum(0);
  OmegaNum.ONE = new OmegaNum(1);
  OmegaNum.E = new OmegaNum(Math.E);
  OmegaNum.LN2 = new OmegaNum(Math.LN2);
  OmegaNum.LN10 = new OmegaNum(Math.LN10);
  OmegaNum.LOG2E = new OmegaNum(Math.LOG2E);
  OmegaNum.LOG10E = new OmegaNum(Math.LOG10E);
  OmegaNum.PI = new OmegaNum(Math.PI);
  OmegaNum.SQRT1_2 = new OmegaNum(Math.SQRT1_2);
  OmegaNum.SQRT2 = new OmegaNum(Math.SQRT2);
  OmegaNum.MAX_SAFE_INTEGER = new OmegaNum(MAX_SAFE_INTEGER);
  OmegaNum.MIN_SAFE_INTEGER = new OmegaNum(Number.MIN_SAFE_INTEGER);
  OmegaNum.NaN = new OmegaNum(Number.NaN);
  OmegaNum.NEGATIVE_INFINITY = new OmegaNum(Number.NEGATIVE_INFINITY);
  OmegaNum.POSITIVE_INFINITY = new OmegaNum(Number.POSITIVE_INFINITY);
  OmegaNum.E_MAX_SAFE_INTEGER = new OmegaNum("e" + MAX_SAFE_INTEGER);
  OmegaNum.EE_MAX_SAFE_INTEGER = new OmegaNum("ee" + MAX_SAFE_INTEGER);
  OmegaNum.TETRATED_MAX_SAFE_INTEGER = new OmegaNum("10^^" + MAX_SAFE_INTEGER); //end break_eternity.js excerpt

  OmegaNum.factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000, 51090942171709440000, 1.1240007277776076800e+21, 2.5852016738884978213e+22, 6.2044840173323941000e+23, 1.5511210043330986055e+25, 4.0329146112660565032e+26, 1.0888869450418351940e+28, 3.0488834461171387192e+29, 8.8417619937397018986e+30, 2.6525285981219106822e+32, 8.2228386541779224302e+33, 2.6313083693369351777e+35, 8.6833176188118859387e+36, 2.9523279903960415733e+38, 1.0333147966386145431e+40, 3.7199332678990125486e+41, 1.3763753091226345579e+43, 5.2302261746660111714e+44, 2.0397882081197444123e+46, 8.1591528324789768380e+47, 3.3452526613163807956e+49, 1.4050061177528799549e+51, 6.0415263063373834074e+52, 2.6582715747884488694e+54, 1.1962222086548018857e+56, 5.5026221598120891536e+57, 2.5862324151116817767e+59, 1.2413915592536072528e+61, 6.0828186403426752249e+62, 3.0414093201713375576e+64, 1.5511187532873821895e+66, 8.0658175170943876846e+67, 4.2748832840600254848e+69, 2.3084369733924137924e+71, 1.2696403353658276447e+73, 7.1099858780486348103e+74, 4.0526919504877214100e+76, 2.3505613312828784949e+78, 1.3868311854568983861e+80, 8.3209871127413898951e+81, 5.0758021387722483583e+83, 3.1469973260387939390e+85, 1.9826083154044400850e+87, 1.2688693218588416544e+89, 8.2476505920824715167e+90, 5.4434493907744306945e+92, 3.6471110918188683221e+94, 2.4800355424368305480e+96, 1.7112245242814129738e+98, 1.1978571669969892213e+100, 8.5047858856786230047e+101, 6.1234458376886084639e+103, 4.4701154615126843855e+105, 3.3078854415193862416e+107, 2.4809140811395399745e+109, 1.8854947016660503806e+111, 1.4518309202828587210e+113, 1.1324281178206296794e+115, 8.9461821307829757136e+116, 7.1569457046263805709e+118, 5.7971260207473678414e+120, 4.7536433370128420198e+122, 3.9455239697206587884e+124, 3.3142401345653531943e+126, 2.8171041143805501310e+128, 2.4227095383672734128e+130, 2.1077572983795278544e+132, 1.8548264225739843605e+134, 1.6507955160908460244e+136, 1.4857159644817615149e+138, 1.3520015276784029158e+140, 1.2438414054641308179e+142, 1.1567725070816415659e+144, 1.0873661566567430754e+146, 1.0329978488239059305e+148, 9.9167793487094964784e+149, 9.6192759682482120384e+151, 9.4268904488832479837e+153, 9.3326215443944153252e+155, 9.3326215443944150966e+157, 9.4259477598383598816e+159, 9.6144667150351270793e+161, 9.9029007164861804721e+163, 1.0299016745145628100e+166, 1.0813967582402909767e+168, 1.1462805637347083683e+170, 1.2265202031961380050e+172, 1.3246418194518290179e+174, 1.4438595832024936625e+176, 1.5882455415227430287e+178, 1.7629525510902445874e+180, 1.9745068572210740115e+182, 2.2311927486598137657e+184, 2.5435597334721876552e+186, 2.9250936934930159967e+188, 3.3931086844518980862e+190, 3.9699371608087210616e+192, 4.6845258497542909237e+194, 5.5745857612076058231e+196, 6.6895029134491271205e+198, 8.0942985252734440920e+200, 9.8750442008336010580e+202, 1.2146304367025329301e+205, 1.5061417415111409314e+207, 1.8826771768889261129e+209, 2.3721732428800468512e+211, 3.0126600184576594309e+213, 3.8562048236258040716e+215, 4.9745042224772874590e+217, 6.4668554892204741474e+219, 8.4715806908788206314e+221, 1.1182486511960043298e+224, 1.4872707060906857134e+226, 1.9929427461615187928e+228, 2.6904727073180504073e+230, 3.6590428819525488642e+232, 5.0128887482749919605e+234, 6.9177864726194885808e+236, 9.6157231969410893532e+238, 1.3462012475717525742e+241, 1.8981437590761708898e+243, 2.6953641378881628530e+245, 3.8543707171800730787e+247, 5.5502938327393044385e+249, 8.0479260574719917061e+251, 1.1749972043909107097e+254, 1.7272458904546389230e+256, 2.5563239178728653927e+258, 3.8089226376305697893e+260, 5.7133839564458546840e+262, 8.6272097742332399855e+264, 1.3113358856834524492e+267, 2.0063439050956822953e+269, 3.0897696138473507759e+271, 4.7891429014633940780e+273, 7.4710629262828942235e+275, 1.1729568794264144743e+278, 1.8532718694937349890e+280, 2.9467022724950384028e+282, 4.7147236359920616095e+284, 7.5907050539472189932e+286, 1.2296942187394494177e+289, 2.0044015765453026266e+291, 3.2872185855342959088e+293, 5.4239106661315886750e+295, 9.0036917057784375454e+297, 1.5036165148649991456e+300, 2.5260757449731984219e+302, 4.2690680090047051083e+304, 7.2574156153079990350e+306];
  OmegaNum.JSON = 0;
  OmegaNum.STRING = 1;
  OmegaNum.NONE = 0;
  OmegaNum.NORMAL = 1;
  OmegaNum.ALL = 2;

  return OmegaNum;

}));
