
// main.js
//逐一加载
import { circleArea , rectArea } from './tools';

console.log( '圆的面积是:' + circleArea( 5 ) );
console.log( '矩形的面积是:' + rectArea( 5 , 6 ) );
 
//整体加载
import * as area from './tools';

console.log( '圆的面积是:' + area.circleArea( 5 ) );
console.log( '矩形的面积是:' + area.rectArea( 5 , 6 ));
  