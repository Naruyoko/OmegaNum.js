# α 1.0.2.9 - 2019/11/07
* No duplicate codes in the main constructor and `fromSomething` functions.
* Added `new` on all constructor call. It is not required to be this way.
* Optimized `add` and `sub`.

# α 1.0.2.8 - 2019/11/06
* Fixed `affordGeometricSeries`, `affordArithmeticSeries`, `sumGeometricSeries`, and `sumArithmeticSeries` being broken if fed non-OmegaNum.
* Slightly optimized constructor when fed OmegaNum.

# α 1.0.2.7 - 2019/11/03
* Added `isInfinite`.
* Fixed `standarlize`.
* Slightly optimised `divide`.

# α 1.0.2.6 - 2019/11/01
* Fixed `Infinity` being less than `Number.MAX_SAFE_INTEGER+1`
* Fixed `-0` being less than `0`
* Fixed `fromString` being stupid [#29](https://github.com/Naruyoko/OmegaNum.js/issues/29).

# α 1.0.2.5 - 2019/10/31
* Fixed having `10^` not being counted in `fromString`.
* Made `logarithm` and `logBase` use natural logarithm if it recieved not base.
* Fixed logarithm of `Infinity` being `undefined`
* Fixed `eq` thinking that `NaN`=`0`
* Fixed `Infinity` and `NaN` being broken in some functions

# α 1.0.2.4 - 2019/10/20
* (Potentially) fixed memory leak. Now [TrueInfinity](https://reinhardt-c.github.io/TrueInfinity/) won't have 0.2 fps DevTools and >50MB heap.

# α 1.0.2.3 - 2019/10/19
* Added `fromJSON`.
* Added `toHyperE` and `fromHyperE`.
* Fixed multiple signs being not handled correctly in `fromString`
* Made code more safer in terms of stability(not regarding speed btw).

# α 1.0.2.2 - 2019/10/18
* Fixed and redesigned `fromString`'s logic [#26](https://github.com/Naruyoko/OmegaNum.js/issues/26).
* Fixed `fromNumber, fromString, fromArray, fromObject` being a non-static method.
* Fixed typo that broke the library [#27](https://github.com/Naruyoko/OmegaNum.js/issues/27).

# α 1.0.2.1
* Added `toObject, toJSON, fromNumber, fromString, fromArray, fromObject`
* Allowed creating `OmegaNum` from `Array` to have an additional variable of type `number` for `sign`, which can be placed either way.
* Allowed creating `OmegaNum` from `Object` that is not `OmegaNum`.

# α 1.0.2 - 2019/10/12
* Added `affordGeometricSeries, affordArithmeticSeries, sumGeometricSeries, sumArithmeticSeries` [#19](https://github.com/Naruyoko/OmegaNum.js/pull/19) `choose` [#21](https://github.com/Naruyoko/OmegaNum.js/pull/21) by Reinhardt-C.
* Fixed `tetr` and `arrow` being broken on large base [#17](https://github.com/Naruyoko/OmegaNum.js/issues/17).
* Fixed NaN returning NaN if the first argument is `0` [#22](https://github.com/Naruyoko/OmegaNum.js/issues/22).
* Fixed having something over tetration in string or array causes wrong results because I went stupid in `standarlize()` [#23](https://github.com/Naruyoko/OmegaNum.js/issues/23) [#25](https://github.com/Naruyoko/OmegaNum.js/issues/25).

# α 1.0.1.6 - 2019/05/26
* Added factorial `factorial` `fact`.

# α 1.0.1.5 - 2019/04/20
* Added exponential function `exponential` `exp`.
* Added pentation `pentation` `pent`.

# α 1.0.1.4 - 2019/04/15
* Fixed a bug which incorrectly overriden and `undefined` the static variables, making some methods such as `arrows` unusable.
* Unmatched tags in [README.md](https://github.com/Naruyoko/OmegaNum.js/blob/master/README.md) fixes.

# α 1.0.1.3 - 2019/04/09
* [#12](https://github.com/Naruyoko/OmegaNum.js/issues/12)'s `root` and `modulo` fix.
* `OmegaNum(NaN).toString="Infinity"` bug fix.

# α 1.0.1.2 - 2019/04/05
* Nice. [#12](https://github.com/Naruyoko/OmegaNum.js/issues/12)

# α 1.0.1.1 - 2019/04/02
* Welp, let's fix another bug in [#3](https://github.com/Naruyoko/OmegaNum.js/issues/3) and [#4](https://github.com/Naruyoko/OmegaNum.js/issues/4).

# α 1.0.1 - 2019/04/01
* [README.md](https://github.com/Naruyoko/OmegaNum.js/blob/master/README.md) fixes. ([#1](https://github.com/Naruyoko/OmegaNum.js/pull/1) [#2](https://github.com/Naruyoko/OmegaNum.js/pull/2) [#11](https://github.com/Naruyoko/OmegaNum.js/pull/11))
* Bugs. Like, 7 of them. ([#3](https://github.com/Naruyoko/OmegaNum.js/issues/3) [#4](https://github.com/Naruyoko/OmegaNum.js/issues/4) [#5](https://github.com/Naruyoko/OmegaNum.js/issues/5) [#6](https://github.com/Naruyoko/OmegaNum.js/issues/6) [#7](https://github.com/Naruyoko/OmegaNum.js/issues/7) [#8](https://github.com/Naruyoko/OmegaNum.js/issues/8) [#9](https://github.com/Naruyoko/OmegaNum.js/issues/9)). Oh, they are all by [Patashu](https://github.com/Patashu). Thanks.

# α 1 - 2019/03/27
* [Creation](https://github.com/Naruyoko/OmegaNum.js/commit/c418630bc0f61c5426fff56fc6ad9acec2d2f54b).
