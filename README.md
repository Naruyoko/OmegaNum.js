# ![OmegaNum.js](https://raw.githubusercontent.com/Naruyoko/OmegaNum.js/non-code/OmegaNumJS.png) ![0](https://raw.githubusercontent.com/Naruyoko/OmegaNum.js/non-code/0.png) ![.](https://raw.githubusercontent.com/Naruyoko/OmegaNum.js/non-code/dot.png) ![4](https://raw.githubusercontent.com/Naruyoko/OmegaNum.js/non-code/4.png) ![.](https://raw.githubusercontent.com/Naruyoko/OmegaNum.js/non-code/dot.png) ![3](https://raw.githubusercontent.com/Naruyoko/OmegaNum.js/non-code/3.png)
[![NPM](https://img.shields.io/npm/v/omega_num.js.svg)](https://www.npmjs.com/package/omega_num.js)
A huge number library holding up to 10{1000}9e15.

This reaches level f<sub>ω</sub>, hence the name.

Internally, it is represented as an sign and array. Sign is 1 or -1. Array is \[n<sub>0</sub>,n<sub>1</sub>,n<sub>2</sub>,n<sub>3</sub>...]. They together represents sign\*(...(10↑<sup>3</sup>)<sup>n<sub>3</sub></sup>(10↑↑)<sup>n<sub>2</sub></sup>(10↑)<sup>n<sub>1</sub></sup>n<sub>0</sub>).

For detailed explanation and documentation, [see here](https://naruyoko.github.io/OmegaNum.js/index.html).

Functions are as follows: `abs, neg, cmp, gt, gte, lt, lte, eq, neq, min, max, ispos, isneg, isNaN, isFinite, isint, floor, ceiling, round, add, sub, mul, div, rec, mod, gamma, fact, pow, exp, sqrt, cbrt, root, log10, logBase, log(alias ln), lambertw, tetr, ssrt, slog, pent, arrow, chain, hyper, affordGeometricSeries, affordArithmeticSeries, sumGeometricSeries, sumArithmeticSeries, choose`. Of course, there are `toNumber()`, `toString()` (`toValue`, `toStringWithDecimalPlaces`, `toExponential`, `toFixed`, `toPrecision`), and `toJSON()`. Add one of a kind `toHyperE()`.

If you are using built-in constants: Constants can not be replaced directly, however **the properties of it can. As the constants are also used inside OmegaNum.js, modifying them could CAUSE SERIOUS ISSUES AND POTENTIALLY RENDER THE LIBRARY UNUSABLE.**

If you are not planning to make something to the scale of [Incremental Unlimited](https://play.google.com/store/apps/details?id=com.antoine.mathematician.oddlittlegame) or [True Infinity](https://reinhardt-c.github.io/TrueInfinity), then use other libraries, such as, in ascending order:

* [break_infinity.js](https://github.com/Patashu/break_infinity.js) by Patashu - e9e15
* [decimal.js](https://github.com/MikeMcl/decimal.js) by MikeMcl - e9e15
* [logarithmica_numerus_lite.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/logarithmica_numerus_lite.js) by Aarex Tiaokhiao - e1.8e308
* [confractus_numerus.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/confractus_numerus.js) by Aarex Tiaokhiao - ee9e15
* [magna_numerus.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/magna_numerus.js) by Aarex Tiaokhiao - ?
* [break_eternity.js](https://github.com/Patashu/break_eternity.js) by Patashu - 10^^1.8e308

Future ideas:

* [ExpantaNum.js](https://github.com/Naruyoko/ExpantaNum.js) - f<sub>ω+1</sub>, array of value-index pair with separate counter.
* OmegaExpantaNum.js - f<sub>ω2</sub>
* MegotaNum.js - f<sub>ω<sup>2</sup></sub>
* PowiainaNum.js - f<sub>ω<sup>3</sup></sub>
* GodgahNum.js - f<sub>ω<sup>ω</sup></sub>

number library, big number, big num, bignumber, bignum, big integer, biginteger, bigint, incremental games, idle games, large numbers, huge numbers, googology, javascript
