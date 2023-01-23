# OmegaNum.js changelog

## 0.5.7 - 2022/08/15

* Fixed `a{n}b` when `10{n}10{n}MSI<a<=10{n+1}MSI` and `MSI<=b<10{n}10{n}a` ([ExpantaNum.js#20](https://github.com/Naruyoko/ExpantaNum.js/issues/20)).
* Compacted factorials LUT, reducing un-minified file size.

## 0.5.6 - 2020/08/19

* Fixed arithmetic above MSI being imprecise.

## 0.5.5 - 2020/08/07

* Fixed decimal array element.

## 0.5.4 - 2020/07/11

* Added `0` times and `1` time logs case for `iteratedLog`.

## 0.5.3 - 2020/05/30

* Fixed `a{n}b` for `10{n}MSI<a<=10{n+1}MSI` and `b<MSI`.

## 0.5.2 - 2020/05/23

* Fixed `tetr` and up returning non-`NaN` for special cases involving `NaN`.

## 0.5.1 - 2020/05/10

* Very small optimizations.

## 0.5.0 - 2020/03/27

* Added `iteratedexp`, `iteratedlog`, `layeradd`, and `layeradd10`.
* Added voluntary `payload` argument to `tetr`.

## 0.4.3 - 2020/03/25

* Fixed `ExpantaNum.MAX_SAFE_INTEGER.log10()` being irregular form.

## 0.4.2 - 2020/03/23

* Fixed `toPrecision` wrongfully using `toExponential` for `0`.

## 0.4.1 - 2020/03/23

* Fixed `toStringWithDecimalPlaces` giving wrong iterations if the strongest operator is above maximum of places and `applyToOpNums` is enabled.

## 0.4.0 - 2020/03/23

* Added an option to use `toString` method instead of returning JSON object for `toJSON`.
* Added `valueOf`, `toStringWithDecimalPlaces`, `toExponential`, `toFixed`, and `toPrecision`.

## 0.3.1 - 2020/03/16

* Fixed `pent` and higher hyperoperators returning `NaN` if the base is between 10{c-1}MAX_SAFE_INTEGER and 10{c}MAX_SAFE_INTEGER, and the second operand is greater than MAX_SAFE_INTEGER.
* Allowed inputting `Object` to `fromJSON`.

## 0.3.0 - 2020/02/23

* Added `notEqualTo` `notEqual` `neq`.
* Fixed some constants used within not being `OmegaNum`.
* Made built-in constants enumerable.
* Added link to [ExpantaNum.js](https://github.com/Naruyoko/ExpantaNum.js) in [README.md](https://github.com/Naruyoko/OmegaNum.js/blob/master/README.md).

## 0.2.6 - 2020/01/28

* Added many constants, which can be used outside of the library.
* Replaced many magic numbers used with the said library, calling the constructor less often.

## 0.2.5 - 2020/01/15

* Fixed very high finite height tetration with base less than e^(1/e) [#31](https://github.com/Naruyoko/OmegaNum.js/issues/31).

## 0.2.4 - 2020/01/11

* Fixed certain decimals and omitting of zeros in `fromString` resulting in `Malformed input` error [#30](https://github.com/Naruyoko/OmegaNum.js/issues/30).

## 0.2.3 - 2019/12/18

* Slight optimizations for higher hyperoperators.

## 0.2.2 - 2019/12/07 HOTFIX

* Fixed line 677.

## 0.2.1 - 2019/12/07

* Fixed `tetr` and other hyperoperators returning incorrect results for `other`>`9007199254740991`.
* Slightly optimized `toNumber`.
* Removed `Object.assign` in favor of compatibility.

## 0.2.0 - 2019/12/01

* Expanded all hyperoperators to real height.
* Fixed `pent` and above sometimes returning `NaN`.

## 0.1.1 - 2019/11/28

* Many optimizations. See diff for what I did.

## 0.1.0 - 2019/11/27

* Added `gamma`, `lambertw`, `ssrt`, and `slog` (pulled straight from [break_eternity.js](https://github.com/Patashu/break_eternity.js)).
* Expanded `fact` to real values.
* Expanded `tetr` to real and infinite height.

## 0.0.1 - 2019/11/10

* Fixed `affordGeometricSeries`, `affordArithmeticSeries`, `sumGeometricSeries`, and `sumArithmeticSeries` putting wrong variables through constructor.
* Removed `String.prototype.includes`(ES2015) and `Array.prototype.includes`(ES2016) to increase coverage.

## 0.0.0 - 2019/11/08

* Replaced `toJSON` with what `toObject` used to be, `toObject` removed.
* Fixed misspell in function `standarlize`, replaced with `standardize`.
* Removed from alpha stage, entered development stage.
* Uploaded to `npm`. [See here](https://www.npmjs.com/package/omega_num.js).

## α 1.0.2.9 - 2019/11/07

* No duplicate codes in the main constructor and `fromSomething` functions.
* Added `new` on all constructor call. It is not required to be this way.
* Optimized `add` and `sub`.

## α 1.0.2.8 - 2019/11/06

* Fixed `affordGeometricSeries`, `affordArithmeticSeries`, `sumGeometricSeries`, and `sumArithmeticSeries` being broken if fed non-OmegaNum.
* Slightly optimized constructor when fed OmegaNum.

## α 1.0.2.7 - 2019/11/03

* Added `isInfinite`.
* Fixed `standarlize`.
* Slightly optimised `divide`.

## α 1.0.2.6 - 2019/11/01

* Fixed `Infinity` being less than `Number.MAX_SAFE_INTEGER+1`
* Fixed `-0` being less than `0`
* Fixed `fromString` being stupid [#29](https://github.com/Naruyoko/OmegaNum.js/issues/29).

## α 1.0.2.5 - 2019/10/31

* Fixed having `10^` not being counted in `fromString`.
* Made `logarithm` and `logBase` use natural logarithm if it recieved not base.
* Fixed logarithm of `Infinity` being `undefined`
* Fixed `eq` thinking that `NaN`=`0`
* Fixed `Infinity` and `NaN` being broken in some functions

## α 1.0.2.4 - 2019/10/20

* (Potentially) fixed memory leak. Now [TrueInfinity](https://reinhardt-c.github.io/TrueInfinity/) won't have 0.2 fps DevTools and >50MB heap.

## α 1.0.2.3 - 2019/10/19

* Added `fromJSON`.
* Added `toHyperE` and `fromHyperE`.
* Fixed multiple signs being not handled correctly in `fromString`
* Made code more safer in terms of stability(not regarding speed btw).

## α 1.0.2.2 - 2019/10/18

* Fixed and redesigned `fromString`'s logic [#26](https://github.com/Naruyoko/OmegaNum.js/issues/26).
* Fixed `fromNumber, fromString, fromArray, fromObject` being a non-static method.
* Fixed typo that broke the library [#27](https://github.com/Naruyoko/OmegaNum.js/issues/27).

## α 1.0.2.1

* Added `toObject, toJSON, fromNumber, fromString, fromArray, fromObject`
* Allowed creating `OmegaNum` from `Array` to have an additional variable of type `number` for `sign`, which can be placed either way.
* Allowed creating `OmegaNum` from `Object` that is not `OmegaNum`.

## α 1.0.2 - 2019/10/12

* Added `affordGeometricSeries, affordArithmeticSeries, sumGeometricSeries, sumArithmeticSeries` [#19](https://github.com/Naruyoko/OmegaNum.js/pull/19) `choose` [#21](https://github.com/Naruyoko/OmegaNum.js/pull/21) by Reinhardt-C.
* Fixed `tetr` and `arrow` being broken on large base [#17](https://github.com/Naruyoko/OmegaNum.js/issues/17).
* Fixed NaN returning NaN if the first argument is `0` [#22](https://github.com/Naruyoko/OmegaNum.js/issues/22).
* Fixed having something over tetration in string or array causes wrong results because I went stupid in `standarlize()` [#23](https://github.com/Naruyoko/OmegaNum.js/issues/23) [#25](https://github.com/Naruyoko/OmegaNum.js/issues/25).

## α 1.0.1.6 - 2019/05/26

* Added factorial `factorial` `fact`.

## α 1.0.1.5 - 2019/04/20

* Added exponential function `exponential` `exp`.
* Added pentation `pentation` `pent`.

## α 1.0.1.4 - 2019/04/15

* Fixed a bug which incorrectly overriden and `undefined` the static variables, making some methods such as `arrows` unusable.
* Unmatched tags in [README.md](https://github.com/Naruyoko/OmegaNum.js/blob/master/README.md) fixes.

## α 1.0.1.3 - 2019/04/09

* [#12](https://github.com/Naruyoko/OmegaNum.js/issues/12)'s `root` and `modulo` fix.
* `OmegaNum(NaN).toString="Infinity"` bug fix.

## α 1.0.1.2 - 2019/04/05

* Nice. [#12](https://github.com/Naruyoko/OmegaNum.js/issues/12)

## α 1.0.1.1 - 2019/04/02

* Welp, let's fix another bug in [#3](https://github.com/Naruyoko/OmegaNum.js/issues/3) and [#4](https://github.com/Naruyoko/OmegaNum.js/issues/4).

## α 1.0.1 - 2019/04/01

* [README.md](https://github.com/Naruyoko/OmegaNum.js/blob/master/README.md) fixes. ([#1](https://github.com/Naruyoko/OmegaNum.js/pull/1) [#2](https://github.com/Naruyoko/OmegaNum.js/pull/2) [#11](https://github.com/Naruyoko/OmegaNum.js/pull/11))
* Bugs. Like, 7 of them. ([#3](https://github.com/Naruyoko/OmegaNum.js/issues/3) [#4](https://github.com/Naruyoko/OmegaNum.js/issues/4) [#5](https://github.com/Naruyoko/OmegaNum.js/issues/5) [#6](https://github.com/Naruyoko/OmegaNum.js/issues/6) [#7](https://github.com/Naruyoko/OmegaNum.js/issues/7) [#8](https://github.com/Naruyoko/OmegaNum.js/issues/8) [#9](https://github.com/Naruyoko/OmegaNum.js/issues/9)). Oh, they are all by [Patashu](https://github.com/Patashu). Thanks.

## α 1 - 2019/03/27

* [Creation](https://github.com/Naruyoko/OmegaNum.js/commit/c418630bc0f61c5426fff56fc6ad9acec2d2f54b).
