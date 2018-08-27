'use strict';

var _tools = require('./tools');

var area = _interopRequireWildcard(_tools);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

console.log('圆的面积是:' + (0, _tools.circleArea)(5));
// main.js
//逐一加载

console.log('矩形的面积是:' + (0, _tools.rectArea)(5, 6));

//整体加载


console.log('圆的面积是:' + area.circleArea(5));
console.log('矩形的面积是:' + area.rectArea(5, 6));